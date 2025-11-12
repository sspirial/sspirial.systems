# Migration prompt (schema/events/storage)

You are GitHub Copilot (@copilot). Migrations must preserve data and replicas’ ability to sync.

Migration summary
- From events/schema: {v1 description, fields, invariants}
- To events/schema: {v2 description, fields, invariants}
- Rationale: {why change}

Must produce
1. Forward migration: introduce `v2.*` events and materializers in `template/src/livestore/schema.ts` (keep v1 for backward compatibility when feasible).
2. Optional rollback: notes or script to translate v2 back to v1 shape where possible.
3. Tests/verification:
   - Create sample v1 state/events
   - Apply migration/materializers
   - Verify invariants and continued sync behavior across replicas
4. PR migration notes: data risk, estimated time/cost, and any user‑visible changes.

Constraints
- Idempotent and safe to re‑run.
- Avoid destructive changes; prefer additive fields and new events.

Deliverable format
- Files to create/modify + run instructions and expected verification output.