# Copilot Instructions — Global guidance (Local‑first + LiveStore)

Goal
- Help maintainers build and evolve this local‑first app using LiveStore for offline‑first UX and realtime sync.
- Prefer small, well‑tested edits that preserve data consistency and migration safety.

Read this first (in this repo)
- Guidance: `.github/instructions/architecture.md`, `sync-contracts.md`, `dependencies.md`, `onboarding.md`, `tests-and-ci.md`.
- studio entry points:
   - Client/provider: `studio/src/Root.tsx`
   - Worker: `studio/src/livestore.worker.ts`
   - Schema/events/materializers: `studio/src/livestore/schema.ts`
   - Queries: `studio/src/livestore/queries.ts`
   - CF Worker/Durable Object: `studio/src/cf-worker/index.ts`
   - Tooling: `studio/package.json`, `studio/vite.config.ts`, `studio/wrangler.toml`
- Prompts to use: `.github/prompts/*` (bug‑fix, code‑generation, code‑review, tests, migration, security, etc.).

Dev/run facts
- Node >= 23; `bun run dev` starts Vite (port 60001) and Wrangler (port 8787).
- Client connects to `VITE_LIVESTORE_SYNC_URL` (set to `http://localhost:8787` by the dev script).
- Each tab’s replica is identified by `?storeId=...` (see `studio/src/util/store-id.ts`).

How to behave (priority order)
1. Make the smallest safe change that implements the request.
2. Keep behavior deterministic; preserve event names and storage format unless migrating with a version bump.
3. Add/update tests for materializers and describe manual replication checks (multi‑tab with different `storeId`s) if no harness exists.
4. Use only allowed dependencies (`.github/instructions/dependencies.md`). Propose new deps in a separate PR with justification.
5. Be conservative with schema/materializers; migrations must include tests and rollback notes.
6. For conflict scenarios, give a deterministic sequence and expected merged state across two or more replicas.
7. When unsure about offline/sync behavior, ask a brief clarifying question rather than guessing.

Where to implement typical changes
- New event/state change: `studio/src/livestore/schema.ts` (add versioned event `vN.*` + materializer).
- UI behavior: component in `studio/src/components/*` and queries in `studio/src/livestore/queries.ts`.
- Provider/adapter or sync payloads: `studio/src/Root.tsx` and `studio/src/livestore.worker.ts`.
- Server‑side validation or logging: `studio/src/cf-worker/index.ts` (update `validatePayload`, avoid PII in logs).

What to include in PR descriptions
- Summary of what changed and why.
- Files changed and why (call out schema/materializers).
- Tests added/updated and how to run them; describe multi‑tab steps if needed.
- Migration steps and compatibility notes (plus rollback plan if applicable).
- Offline/sync impact and risk assessment (low/medium/high).

Formatting and tone
- Be concise and action‑oriented.
- Add small inline comments for non‑obvious sync or merge decisions.

Testing & CI
- Include:
   - Unit tests for materializers/invariants (or clear manual verification steps).
   - Replication checks: two tabs with different `storeId`s; simulate offline/reconnect.
   - Migration tests when touching schema/events.
- See `.github/instructions/tests-and-ci.md`.

Security & secrets
- Don’t hardcode secrets for production; move tokens to Cloudflare secrets and validate via `validatePayload` on the server.
- Keep CORS constrained in production; avoid logging PII.
- If adding encryption or key changes, document rotation and migration.

Quick rules for common tasks
- Add new feature: introduce a versioned event + materializer; wire UI; update queries; add tests.
- Change storage/event semantics: add `v2.*` events and migration path; keep v1 for backward compatibility when feasible.
- Fix sync bug: reproduce deterministically, apply minimal fix, add regression coverage.

If you cannot comply with these rules, explain why and propose safe alternatives.