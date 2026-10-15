---
name: sql-tune
description: Diagnose and speed up slow SQL Server or PostgreSQL queries, stored procedures and ORM-generated SQL (EF Core, NHibernate) using execution plans, indexes and query rewrites, measuring before and after. Use when a query, report, screen or endpoint is slow because of the database, or when reviewing a migration's indexes.
---

# SQL tune: measure, change one thing, measure again

## 1. Get the real query
- For ORMs, capture the generated SQL (EF Core logging or `ToQueryString()`, NHibernate `show_sql`, or the database's query store) with real parameter values.
- Note how often it runs and how many rows it should return. A 200 ms query run 10,000 times matters more than a 5 s monthly report.

## 2. Measure the baseline
- SQL Server: `SET STATISTICS IO, TIME ON` plus the actual execution plan. PostgreSQL: `EXPLAIN (ANALYZE, BUFFERS)`.
- Record logical reads, duration and row counts. Run twice to separate cold and warm cache.

## 3. Read the plan
Look for: scans on large tables, key lookups repeated many times, estimated vs actual rows far apart (stale statistics, parameter sniffing), implicit conversions (`varchar` vs `nvarchar`), sorts and hash spills to tempdb, functions on filtered columns that kill index use.

## 4. Fix, in order of preference
1. Rewrite the query: sargable predicates, no `SELECT *`, filter early, avoid row-by-row loops and cursors.
2. Fix the ORM usage: N+1 queries, missing `AsNoTracking`, loading full graphs to read one column.
3. Add or adjust an index: right key order, `INCLUDE` columns for covering. Check the cost on writes and the indexes that already exist.
4. Statistics and parameter sniffing fixes, only with evidence.

## 5. Prove it
Re-run the same measurement and show before and after. Check the result set is identical. Never run DDL on a shared or production database without explicit approval; deliver index changes as a migration.
