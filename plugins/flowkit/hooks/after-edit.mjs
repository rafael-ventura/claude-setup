// PostToolUse hook: runs the project's formatter or linter on the file Claude just edited.
// Opt-in through <project>/.claude/guardians.json:
//   { "afterEdit": [{ "ext": [".ts", ".tsx"], "run": "npx prettier --write \"{file}\"" },
//                   { "ext": [".cs"], "run": "dotnet format --include \"{file}\"" }] }
// A failing command exits 2 so its output goes back to Claude to fix.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const file = event.tool_input?.file_path;
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd();
  const config = join(projectDir, '.claude', 'guardians.json');
  if (!file || !existsSync(config)) process.exit(0);

  let rules;
  try {
    rules = JSON.parse(readFileSync(config, 'utf8')).afterEdit ?? [];
  } catch {
    process.exit(0); // guard.mjs already reports a broken config
  }

  const ext = extname(file).toLowerCase();
  for (const rule of rules) {
    if (!rule.ext?.includes(ext)) continue;
    const command = rule.run.replaceAll('{file}', file);
    try {
      execSync(command, { cwd: projectDir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: 120_000 });
    } catch (err) {
      const output = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim().split('\n').slice(-20).join('\n');
      process.stderr.write(`[flowkit guardian] "${command}" failed after editing ${file}:\n${output}\n`);
      process.exit(2);
    }
  }
  process.exit(0);
});
