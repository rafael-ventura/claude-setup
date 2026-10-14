# claude-setup

My Claude Code setup, versioned: a global CLAUDE.md, MCP servers, and **flowkit**, a plugin with a
spec-driven workflow, .NET agents and guardrail hooks.

## Install

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Prerequisites: Claude Code, Node 22, Serena (`serena.exe` in `~/.local/bin`) and
`dotnet tool install -g RoslynMcp.Server`.

## What's inside

```
global/CLAUDE.md            preferences for every project
plugins/flowkit/
  skills/                   /flowkit:spec, :plan, :tasks, :implement
  agents/                   dotnet-bug-hunter, messaging-reviewer
  hooks/                    guardians (guard.mjs)
install.ps1                 installs everything above plus the MCP servers
```

### Spec-driven flow

```
/flowkit:spec       specs/NNN-slug/spec.md     what and why, acceptance criteria
/flowkit:plan       specs/NNN-slug/plan.md     how: files, contracts, failure handling, tests
/flowkit:tasks      specs/NNN-slug/tasks.md    small ordered verifiable steps
/flowkit:implement  works through tasks.md, verifies each one, reviews the result
```

Each step stops for approval before the next.

### Guardians

Hooks run as code, so they hold even when the model forgets an instruction.

Always on:
- Blocks edits to secret files (`.env`, `.env.local`, keys, `credentials.json`). `.env.example` is fine.
- Blocks `git commit` while a secret file is staged.
- Blocks force-push to `main`/`master`.

Per project, opt in with `.claude/guardians.json`:

```json
{
  "forbidden": [{ "text": "—", "reason": "No em dashes in site copy.", "paths": ["src/"] }],
  "prePush": "npm run build"
}
```

### MCP servers

| Server | Use |
|---|---|
| serena, roslyn | Semantic C# navigation and refactoring |
| context7 | Up-to-date docs for third-party libraries |
| microsoft-learn | Official .NET and Azure docs |
| playwright | Scripted browser checks of running apps |

## Updating

Edit files here, then `claude plugin marketplace update rafael-setup` and restart Claude Code.
