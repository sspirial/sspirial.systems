# Dependency addition prompt (LiveStore policy)

You are GitHub Copilot (@copilot). Propose new dependencies only when necessary and aligned with `.github/instructions/dependencies.md`.

Inputs
- Dependency and version: {pkg@version}
- Why needed: {short justification}
- Alternatives considered: {list}
- Bundle/offline impact: {estimated size, tree‑shakeability, OPFS/browser support}
- Security: {CVE checks, native module implications}

Produce
1. Justification and tiny usage example.
2. Impact analysis: size, offline behavior, worker compatibility.
3. Tests covering new behavior in CI (unit; e2e if relevant).
4. Suggested PR (title + 1–2 paragraphs) including risk and rollback.

Constraints
- Prefer small, tree‑shakable libs; avoid duplicating LiveStore features.
- If native: provide cross‑platform build plan and security review notes.