# API and Sync Contracts (LiveStore + Cloudflare)

Scope
- The user‑facing application communicates primarily via LiveStore’s sync protocol over WebSocket to a Cloudflare Durable Object. There is no traditional REST API in this template. If you add HTTP APIs, define them separately.

Sync endpoint
- URL: `VITE_LIVESTORE_SYNC_URL` (dev: `http://localhost:8787`), configured in `template/package.json` and consumed by `template/src/livestore.worker.ts`.
- Protocol: WebSocket speaking LiveStore’s batched push/pull protocol handled by `@livestore/sync-cf`.

Authentication / validation
- The Cloudflare worker validates an auth payload via `validatePayload` in `template/src/cf-worker/index.ts`.
- Dev default: expects `{ authToken: 'insecure-token-change-me' }` in the client `syncPayload` (set in `template/src/Root.tsx`). Change this before production and load secrets via Cloudflare.

Message shape (conceptual)
- Push (client ➜ server): a batch of operations/events with causal metadata.
- Pull (server ➜ client): server’s latest known operations relevant to the client’s cursor/clock.
- The Durable Object created via `makeDurableObject` automatically implements the protocol; you typically do not hand‑craft these messages.

Versioning
- Version event names (e.g., `v1.TodoCreated`) to manage evolution without breaking older replicas.
- The worker and client should remain compatible within a release line of `@livestore/*` packages pinned in `template/package.json`.

Errors
- Validation failures in `validatePayload` reject the connection or messages; do not leak sensitive details in error messages.
- Handle errors client‑side by observing LiveStore provider status and surfacing actionable messages.

Extending with HTTP APIs (optional)
- If you add REST/GraphQL endpoints, use JSON only, proper status codes, and document them here with examples. Keep them orthogonal to LiveStore sync.