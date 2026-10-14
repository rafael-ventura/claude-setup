---
name: plan
description: Turn an approved specs/NNN-slug/spec.md into plan.md, the technical approach (files, contracts, data, risks, test strategy). Use after /flowkit:spec is approved, or when the user asks how to implement a spec.
---

# Plan: decide the how

Read `specs/NNN-*/spec.md` (ask which one if there are several drafts) and write `plan.md` next to it. **Still no production code.**

## Steps

1. **Research the codebase.** Map the entry points, the layers the change crosses and the existing patterns to reuse. Use Serena or Roslyn for C# symbols, Context7 for third-party library docs and Microsoft Learn for .NET APIs. Never guess an API signature.
2. **Pick one approach.** If there are real alternatives, list them in one line each with the trade-off, then commit to one and say why.
3. **Write `plan.md`** with the template below.
4. **Check against the spec.** Every requirement and acceptance criterion must map to something in the plan. Flag gaps instead of silently dropping them.
5. **Stop and show the plan.** Next step is `/flowkit:tasks`.

## Template

```markdown
# Plan · NNN Feature name

## Approach
Two to five sentences.

## Changes
| Area | File or component | Change |
|---|---|---|

## Contracts
Endpoints, messages/events (name, payload, producer, consumers), DB changes and migrations.

## Failure handling
Idempotency, retries, error queues, timeouts, compensation. Write "not applicable" only when it truly isn't.

## Test strategy
Which ACs are covered by unit, integration or end-to-end tests.

## Risks
- ...
```
