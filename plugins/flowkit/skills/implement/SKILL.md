---
name: implement
description: Execute specs/NNN-slug/tasks.md one task at a time, verifying and ticking each box, then review the result. Use after /flowkit:tasks is approved, or when the user says to implement or continue a spec.
---

# Implement: build it task by task

Work from `specs/NNN-*/tasks.md`. Re-read `spec.md` and `plan.md` first.

## Loop, for each unchecked task in order
1. Implement only that task, following the patterns named in the plan.
2. Run its verification (test, build or command). If it fails, fix it before moving on. Never tick a box on a failing check.
3. Tick the box in `tasks.md`.
4. If the task turns out wrong or the plan no longer fits, **stop and tell the user**. Update the plan only with their agreement.

## When all tasks are done
1. Run the full build and test suite.
2. Walk the acceptance criteria in `spec.md` and tick the ones that are met, saying how each was verified.
3. For .NET changes that touch messaging, run the `messaging-reviewer` agent over the diff and address its findings.
4. Set `Status: done` in `spec.md` and summarize what changed, what was verified and anything left open.

Commit only if the user asks.
