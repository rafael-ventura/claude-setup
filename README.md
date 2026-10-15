# workbench-ai

**workbench** is a Claude Code toolkit for shipping software faster **without lowering the bar**. It bundles three
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

Eighteen skills, grouped by the moment you need them. Each is a short Markdown file in
`plugins/workbench/skills/`; read them, they are the method written down.

### Understand
| Command | What it does |
|---|---|
| `/workbench:trace` | Follows a flow from the entry point through every layer, message and query, and draws a sequence diagram. Run it before changing unfamiliar code. |
| `/workbench:read-docs` | Reads PDFs and images as engineering input: specs, standards, vendor manuals, error screenshots, mockups and diagrams. Every extracted rule keeps its page number. |
| `/workbench:learn` | Teaches a new technology by mapping it to what you know, using your own repo as material, and leaves exercises for you to solve. |

### Build
| Command | What it does |
|---|---|
| `/workbench:develop` | The entry point. Sizes the request and takes the direct path for small changes or the spec flow for features. |
| `/workbench:spec` → `:plan` → `:tasks` → `:implement` | Spec-driven flow: what and why, then how, then small verifiable steps, then the build. Each step stops for your review. |
| `/workbench:refactor` | Changes structure without changing behavior: characterization tests first, one mechanical step at a time. |
| `/workbench:upgrade-dotnet` | .NET Framework to modern .NET, version bumps and package updates, project by project, always green. |

### Verify
| Command | What it does |
|---|---|
| `/workbench:unit-tests` | Tests that protect behavior and edge cases, proven by breaking the code once on purpose. |
| `/workbench:test` | Runs the app and checks it for real with Playwright, Chrome or HTTP calls, including the browser console and queues. |
| `/workbench:review` | Code review of a diff, branch or PR. Reports only bugs it can back with a concrete failure scenario. |

### Fix
| Command | What it does |
|---|---|
| `/workbench:debug` | Reproduce, gather evidence, test one hypothesis at a time, fix the root cause, add a regression test. |
| `/workbench:incident` | War-room mode: impact, mitigation first, a timeline from logs and deploys, then a blameless postmortem. Read-only on production. |
| `/workbench:sql-tune` | Slow SQL Server or PostgreSQL queries and ORM-generated SQL: execution plans, indexes, rewrites, measured before and after. |

### Ship and record
| Command | What it does |
|---|---|
| `/workbench:git` | Branches, commits, PRs and conflict resolution that reads the intent of both sides, asking before anything destructive. |
| `/workbench:adr` | Records an architecture decision with context, real options and consequences, while it's still fresh. |

**Agents:** `dotnet-bug-hunter` investigates .NET exceptions and failing tests;
`messaging-reviewer` checks consumers, publishers, outbox and sagas for duplicates, lost
messages, retries and poison messages.

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
| NuGet (official, Microsoft) | Package versions published after the model's training, vulnerabilities and compatible updates |
| Playwright | Scripted browser checks; Claude in Chrome covers logged-in sessions |

Add per project, in that repo's `.mcp.json`, because they need connection details:

| Server | When |
|---|---|
| [Postgres MCP Pro](https://github.com/crystaldba/postgres-mcp) | Postgres projects: schema, explain plans, index tuning. Use a read-only user |
| [Azure DevOps](https://github.com/microsoft/azure-devops-mcp) (`@azure-devops/mcp`) | Work items, repos and pipelines on Azure DevOps |
| [Aspire MCP](https://aspire.dev/get-started/aspire-mcp-server/) and [aspire-skills](https://github.com/microsoft/aspire-skills) | Aspire apps: resources, logs and traces of the running app. Both official from Microsoft |
| [RabbitMQ](https://github.com/amazon-mq/mcp-server-rabbitmq) | Inspect queues, bindings and error queues of a local broker while debugging messaging |
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

Edit the files here, then run `claude plugin marketplace update workbench-ai` and restart Claude Code.
