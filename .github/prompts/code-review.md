# Code review prompt (LiveStore local‑first)

You are GitHub Copilot (@copilot). Review proposed changes with LiveStore local‑first considerations.

Inputs
- Files changed: {list or diff}
- Purpose: {short description}

Review checklist
- Correctness: tests (or described manual steps) cover new behaviors & edge cases.
- Event versioning: new events follow `v{n}.Name`; no silent mutation of existing semantics.
- Materializers: deterministic, pure, no side‑effects or network calls in `schema.ts`.
- Sync semantics: causal metadata preserved; no dropping/reordering of ops without rationale.
- Worker boundaries: heavy logic stays in worker/shared worker; UI remains light (`Root.tsx`, components).
- Storage: OPFS usage unchanged unless migration provided; no data loss.
- Auth/secrets: token handling not hard‑coded for production; no secrets in repo.
- Performance: avoids blocking main thread; batching remains intact.
- Dependencies: matches `.github/instructions/dependencies.md`; no unapproved adds.
- Docs: updated relevant instruction docs or inline comments for new invariants.
- Security/privacy: no PII in logs, validate payload changes in CF worker.

Output
- Summary (3–5 bullets).
- Critical issues: file + brief fix suggestion.
- Optional improvements.
- Verdict: approve / request changes / comment-only.