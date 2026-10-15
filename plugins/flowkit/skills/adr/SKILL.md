---
name: adr
description: Record an architecture decision as a short ADR in docs/decisions - context, options considered, decision, consequences. Use when a significant technical choice is made or debated (database, messaging pattern, framework, service boundary), or when the user asks to document why something is the way it is.
---

# ADR: write down why, while it's fresh

## When it's worth one
The decision is hard to reverse, affects more than one component, or someone will ask "why did we do it this way?" in six months. Small local choices don't need one.

## Steps
1. Find the existing decision log (`docs/decisions/`, `docs/adr/` or `docs/decisions.md`) and follow its format and numbering. Create `docs/decisions/` if none exists.
2. Gather the real context from the conversation, the spec and the code. Ask the user for the constraints that aren't written anywhere: deadlines, team skills, costs.
3. List at least two real options, each with honest pros and cons. A straw-man alternative is worse than none.
4. Write the ADR with the template below, in plain words.
5. If it replaces an older decision, mark the old one as `Superseded by NNNN`.

## Template

```markdown
# NNNN · Decision title

Status: accepted · Date: YYYY-MM-DD

## Context
The problem and the forces at play.

## Options
1. **Option A**: pros, cons.
2. **Option B**: pros, cons.

## Decision
What we chose and the main reason.

## Consequences
What gets easier, what gets harder, what we'll need to watch.
```
