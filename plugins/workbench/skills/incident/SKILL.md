---
name: incident
description: Investigate a production incident like a war room - build a timeline from logs, timestamps, data and deploys, separate mitigation from root cause, and write a blameless postmortem. Use when the user reports something broken in production, an outage, data inconsistency or a spike of errors.
---

# Incident: timeline first, theories second

## 1. Frame it (2 minutes)
- What is the impact right now: who is affected, since when, is it growing?
- Is there a safe mitigation available now: rollback, feature flag, pause a consumer, scale? **Propose it first; the user decides.** Never run anything against production without explicit approval.

## 2. Build the timeline
Collect events with exact timestamps and time zones into one table:
deploys and config changes, first error, error rate changes, related alerts, user reports, scheduled jobs, external provider issues.
Normalize every timestamp to one zone. Mismatched zones are a classic false lead.

## 3. Narrow it down
- What changed right before the first error? Start there.
- Compare a failing case with a working one: same endpoint, tenant, payload size, version?
- For data problems, find the first bad record and walk back what wrote it.
- For messaging, check queue depth, error queues, redeliveries and consumer restarts.
- Use read-only queries. Never run `UPDATE` or `DELETE` on production data without explicit approval and a backup plan.

## 4. Root cause and fixes
Separate: the **trigger** (what started it), the **root cause** (why it was possible) and the **contributing factors** (why it took long to detect or fix).

## Output: blameless postmortem
```markdown
# Incident · <title> · <date>
Impact · Timeline · Trigger · Root cause · Contributing factors · What went well · Action items (owner, priority)
```
Keep client names and personal data out of anything that leaves the company.
