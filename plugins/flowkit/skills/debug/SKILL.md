---
name: debug
description: Systematic debugging - reproduce, gather evidence, form and test one hypothesis at a time, fix the root cause and lock it with a regression test. Use when something fails, throws, returns wrong data or behaves differently than expected, before proposing any fix.
---

# Debug: root cause before fix

The fastest wrong move is changing code until the symptom disappears. Find the cause first.

## 1. Reproduce
- Get the exact failure: full error, stack trace with inner exceptions, input, environment, timestamp.
- Reproduce it locally with the smallest input possible, ideally as a failing test. If it can't be reproduced, say so and switch to evidence gathering in step 2.

## 2. Gather evidence
- Read the code on the failing path end to end (see `trace`). Read, don't skim.
- Check what changed: `git log -p --since=...` on the files involved, recent dependency bumps, config and data changes.
- Collect logs around the timestamp, the data involved and, for messaging, the queue and error queue contents.

## 3. Hypothesize and test, one at a time
- Write the hypothesis as a sentence: "X happens because Y, so if Z then we should see W."
- Design the cheapest check that could prove it wrong: a log line, a debugger breakpoint, a query, a test.
- Run it. If wrong, discard it and write down what you learned. Never stack two unverified fixes.
- After three failed hypotheses, step back and question the assumptions: is the reproduction right? Is it the code you think is running?

## 4. Fix
- Fix the cause, not the symptom. If the right fix is large, propose it and offer a contained mitigation separately.
- Add a regression test that fails before the fix and passes after (see `unit-tests`).
- Search for the same pattern elsewhere: the same bug often lives in sibling code.

## Output
Root cause in two sentences, the evidence that proves it, the fix, the regression test, and other places checked. For .NET exceptions you can hand the investigation to the `dotnet-bug-hunter` agent.
