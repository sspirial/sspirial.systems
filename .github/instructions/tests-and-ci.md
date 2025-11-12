# Tests & CI (guidance for LiveStore)

Current state
- The template does not include a test harness yet. Add tests progressively as features grow.

Recommended checks in CI
- Typecheck and build: `bun run build` (Vite build) must succeed.
- Lint: ESLint should pass (invoke via `bun run lint` if script added).

Unit tests to add
- Materializers: given a starting DB state and an event, assert the resulting table state matches expectations.
- Schema invariants: ensure defaults and constraints hold (e.g., `completed` defaults to false).

Integration/manual tests
- Sync sanity: run `bun run dev`, open two tabs with different `storeId` values, apply conflicting edits, and verify convergence.
- Offline behavior: disconnect the network tab, perform edits, reconnect and confirm reconciliation.

Future e2e ideas
- Headless browser tests with Playwright to script two pages against the local dev server and assert final DOM/state.
- Worker‑level tests that spawn two in‑memory LiveStore instances and emulate push/pull.

Flake reduction
- Avoid real timeouts in tests; use simulated clocks where possible.
- Seed any randomized data.