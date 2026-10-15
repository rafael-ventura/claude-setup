// Guardian hook for PreToolUse. Reads the tool call from stdin.
// Exit 0 lets the call through; exit 2 blocks it and shows stderr to Claude.
//
// Global rules (every project):
//   1. No edits to secret files (.env*, credentials, keys), .env.example and friends are allowed.
//   2. No `git commit` while a secret file is staged.
//   3. No force-push to main or master.
//
// Per-project rules, opt-in through <project>/.claude/guardians.json:
//   { "forbidden": [{ "text": "—", "reason": "...", "paths": ["src/"] }],
//     "prePush": "npm run build" }

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const SECRET_FILE = /(^|[\\/])(\.env(\.[\w-]+)?|credentials\.json|secrets?\.(json|ya?ml)|id_rsa|id_ed25519|[\w-]+\.(pem|pfx|p12|key))$/i;
const SECRET_ALLOWED = /\.env\.(example|sample|template)$|\.env-example$/i;

function block(message) {
  process.stderr.write(`[workbench guardian] ${message}\n`);
  process.exit(2);
}

function isSecretFile(path) {
  return SECRET_FILE.test(path) && !SECRET_ALLOWED.test(path);
}

function loadProjectRules(projectDir) {
  const file = join(projectDir, '.claude', 'guardians.json');
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    block(`Could not parse ${file}. Fix the JSON or remove the file.`);
  }
}

function newTextOf(tool, input) {
  if (tool === 'Write') return input.content ?? '';
  if (tool === 'Edit') return input.new_string ?? '';
  if (tool === 'MultiEdit') return (input.edits ?? []).map(e => e.new_string ?? '').join('\n');
  return '';
}

function checkFileEdit(tool, input, projectDir, rules) {
  const path = input.file_path ?? '';
  if (isSecretFile(path)) {
    block(`Editing ${basename(path)} is blocked: it looks like a secret file. Ask the user to change it by hand.`);
  }

  const rel = relative(projectDir, path).replaceAll('\\', '/');
  const text = newTextOf(tool, input);
  for (const rule of rules.forbidden ?? []) {
    const applies = !rule.paths || rule.paths.some(p => rel.startsWith(p));
    if (applies && text.includes(rule.text)) {
      block(`"${rule.text}" is not allowed in ${rel}. ${rule.reason ?? ''}`.trim());
    }
  }
}

function git(args, cwd) {
  return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

function checkBash(command, cwd, rules) {
  if (/\bgit\b.*\bcommit\b/.test(command)) {
    let staged = [];
    try {
      staged = git('diff --cached --name-only', cwd).split('\n').filter(Boolean);
    } catch {
      return; // not a git repo
    }
    const secrets = staged.filter(isSecretFile);
    if (secrets.length) {
      block(`Commit blocked: secret files are staged (${secrets.join(', ')}). Unstage them with "git restore --staged <file>".`);
    }
  }

  if (/\bgit\b.*\bpush\b/.test(command)) {
    const force = /\s(--force|-f|--force-with-lease)\b/.test(command);
    if (force && /\b(main|master)\b/.test(command)) {
      block('Force-push to main/master is blocked. Ask the user to do it by hand if it is really intended.');
    }
    if (force) {
      try {
        const branch = git('rev-parse --abbrev-ref HEAD', cwd).trim();
        if (branch === 'main' || branch === 'master') {
          block(`Force-push while on ${branch} is blocked. Ask the user to do it by hand if it is really intended.`);
        }
      } catch {
        // not a git repo
      }
    }

    if (rules.prePush) {
      try {
        execSync(rules.prePush, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
      } catch (err) {
        const output = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim().split('\n').slice(-20).join('\n');
        block(`Push blocked: "${rules.prePush}" failed. Fix it before pushing.\n${output}`);
      }
    }
  }
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    process.exit(0); // never break Claude Code over a malformed event
  }

  const tool = event.tool_name;
  const input = event.tool_input ?? {};
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();
  const rules = loadProjectRules(projectDir);

  if (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit') checkFileEdit(tool, input, projectDir, rules);
  if (tool === 'Bash') checkBash(input.command ?? '', event.cwd || projectDir, rules);
  process.exit(0);
});
