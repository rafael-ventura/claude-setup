---
name: develop
description: Entry point for building something. Sizes the request and either implements a small change directly with verification, or routes a larger feature through spec, plan, tasks and implement. Use when the user asks to build, add, change or fix something and hasn't picked a specific flow.
---

# Develop: right-sized process

## 1. Size the request
Read the request and the code it touches, then classify:

| Size | Signals | Path |
|---|---|---|
| Small | One area, clear behavior, under ~100 changed lines, no new contracts | Direct, section 2 |
| Feature | New behavior across layers, new endpoints, messages or tables, unclear rules | `/flowkit:spec` → `plan` → `tasks` → `implement` |
| Bug | Something that used to work or should work | `trace` the flow, reproduce, then fix as Small with a regression test from `unit-tests` |

Tell the user which path you picked in one line. They can override it.

## 2. Small change, direct path
1. Find the existing pattern for this kind of change and follow it. Use Serena or Roslyn for C#, Context7 for library APIs.
2. Make the change.
3. Add or update tests for the changed behavior (see `unit-tests`).
4. Build and run the tests. For user-facing changes, run `test`.
5. Run `review` on your own diff and fix what it finds.
6. Summarize what changed and how it was verified. Commit only if asked.

## Rules
- Match the surrounding code: naming, comments, error handling, folder structure.
- Don't refactor unrelated code in the same change. Note it as a follow-up instead.
- If the request is ambiguous on a business rule, ask. Don't invent one.
