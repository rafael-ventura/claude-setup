---
name: refactor
description: Change the structure of code without changing its behavior, in small safe steps protected by tests - extract, rename, move, split classes, remove duplication, untangle dependency injection. Use when the user asks to refactor, clean up, simplify or reorganize code.
---

# Refactor: same behavior, better shape

## Before touching anything
1. **Agree on the goal.** What gets better: readability, testability, coupling, a planned feature that needs room? Refactoring without a goal is churn.
2. **Pin the behavior.** Find the tests covering the code. If coverage is thin, write characterization tests first that record what the code does today, bugs included.
3. **Map the blast radius** with Serena or Roslyn: every caller, implementation and DI registration of what will move or change signature.

## While refactoring
- One kind of change per step: rename, then move, then extract. Build and run the tests after each step.
- Prefer tool-driven refactors (Serena or Roslyn rename, IDE-safe moves) over text replacement, so references update correctly.
- Keep public contracts stable: API routes, message types, DB schema, serialized names. If one must change, stop and plan it as a migration.
- Don't fix bugs on the way. Note them and fix separately, so a behavior change never hides inside a refactor.

## Done when
Tests pass unchanged, the build has no new warnings, and the diff reads as a sequence of mechanical steps. Summarize the steps and the measurable improvement.
