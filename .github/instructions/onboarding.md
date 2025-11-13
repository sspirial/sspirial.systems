# Developer onboarding (LiveStore local‑first studio)

Prerequisites
- Node >= 23 (see `studio/package.json`). Manage versions via nvm.
- Bun installed (package manager and script runner).
- Cloudflare Wrangler (installed via dev dependencies).
- Modern browser supporting OPFS (Chrome, Edge, Firefox, Safari TP).

Quick start
1. Clone repo:
   `git clone <repo-url>`
2. Install dependencies:
   `bun install`
3. Start development (Vite + Wrangler sync server):
   `bun run dev`
   - Vite dev server on port 60001
   - Cloudflare sync server on port 8787
4. Open `http://localhost:60001` in the browser. A `storeId` will be added to the URL if absent (see `studio/src/util/store-id.ts`). Each unique `storeId` creates a distinct replica.
5. Open a second tab with a different `storeId` to observe cross‑replica sync.

Auth token
- Dev uses `authToken: 'insecure-token-change-me'` set in `studio/src/Root.tsx`. Replace for production and move to environment secret management.

Schema & events
- Review/modify `studio/src/livestore/schema.ts` for tables, events, materializers.
- Add queries in `studio/src/livestore/queries.ts` for UI consumption.

Local persistence
- Data persisted to browser OPFS via `makePersistedAdapter` (see `studio/src/Root.tsx`). Clearing site storage resets local DB.

Workers
- LiveStore worker: `studio/src/livestore.worker.ts` configures schema and sync.
- Shared worker imported via `@livestore/adapter-web` handles multi‑tab coordination.

Testing (future expansion)
- Unit tests: add tests for materializers and event logic (not yet present; create under `tests/`).
- Manual sync test: open two tabs with different `storeId` values and perform concurrent edits.

Common tasks
- Change ports: edit `studio/vite.config.ts` (Vite) or Wrangler `--port` spawn args.
- Update schema: modify events/materializers, keep versioned names (`v1.*`).
- Rotate auth token: update server `validatePayload` and client `syncPayload` together.

Troubleshooting
- Sync not working: verify `VITE_LIVESTORE_SYNC_URL` is set (script sets it implicitly) and that Wrangler logs show connections.
- Auth failures: ensure the token matches server expectation.
- Performance: inspect FPS overlay (enabled via `@overengineering/fps-meter`).

Getting help
- Open an issue describing expected vs observed behavior (include browser/version and steps).
- Provide console logs from both tabs and snippet from `validatePayload` if relevant.