---
name: tasks
description: Break an approved specs/NNN-slug/plan.md into tasks.md, a checklist of small, ordered, verifiable steps. Use after /flowkit:plan is approved.
---

# Tasks: slice the plan

Read `spec.md` and `plan.md` in the same folder and write `tasks.md`.

## Rules for a good task
- Small enough to finish and verify in one sitting, usually one commit.
- Ordered so the build and tests stay green after every task.
- Starts with a verb and names the file or component: "Add `PaymentReceived` consumer with idempotency check".
- Says how it is verified: a test name, a command, or a manual check.
- Tests come with the task that needs them, not in a final "write tests" task.

## Template

```markdown
# Tasks · NNN Feature name

- [ ] T1: ... (verify: `dotnet test --filter ...`)
- [ ] T2: ... (verify: ...)
```

Stop and show the list. Next step is `/flowkit:implement`.
