---
name: test
description: Verify that a change actually works by running the app and exercising it end to end, through the browser with Playwright or Claude in Chrome, or through the API with real requests. Use when the user asks to test, check, validate or "see it working", or after implementing a user-facing change.
---

# Test: see it working

Unit tests passing is not the same as the feature working. This skill runs the real thing.

## Steps
1. **Decide what "working" means.** Take the acceptance criteria from `specs/NNN-*/spec.md` if they exist; otherwise write 3 to 6 concrete checks with the user's request as the source.
2. **Start the app** with the project's own command (README, CLAUDE.md, `package.json`, `launchSettings.json`, Aspire AppHost). Run it in the background and wait until it answers.
3. **Pick the tool:**
   - **Playwright MCP** for repeatable checks on local or public pages: clicks, forms, navigation, console errors, screenshots at desktop and mobile widths.
   - **Claude in Chrome** when the check needs the user's logged-in session.
   - **HTTP requests** (`curl` or the project's `.http` files) for APIs, including error cases: invalid input, missing auth, duplicates.
4. **Run each check** and record pass or fail with evidence: a screenshot, a response body, a console message.
5. **Check what users don't see:** the browser console, server logs, and for messaging flows the queues and error queues.
6. **Stop the app** you started.

## Output
A table of checks with result and evidence. For each failure, the steps to reproduce. Never report a check as passed if it was not actually run; say "not verified" and why.

## Safety
Never enter real credentials or payment data. Use the project's seed or test data, and only on local hosts.
