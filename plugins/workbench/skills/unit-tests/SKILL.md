---
name: unit-tests
description: Analyze a class, method or change and write unit tests that protect real behavior - business rules, edge cases and past bugs - instead of chasing coverage. Use when the user asks for tests, says a piece of code is untested, or after a bug fix that needs a regression test.
---

# Unit tests: tests that earn their place

A good test fails when the behavior breaks and only then. Tests that mirror the implementation line by line break on every refactor and catch nothing.

## Steps
1. **Learn the house style.** Find existing tests for similar code and copy their framework (xUnit, NUnit, Jest, Jasmine), naming, builders and mocking library. Don't introduce a new one.
2. **Map the behavior,** not the code paths:
   - What are the business rules? Write them down as sentences first.
   - What are the edge cases? Empty, null, zero, negative, boundaries, duplicates, time zones, rounding of money.
   - What has broken before? Check `git log -S` and bug-fix commits touching this code.
3. **Show the list of test cases** to the user before writing code when there are more than 8, so they can cut or add.
4. **Write the tests:**
   - One behavior per test, named after it: `Withdraw_WhenBalanceIsInsufficient_ThrowsAndKeepsBalance`.
   - Arrange, act, assert, visibly separated.
   - Mock only what crosses a boundary: database, network, clock, message bus. Don't mock the class under test or simple value objects.
   - Assert on outcomes the caller can see, not on private calls.
5. **Prove they work.** Run them. Then break the code on purpose for at least one important case and confirm the test fails. Revert the break.

## Output
The tests, the command to run them, and a short list of the behaviors now protected and anything deliberately left untested.
