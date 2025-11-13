# Bugfix prompt (triage → fix → test → PR)

You are GitHub Copilot (@copilot). Follow triage and minimal-change rules for LiveStore local‑first projects in this repo.

Bug summary:
- {one-line summary}

Reproduction steps (this repo)
- Install and run:
	- `bun install`
	- `bun run dev` (Vite on 60001, Wrangler on 8787)
- Open two tabs:
	- Tab A: http://localhost:60001/?storeId=A
	- Tab B: http://localhost:60001/?storeId=B
- Perform the failing interaction. Capture:
	- Browser console (client + worker logs)
	- Wrangler console output (from CF worker `onPush`/`onPull`)

Likely files to inspect
- Client UI/Provider: `studio/src/Root.tsx`
- LiveStore worker: `studio/src/livestore.worker.ts`
- Schema/events/materializers: `studio/src/livestore/schema.ts`
- Queries: `studio/src/livestore/queries.ts`
- Sync server: `studio/src/cf-worker/index.ts`
- Tooling: `studio/vite.config.ts`, `studio/wrangler.toml`

Triage tasks (what to produce)
1. A failing test (unit or replication e2e) or a minimal reproduction script; if no harness exists, include precise manual steps and expected/actual state.
2. Minimal patch to fix the bug with comments explaining the root cause.
3. Regression coverage: unit tests for materializers and/or a deterministic multi‑tab scenario description.
4. PR description including risk and rollback plan.

Constraints
- Don’t change storage format or event names without a migration plan.
- Preserve causal metadata; avoid fixes that drop ops or reorder nondeterministically.
- If the bug involves conflicting ops, include a deterministic scenario and the expected merged state.

Output format
- Patch (files changed) with inline comments.
- How to verify: commands/steps and expected logs/assertions.
- PR description (title, 3–6 sentence body, checklist).