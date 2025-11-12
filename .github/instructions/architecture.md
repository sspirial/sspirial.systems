# Architecture: Local‑first with LiveStore (template‑aligned)

This project uses LiveStore to build a local‑first app where the browser is the primary execution and storage environment. Sync is optional and opportunistic via a Cloudflare Durable Object backend.

Core concepts
- Local‑first replica: Every client hosts a complete local replica backed by SQLite running in a Web Worker and persisted to OPFS.
- Event materialization: Domain events are applied to tables via materializers for deterministic state evolution.
- Background sync: When online, changes stream over WebSocket to a Durable Object; when offline, the app keeps working and reconciles on reconnect.
- Eventual consistency: Conflicts are resolved deterministically by schema/materializers and LiveStore’s semantics.

Client runtime (browser)
- LiveStore Provider: `template/src/Root.tsx` wires `LiveStoreProvider` with:
	- Persisted adapter using OPFS and both a Worker and SharedWorker for concurrency: `makePersistedAdapter({ storage: { type: 'opfs' }, worker, sharedWorker })`.
	- `storeId` derived from the `?storeId=` query param for per‑client identity (`template/src/util/store-id.ts`).
	- Optional `syncPayload` sent to the server for auth/validation.
- Web Workers:
	- App worker: `template/src/livestore.worker.ts` creates the LiveStore worker and configures sync with Cloudflare.
	- Shared worker (from `@livestore/adapter-web`) allows multiple tabs to share a single local engine.
- Devtools: Vite plugin enables LiveStore DevTools pointed at `template/src/livestore/schema.ts`.

Data model
- Schema is defined in `template/src/livestore/schema.ts`:
	- Tables: SQLite tables (e.g., `todos`) and client documents (e.g., `uiState`).
	- Events: Versioned event names like `v1.TodoCreated`, `v1.TodoCompleted`, …
	- Materializers: Map events to state using `State.SQLite.materializers`.
- Queries live in `template/src/livestore/queries.ts` and are consumed by UI components.

Sync backend (Cloudflare)
- Durable Object: `WebSocketServer` extends the LiveStore CF implementation in `template/src/cf-worker/index.ts`.
- Worker entry: `export default makeWorker({ validatePayload, enableCORS: true })`.
- Validation: `validatePayload` enforces a simple token (`authToken`) during development; replace before production.
- Wrangler config: `template/wrangler.toml` binds the Durable Object and a D1 database (`DB`) for persistence/backup.

Data flow
1. UI dispatches domain events via LiveStore.
2. Events are materialized into SQLite tables locally (Web Worker) and persisted to OPFS.
3. If connected, the worker streams batched operations to the Durable Object over WebSocket; pulls remote ops for convergence.
4. The Durable Object validates, persists (optionally to D1), and fans out to other clients.

Identity and multi‑tab behavior
- `storeId` distinguishes replicas (tabs/windows with different `storeId` sync as separate clients).
- SharedWorker ensures efficient resource usage across multiple tabs with the same origin.

Security and privacy
- Dev auth is a static token in code; production must use a secure token strategy and secrets management via Cloudflare.
- Do not place PII in logs. Keep `enableCORS` only as needed.

Ports and environments
- Vite dev server: port 60001 by default (`template/vite.config.ts`).
- Cloudflare wrangler (sync): port 8787 in dev (spawned automatically by Vite plugin).
- Client connects to `VITE_LIVESTORE_SYNC_URL` (set to `http://localhost:8787` in `npm run dev`).

Key files and entry points
- App root: `template/src/Root.tsx`
- LiveStore worker: `template/src/livestore.worker.ts`
- Schema and events: `template/src/livestore/schema.ts`
- Queries: `template/src/livestore/queries.ts`
- CF Worker/Durable Object: `template/src/cf-worker/index.ts`
- Tooling: `template/vite.config.ts`, `template/wrangler.toml`, `template/package.json`