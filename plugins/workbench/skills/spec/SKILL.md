---
name: spec
description: Start a feature the spec-driven way by writing specs/NNN-slug/spec.md (problem, requirements, acceptance criteria, out of scope, open questions) before any code. Use when the user wants to start a new feature, says "spec", or describes something non-trivial to build.
---

# Spec: define the what and why

Write the spec for one feature. **No code and no implementation plan in this step.**

## Steps

1. **Understand the request.** Read the project's CLAUDE.md and skim the code areas the feature touches (prefer Serena's symbol tools for C#). Find similar existing features to stay consistent.
2. **Ask before assuming.** If the goal, the users, the data or the edge cases are unclear, ask up to 5 focused questions in one batch. Don't invent business rules.
3. **Create the folder.** `specs/NNN-short-slug/` at the repo root, where NNN is the next free 3-digit number.
4. **Write `spec.md`** with the template below. Every acceptance criterion must be testable.
5. **Stop and show the spec.** Next step is `/workbench:plan`, only after the user approves.

## Template

```markdown
# NNN · Feature name

Status: draft

## Problem
Who has the problem, what hurts today, why it matters now.

## Requirements
- R1: ...
- R2: ...

## Acceptance criteria
- [ ] AC1: Given ..., when ..., then ...
- [ ] AC2: ...

## Out of scope
- ...

## Open questions
- ...
```

## Rules
- Write the spec in the language the user is using; keep code identifiers in English.
- For messaging features, the spec must say what happens on duplicates, retries and failures, not only the happy path.
- Keep it short. A spec longer than one screen is usually two features.
