# Global preferences

## Communication
- Talk to me in Brazilian Portuguese. Code, identifiers, commit messages, PRs and docs in English unless the project says otherwise.
- I know C#/.NET, Angular and Vue 3 well and I'm learning React. When explaining frontend concepts, compare with Vue or Angular.
- Give a recommendation, not a menu of options.

## Environment
- Windows 11. Projects live in `C:\Dev`. Git Bash and PowerShell are both available.
- .NET 6, 7, 8 and 10 runtimes are installed; Node 22.

## Tools to prefer
- C# navigation and refactoring: Serena or Roslyn MCP before grepping.
- Third-party library APIs (React, MassTransit, etc.): Context7 before answering from memory.
- .NET and Azure APIs: Microsoft Learn MCP.
- Checking a running web app: Playwright MCP for scripted checks, Claude in Chrome when my logged-in browser is needed.
- GitHub: the `gh` CLI.

## Working rules
- Never push, deploy, publish or change account settings without asking first.
- Non-trivial features go through the flowkit flow: `/flowkit:spec` → `/flowkit:plan` → `/flowkit:tasks` → `/flowkit:implement`.
- Don't claim something works until it was built, run or tested. Say what was not verified.
