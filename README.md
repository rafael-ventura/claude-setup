# flowkit

A Claude Code toolkit for shipping software faster **without lowering the bar**. It bundles three
things that work together:

- **Skills** that encode a working method: how to review, test, trace a flow, write unit tests,
  handle Git and build features from a spec.
- **MCP servers** that give Claude the right sources: real code symbols, current library docs,
  official .NET docs and a real browser.
- **Guardians**, hooks that run as code and hold the line even when the model forgets an
  instruction: no secrets edited or committed, no force-push to main, no push on a broken build.

```
            you ── intent, context, judgment
             │
   ┌─────────▼─────────┐
   │      skills       │  method: what to do, in which order, how to verify
   ├───────────────────┤
   │    MCP servers    │  knowledge: code symbols, docs, browser
   ├───────────────────┤
   │     guardians     │  limits: what must never happen
   └─────────┬─────────┘
             ▼
        your codebase
```

## Where the efficiency comes from

| Without the kit | With the kit |
|---|---|
| Re-explaining how you like reviews, commits and tests every session | The method lives in skills and loads on demand |
| The model guessing a library API from memory | Context7 and Microsoft Learn fetch the current docs first |
| Grepping a large C# solution and missing DI registrations | Serena, Roslyn and the C# language server resolve real symbols |
| Finding the type error only when you build | Language servers report it right after the edit |
| "Please don't commit the .env" as a polite request | A hook that blocks it, every time |
| Features that drift from what was asked | Spec → plan → tasks → implement, with a stop for review at each step |

## It works best when you bring your part

The kit multiplies what you already know. It does not replace it.

- **Know the documentation.** Read the skill files and the README of each MCP. Knowing what a
  skill will do, and what a server can reach, is how you pick the right one and spot when the
  output is off.
- **Know the language and the domain.** You can only judge a review of messaging code if you
  understand idempotency and retries yourself. The kit speeds up an engineer; it doesn't make one.
- **Say what you want, precisely.** Name the goal, the constraints, the files involved and what
  "done" means. A vague request gets a plausible answer; a precise one gets the right one.
- **Stay in the loop.** Read specs and plans before approving them, and read the diff before
  merging. The checkpoints exist so your judgment lands where it matters most.

## Skills

| Command | What it does |
|---|---|
| `/flowkit:develop` | Entry point: sizes the request and takes the direct path or the spec flow |
| `/flowkit:spec` → `:plan` → `:tasks` → `:implement` | Spec-driven flow for features, one reviewed file per step in `specs/NNN-slug/` |
| `/flowkit:trace` | Follows a flow end to end, across layers and messages, with a sequence diagram |
| `/flowkit:review` | Code review of a diff, branch or PR: correctness first, then data, security, messaging, tests |
| `/flowkit:unit-tests` | Tests that protect behavior and edge cases, proven by breaking the code once |
| `/flowkit:test` | Runs the app and checks it end to end with Playwright, Chrome or real HTTP calls |
| `/flowkit:git` | Branches, commits, PRs and conflict resolution, asking before anything destructive |

Agents: `dotnet-bug-hunter` for .NET errors and failing tests, `messaging-reviewer` for consumers,
publishers, outbox and sagas.

## Guardians

Always on:
- Block edits to secret files: `.env`, `.env.local`, keys, `credentials.json`. `.env.example` is fine.
- Block `git commit` while a secret file is staged.
- Block force-push to `main`/`master`.

Per project, in `.claude/guardians.json`:

```json
{
  "forbidden": [{ "text": "—", "reason": "No em dashes in site copy.", "paths": ["src/"] }],
  "prePush": "npm run build",
  "afterEdit": [
    { "ext": [".ts", ".tsx"], "run": "npx prettier --write \"{file}\"" },
    { "ext": [".cs"], "run": "dotnet format --include \"{file}\"" }
  ]
}
```

## MCP servers and language servers

Installed for every project:

| Server | Why |
|---|---|
| Serena, Roslyn | Semantic C# navigation and refactoring |
| C# and TypeScript language servers | Errors right after each edit (Anthropic's official LSP plugins) |
| Context7 | Current, version-specific docs for third-party libraries |
| Microsoft Learn | Official .NET and Azure documentation |
| Playwright | Scripted browser checks; Claude in Chrome covers logged-in sessions |

Add per project, in that repo's `.mcp.json`, because they need connection details:

| Server | When |
|---|---|
| [Postgres MCP Pro](https://github.com/crystaldba/postgres-mcp) | Postgres projects: schema, explain plans, index tuning. Use a read-only user |
| [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) (`@azure-devops/mcp`) | Work items, repos and pipelines on Azure DevOps |
| A SQL Server MCP | SQL Server projects. There's no official one yet; prefer a read-only login |

Left out on purpose: the GitHub MCP, because the `gh` CLI does the same with less context; Memory
and Sequential Thinking, because Claude Code has built-in memory and extended thinking. Every
server adds tool descriptions to each request, so fewer good servers beat many.

## Install

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Prerequisites: Claude Code, Node 22, the .NET SDK, Serena (`serena.exe` in `~/.local/bin`) and
`dotnet tool install -g RoslynMcp.Server`. Re-running the script is safe.

## Updating

Edit the files here, then run `claude plugin marketplace update rafael-setup` and restart Claude Code.
