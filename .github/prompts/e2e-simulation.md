# Replication/e2e simulation prompt

You are GitHub Copilot (@copilot). Define a deterministic sync simulation.

Scenario name
- {scenario}

Requirements
1. Start N replicas (N = {2 or 3}) — either in‑memory harness or manual via tabs: `?storeId=A`, `?storeId=B`.
2. Seed initial state: {JSON}.
3. Perform event sequence (ordered) with causal metadata considerations.
4. Simulate network: partition A↔B at t1; independent ops; reconnect at t2.
5. Assert final converged state: {expected JSON}.
6. Provide debug logs: op id, replica id, lamport/clock, result.

Deliverables
- tests/replication/{scenario}.test.ts (if harness exists) OR manual steps with precise inputs/expected outputs.
- How to run and the expected assertion block.