# Sync contracts & conventions (LiveStore + Cloudflare Durable Objects)

Where the contract is implemented
- Client worker: `template/src/livestore.worker.ts` using `@livestore/adapter-web` and `@livestore/sync-cf`.
- Server: `template/src/cf-worker/index.ts` via `makeDurableObject` and `makeWorker` from `@livestore/sync-cf/cf-worker`.

Transport
- WebSocket at `VITE_LIVESTORE_SYNC_URL` (dev: `http://localhost:8787`). Vite starts Wrangler automatically so both client and server run during `npm run dev`.

Authentication and validation
- Client provides `syncPayload` (e.g., `{ authToken }`) via `LiveStoreProvider` in `template/src/Root.tsx`.
- Server validates with `validatePayload(payload)`; the template requires `authToken === 'insecure-token-change-me'` (change in production).

Operation batches
- The protocol exchanges batched operations including causal metadata (clocks/cursors) managed by LiveStore. You typically don’t need to shape these manually.
- Durable Object hooks:
  - `onPush(message)`: invoked on incoming batches from clients.
  - `onPull(message)`: invoked when clients request batches to catch up.
- In the template, these log to the console for visibility; extend to persist to D1 or run server‑side validations.

Persistence and backup
- D1 binding `DB` is configured in `template/wrangler.toml`. Use it to persist server‑side indexes or backups of ops.
- Backup strategy should store operation logs or compacted snapshots; restore by replaying ops into a fresh replica.

Versioning & evolution
- Version event names (e.g., `v1.*`). New events are additive; breaking changes create `v2.*` events with migrations.
- Keep server and client `@livestore/*` versions pinned and upgraded in lockstep.

Observability
- Avoid logging payload contents that may include user data. Prefer counters, durations, and connection state transitions.

CORS and deployment
- `enableCORS: true` is set for development. Scope origins appropriately in production.
- Configure secrets and database IDs via Wrangler/Cloudflare environment rather than hardcoding.