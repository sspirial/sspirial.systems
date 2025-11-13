# Project overview (LiveStore local‑first studio)

What this is
- A React + LiveStore TodoMVC app demonstrating a local‑first architecture with optional realtime sync using Cloudflare Durable Objects.

Primary goals
- Instant local UX with durable persistence in the browser (OPFS + SQLite in a Worker).
- Reliable background sync and deterministic conflict handling.
- Minimal backend surface area using Cloudflare Workers.

Non‑goals
- Not a server‑authoritative system; the server validates and relays, but clients own their local replicas.

Key features
- Versioned domain events (e.g., `v1.TodoCreated`) materialized into tables.
- Multi‑tab efficiency via SharedWorker.
- Devtools integration for inspecting schema and state.

Stack
- React 19, Vite 6, TypeScript 5
- LiveStore packages: adapter‑web, livestore, react, sync‑cf, wa‑sqlite
- Cloudflare Worker + Durable Object with D1 binding

Entry points and important files
- App entry: `studio/src/main.tsx`
- App root/provider: `studio/src/Root.tsx`
- Schema/events/materializers: `studio/src/livestore/schema.ts`
- Queries: `studio/src/livestore/queries.ts`
- LiveStore Worker: `studio/src/livestore.worker.ts`
- CF Worker/Durable Object: `studio/src/cf-worker/index.ts`
- Tooling: `studio/vite.config.ts`, `studio/wrangler.toml`, `studio/package.json`

How to run
- `bun run dev` starts Vite (port 60001) and Wrangler (port 8787). The client auto‑connects to the sync server.

Where to start reading code
- Read `schema.ts` to understand data and events, then `Root.tsx` to see provider setup, and `cf-worker/index.ts` for the server side.