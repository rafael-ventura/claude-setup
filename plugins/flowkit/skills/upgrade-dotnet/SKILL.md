---
name: upgrade-dotnet
description: Plan and execute .NET upgrades - .NET Framework to modern .NET, or between .NET versions - and NuGet package updates, project by project with breaking-change checks and green builds at every step. Use when the user wants to upgrade a target framework, migrate off .NET Framework, update packages or fix vulnerable dependencies.
---

# Upgrade .NET: one project, one step, always green

## 1. Assess
- Inventory: every project, its target framework, SDK-style or not, and its project references. Draw the dependency order; upgrade from the leaves up.
- Packages: use the NuGet MCP server to check the latest compatible versions and known vulnerabilities. Flag packages with no support for the target.
- Blockers for .NET Framework migrations: `System.Web`, WCF server, WebForms, `AppDomain`, remoting, `BinaryFormatter`, Windows-only APIs. Each needs a decision, not a find-and-replace.
- Read the official breaking changes for every version crossed (Microsoft Learn MCP).

## 2. Plan
Write the order, the blockers with a proposed path for each, and the test strategy. Show it to the user before changing anything. For big migrations, use the spec flow.

## 3. Execute, per project
1. Convert to SDK-style if needed.
2. Change the target framework, or multi-target during the transition so the solution keeps building.
3. Update packages in small groups, not all at once.
4. Build with warnings visible and run the tests. Fix before the next project.
5. Commit per project so any step can be reverted alone.

## 4. Verify
Full build, all tests, and a run of the app with `test`. List behavior differences found and anything deferred.
