---
name: review
description: Code review of the current diff, a branch or a GitHub PR, focused on bugs that would break in production, then security, then simplicity. Use when the user asks for a review, says "revisa", or before opening or merging a PR.
---

# Review: find what would break

## Scope
- No argument: the uncommitted diff plus commits not yet on the default branch (`git diff`, `git log origin/main..HEAD`).
- A PR number or URL: `gh pr view <n>` and `gh pr diff <n>`.
- A path: only that file or folder.

## How to review
1. **Understand the intent first.** Read the PR description, the linked spec in `specs/` if there is one, and the commit messages. A change can be correct code and still do the wrong thing.
2. **Read the surroundings, not only the diff.** Open the callers and callees of every changed method (Serena or Roslyn for C#). Most real bugs live where the diff meets unchanged code.
3. **Hunt in this order:**
   1. Correctness: wrong conditions, null and empty cases, off-by-one, time zones, culture-sensitive parsing, async without await, disposed objects, race conditions.
   2. Data: missing transactions, N+1 queries, migrations that lock or lose data, missing indexes on new filters.
   3. Security: injection, missing authorization checks, secrets in code or logs, personal data in logs.
   4. Messaging: if consumers, publishers or sagas changed, run the `messaging-reviewer` agent.
   5. Tests: do the tests exercise the changed behavior, or only the happy path?
   6. Simplicity: duplication of an existing helper, dead code, abstractions with one user.
4. **Verify before reporting.** For each suspected bug, describe the concrete input or state that triggers it. If you can't build a scenario, drop it or mark it as a question.

## Output
Findings ordered by severity, each with `file:line`, the failure scenario and the smallest fix. Separate "must fix" from "suggestions". If the change is fine, say so in one line. With `--comment` and a PR, post the findings as review comments with `gh`, only after the user confirms.
