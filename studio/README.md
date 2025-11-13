# sspirial studio — content management system

A local-first, offline-capable content management system for sspirial.systems built with LiveStore.

## Features

- **📁 Projects Management** - Create, edit, and archive projects with origin stories and learnings
- **📔 Lab Notebook** - Document experiments, prototypes, and learnings with dates and types
- **💭 Philosophy** - Manage core principles with multiple paragraphs
- **🤝 Collaborators** - Define collaborator types you want to work with
- **⚙️ Site Metadata** - Configure global site settings, social links, and contact info
- **💾 Export** - One-click export to JSON files for the portal site

## Architecture

- **Local-first** - All data lives on your device in OPFS (Origin Private File System)
- **Offline-first** - Works without internet, syncs when connected
- **Event-sourced** - Full audit trail via LiveStore events
- **Conflict-free** - Deterministic materializers ensure merge safety
- **Multi-tab** - Same data across multiple tabs via SharedWorker

## Getting Started

```bash
# Install dependencies
bun install

# Start development server (Vite + Wrangler)
bun run dev
```

The studio will be available at `http://localhost:60001/`

## Data Flow

1. **Create/Edit** content in the studio → LiveStore events → SQLite state
2. **Export** data via Export section → Downloads as JSON files
3. **Move** JSON files to `../portal/data/`
4. **Refresh** portal site to see changes
5. **Commit & Push** to deploy

## Schema

All data models use versioned events (`v1.*`):

- `v1.ProjectCreated`, `v1.ProjectUpdated`, `v1.ProjectDeleted`
- `v1.NotebookEntryCreated`, `v1.NotebookEntryUpdated`, `v1.NotebookEntryDeleted`
- `v1.PhilosophyCreated`, `v1.PhilosophyUpdated`, `v1.PhilosophyDeleted`
- `v1.CollaboratorCreated`, `v1.CollaboratorUpdated`, `v1.CollaboratorDeleted`
- `v1.SiteMetadataUpdated`

See `src/livestore/schema.ts` for full schema definition.

## Multi-Device Testing

Test sync across devices/tabs:

```bash
# Tab 1 (default storeId)
http://localhost:60001/

# Tab 2 (different storeId)
http://localhost:60001/?storeId=replica-2
```

Both tabs share the same data via SharedWorker and sync server.

## Stack

- **LiveStore** - Local-first state management
- **React** - UI components
- **TypeScript** - Type safety
- **Vite** - Dev server & bundling
- **Cloudflare Workers** - Sync backend (Durable Objects)
- **OPFS** - Browser storage (Origin Private File System)

---

Built with ❤️ by sspirial.systems 🦊
