---
name: git
description: Git and GitHub work done safely - branches, checkout, commits, rebases and merges, pull requests and merge conflict resolution. Use when the user asks to commit, open a PR, sync with main, merge, switch branches or fix conflicts.
---

# Git: version control without surprises

## Always
- Run `git status` and `git log --oneline -5` before acting, and look at what will be affected.
- **Ask before anything that rewrites shared history or discards work:** force-push, `reset --hard`, `clean -fd`, `checkout -- .`, branch deletion, rebasing a pushed branch. Explain what will be lost.
- Never skip hooks (`--no-verify`) unless the user says so.
- Commit and push only when the user asks.

## Branches
- Don't work on `main` directly for features: create `feat/short-name`, `fix/short-name` or `chore/short-name` from an updated default branch.
- Before switching branches with local changes, ask whether to commit or stash them.

## Commits
- Stage only files related to the change. Check `git diff --cached` before committing and look for secrets, debug code and unrelated edits.
- Message: imperative summary under 72 characters, then a short body explaining **why** when it isn't obvious. Follow the repo's existing style if it has one.

## Syncing
- Prefer `git pull --rebase` on a personal branch and a merge for shared branches, unless the repo states otherwise.

## Pull requests
- Push the branch, then `gh pr create` with a title like the main commit and a body with: what changed, why, how it was tested, and anything the reviewer should look at first. Link the spec in `specs/` if there is one.
- Use `gh pr checks` to watch CI and report failures with their logs.

## Conflicts
1. List the conflicted files with `git diff --name-only --diff-filter=U`.
2. For each one, read both sides **and** the commits that introduced them (`git log --merge -p -- <file>`) to understand the intent of each change.
3. Resolve by keeping both intents when they are compatible. When they are not, stop and ask the user which behavior wins.
4. Build and run the tests before continuing the merge or rebase.
5. Summarize each resolution in the final message.
