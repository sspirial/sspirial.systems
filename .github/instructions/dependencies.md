# Dependencies and versions (template‑aligned)

Purpose
- Keep dependencies minimal, pinned, and compatible with LiveStore’s local‑first runtime and Cloudflare sync backend.

Engines
- Node: ">=23.0.0" (as per `template/package.json`). Use nvm to match this version for dev tasks.

Runtime dependencies
- @livestore/adapter-web: 0.3.1
- @livestore/livestore: 0.3.1
- @livestore/peer-deps: 0.3.1
- @livestore/react: 0.3.1
- @livestore/sync-cf: 0.3.1
- @livestore/wa-sqlite: 1.0.5-dev.2
- react: 19.0.0
- react-dom: 19.0.0
- todomvc-app-css: 2.4.3

Dev dependencies
- @livestore/devtools-vite: ^0.3.1
- @types/react: ^19.1.2
- @types/react-dom: ^19.0.4
- @vitejs/plugin-react: ^4.3.4
- typescript: ^5.8.3
- vite: ^6.3.4
- wrangler: ^4.14.4

Upgrade policy
- Pin `@livestore/*` packages to the same minor version across the repo; upgrade them together and test sync end‑to‑end.
- Check Vite and Wrangler compatibility notes when bumping major versions.
- Record dependency bumps in the changelog and update this document accordingly.

Adding new dependencies
- Prefer browser‑native APIs and LiveStore primitives before adding state or persistence libraries.
- For utility libraries, prefer small, tree‑shakable packages and document their impact.
- Security review is required for any dependency that touches persistence, crypto, or network.