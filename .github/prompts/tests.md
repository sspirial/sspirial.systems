# Test generation prompt (unit, migration, replication/e2e)

You are GitHub Copilot (@copilot). Produce tests aligned with LiveStore local‑first architecture.

Test goal
- {describe behavior}

Type
- unit / migration / replication-e2e / integration

If replication-e2e
- Replica count: {2 or 3}
- Scenario steps: events + connectivity changes
- Expected final state: JSON

Requirements
1. Unit: materializers — given initial state + event → expected table changes.
2. Replication: deterministic event order; simulate partition & reconnect (multi‑tab or harness).
3. Offline scenario: ensure events queued while disconnected apply correctly on reconnect.
4. Migration: sample old events/state → run migration → verify invariants & continued sync.
5. Provide run commands/steps and expected assertions.

Example output
- File: tests/materializers/todo-created.test.ts
- File: tests/replication/todo-conflict-merge.test.ts
- Run: `bun test` (unit) / manual replication steps if harness absent.