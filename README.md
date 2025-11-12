# LiveStore Local-First Template

This repository contains a **LiveStore local-first application template**. It demonstrates how to build a React + LiveStore app with:
- Immediate, offline-capable local state (SQLite in a Web Worker persisted to OPFS)
- Versioned domain events materialized deterministically into tables
- Background realtime sync via a Cloudflare Durable Object + D1 (optional when online)
- Multi-tab efficiency using a SharedWorker
- Devtools integration for inspecting schema, events, and state

## What this template includes

Key files (under `template/`):
- `template/src/Root.tsx` – LiveStore provider setup (adapter, schema, sync payload, storeId)
- `template/src/livestore.worker.ts` – Worker initialization + sync configuration
- `template/src/livestore/schema.ts` – Tables, events (`v1.*`), and materializers
- `template/src/livestore/queries.ts` – Sample query/selectors
- `template/src/util/store-id.ts` – Stable per-replica identity via `?storeId=` query param
- `template/src/cf-worker/index.ts` – Cloudflare Durable Object / Worker sync endpoint with payload validation
- `template/vite.config.ts` – Vite config + Wrangler dev spawn + DevTools plugin
- `template/wrangler.toml` – Durable Object and D1 bindings
- `template/package.json` – Pinned LiveStore + React dependencies and dev scripts

Supporting guidance (under `.github/instructions/` & `.github/prompts/`):
- Architecture, sync contracts, dependencies, onboarding, testing guidance
- Prompt templates (bug fix, code generation, code review, migration, security, tests)
- Copilot instructions that define expected behaviors for automated assistance

## Using this template for a new project "X"

When you create a new LiveStore project from this template, you should:
1. Choose a project name: `X`
2. Instruct AI (e.g., Copilot/assistant) to perform a **rename from `template` to `X`** across relevant files.
3. Update metadata and identifiers as described below.

### Minimum rename/actions list
Ask AI to:
- Rename folder `template/` to `<X>/` (or move its contents to project src structure).
- Update `name` field in `template/package.json` to something like `livestore-<x>`.
- Adjust event names if version scope changes (keep `v1.*` unless starting new version lineage).
- Replace any placeholder secrets (e.g., auth token in `template/src/Root.tsx` and validation in `template/src/cf-worker/index.ts`).
- Update `wrangler.toml` values (`name`, `database_name`, optional `database_id`).
- Search for `template/src/livestore/schema.ts` references and ensure paths reflect the new location.
- Update documentation references in `.github/instructions/*` and `.github/prompts/*` from `template/` to your new path.

### Suggested AI instruction example
```
Please rename the LiveStore template to project "X":
1. Move/rename `template/` directory to `x/`.
2. Update package.json name → `livestore-x`.
3. Replace auth token in Root.tsx and cf-worker/index.ts with an environment-based secret.
4. Adjust wrangler.toml (service name + database_name).
5. Update all docs/prompts referencing `template/` to `x/`.
6. Confirm dev still works: `bun run dev` (Vite + Wrangler) and syncing two tabs with different storeIds.
```

### After renaming
- Run `bun run dev` and open `http://localhost:60001/?storeId=A` and `/?storeId=B` to verify sync.
- Confirm logs from Cloudflare worker show `onPush` / `onPull` events.
- Replace the insecure auth token before any public deployment.

## Customizing further
- Add new events: create versioned names (`v1.NewEvent`) in `schema.ts` and materializers.
- Add queries/selectors: expand `queries.ts` for UI consumption.
- Extend server validation: enhance `validatePayload` with proper auth; integrate D1 persistence.
- Testing: introduce unit tests for materializers and describe manual replication steps (multi-tab) until a harness is added.

## Requirements & best practices
- Keep schema changes additive; introduce new version namespaces (`v2.*`) only when necessary.
- Avoid logging PII in Cloudflare worker.
- Pin and upgrade LiveStore packages together (see `dependencies.md`).
- Use prompts in `.github/prompts/` to standardize changes (bug fixes, migrations, reviews).

## Getting help
If automation or AI assistance is unclear:
- Review `.github/copilot-instructions.md` for expectations.
- Consult architecture and sync docs under `.github/instructions/`.
- Open an issue describing desired change, expected behavior, and current obstacle.

## License / Attribution
If distributing your derived project publicly, retain attribution to LiveStore and clearly note any modified components.

Enjoy building fast, resilient local‑first apps with LiveStore!

## Package manager
This template uses Bun as the package manager.
- Install dependencies: `bun install`
- Start dev (Vite + Wrangler): `bun run dev`
- Build: `bun run build`
- Deploy Worker: `bun run wrangler:deploy`
