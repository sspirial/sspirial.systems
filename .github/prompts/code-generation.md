# Code generation prompt (LiveStore local‑first)

You are GitHub Copilot (@copilot). This repo is a React + LiveStore app. Before generating code, read the docs in `.github/instructions/*` and follow dependency and coding standards.

Task
- {task}  <-- one sentence describing the change

Context
- Files to read: {comma-separated list of files}
- Schema/events/materializers: `studio/src/livestore/schema.ts`
- Queries/selectors: `studio/src/livestore/queries.ts`
- Provider/adapter: `studio/src/Root.tsx`, `studio/src/livestore.worker.ts`
- Sync server validation: `studio/src/cf-worker/index.ts`
- Dev tooling: `studio/vite.config.ts`, `studio/wrangler.toml`, `studio/package.json`
- Dependencies policy: `.github/instructions/dependencies.md`

Constraints & priorities (in order)
1. Smallest safe change; keep behavior deterministic.
2. Preserve storage format and existing event names unless migrating with a version bump.
3. Add/update tests (materializers unit tests; describe multi‑tab replication steps if needed).
4. No new runtime deps unless approved; justify separately.
5. Comment non‑obvious sync/conflict decisions and invariants.

Deliverables
- Files to change: list each file + one‑line rationale.
- Tests: new/updated, and how to run locally.
- PR body: 3–6 sentences (change, risk, migration if any, rollback plan).

Example request
- Task: "Add a `v1.TodoRenamed` event and UI to rename todos."
- Files:
	- `studio/src/livestore/schema.ts` (add event + materializer)
	- `studio/src/components/MainSection.tsx` (add rename input/handler dispatching new event)
	- `studio/src/livestore/queries.ts` (adjust query if extra fields needed)