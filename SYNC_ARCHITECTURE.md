# Studio → Portal Live Sync

## Overview
This implements **one-way, event-driven sync** from the LiveStore-based `studio/` app to the static `portal/` site. Studio pushes data through its normal LiveStore sync, and portal reads the transformed data.

## How It Works

### 1. Studio Side (Event Source)
- Studio commits events to LiveStore (normal flow)
- LiveStore syncs events to Cloudflare Durable Object (WebSocket connection)
- No special sync components needed - uses existing LiveStore sync

### 2. Cloudflare Worker (Transform & Serve)
- **Durable Object `onPush`** - Receives LiveStore events from studio
  - Transforms events into portal-ready JSON format
  - Stores in KV for portal consumption
  - This happens automatically on every studio sync

- **`/api/portal-data` (GET)** - Read-only endpoint for portal
  - Serves transformed data from KV
  - Portal reads from this endpoint
  - No POST endpoint - studio never posts directly to worker

### 3. Portal Side (Data Consumer - READ ONLY)
- **data-loader** (`portal/js/data-loader.js`)
  - Fetches from `/api/portal-data` (GET only)
  - CF Worker is always available (single source of truth)
  - Portal NEVER writes data back
  - Caches responses in memory
  - No static fallback - worker is the database

## Data Flow

```
Studio UI Change
  ↓
LiveStore commit (normal flow)
  ↓
LiveStore sync to Durable Object (WebSocket)
  ↓
Durable Object onPush receives events
  ↓
Transform events → portal JSON format
  ↓
Store in CF KV
  ↓
Portal GET /api/portal-data
  ↓
Portal renders updated data
```

## Key Architecture Principles

✅ **One-way flow**: Studio → Worker → Portal (portal never writes back)
✅ **Event-driven**: Uses LiveStore's existing sync mechanism
✅ **CF Worker is always available**: Single source of truth, no static fallback
✅ **Studio can be offline**: Worker stores data, portal reads anytime
✅ **Non-blocking**: Sync happens in background
✅ **Real-time updates**: Portal gets latest data on each page load

## Data Format

### Collaborators
```json
{
  "id": "builders",
  "icon": "🔠",
  "title": "Builders",
  "description": "...",
  "builders": {
    "name": "Alex Kimani",
    "bio": "...",
    "link": "..."
  }
}
```

Profile objects (`builders`, `designers`, etc.) are managed in studio and synced to portal.

### Projects
```json
{
  "id": "...",
  "name": "...",
  "status": "active|archived",
  "origin": "...",
  "description": "...",
  "learned": "...",
  "link": "...",
  "linkText": "..."
}
```

### Notebook Entries
```json
{
  "id": "...",
  "date": "YYYY.MM.DD",
  "title": "...",
  "type": "prototype|sketch|failed|...",
  "content": "..."
}
```

## Key Features

✅ **Event-driven**: No polling, syncs on actual changes
✅ **Debounced**: Batches rapid changes (2s window)
✅ **Fallback**: Portal works offline with static data
✅ **Non-blocking**: Sync failures don't break the app
✅ **Preserves manual edits**: Profile objects in portal are preserved
✅ **Production-ready**: Uses Cloudflare KV for persistence

## Troubleshooting

### Sync not working
- Check console in studio for sync errors
- Verify CF Worker is running (port 8787 in dev)
- Check network tab for POST to `/api/portal-sync`

### Portal not updating
- Check console for API fetch attempts
- Verify CORS is enabled on worker
- Try hard refresh (Ctrl+Shift+R)
- Check if falling back to static data.json

### Data conflicts
- Studio manages structure (collaborator categories, projects, notebook)
- Portal manages profile content (inside collaborator profile objects)
- Manual edits to `portal/data/data.json` profiles are preserved

## Future Enhancements

- [ ] Add authentication for sync endpoint
- [ ] Implement incremental sync (only changed records)
- [ ] Add sync status indicator in studio UI
- [ ] Add webhook support for portal rebuild triggers
- [ ] Implement conflict resolution UI
