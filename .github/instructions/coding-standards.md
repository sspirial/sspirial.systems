# Coding standards (LiveStore local‑first)

Formatting & linting
- TypeScript + ESLint per repo config; keep JSX/TSX consistent with React 19.
- Prefer named exports for schema, events, queries.

Naming & versioning
- Event names are versioned: `v1.DomainAction` (e.g., `v1.TodoCreated`).
- Tables use lowercase snake or camel consistently (e.g., `todos`).
- Client‑only state in `clientDocument` tables should be prefixed clearly (e.g., `uiState`).

Schema and materializers
- Keep materializers pure and deterministic; no side‑effects or network calls.
- Write one materializer per event mapping; keep them small and testable.
- Prefer additive schema changes; for breaking changes, introduce `v2.*` events.

Workers and adapters
- Heavy work must remain in the LiveStore Worker/SharedWorker; keep UI thread light.
- Use `makePersistedAdapter` with OPFS for durability; avoid writing on the main thread.

Validation and security
- Validate sync payloads on the server; never trust client input.
- Avoid logging PII. Use structured logs for connection events and errors only.

Docs and comments
- Document invariants above tables and events in `schema.ts`.
- Explain any non‑obvious merge logic or constraints.

PR hygiene
- Small, focused changes; include a brief note of offline/sync behavior impacts.
- Update onboarding and dependencies docs when altering scripts or versions.