import { makeDurableObject, makeWorker } from '@livestore/sync-cf/cf-worker'

// Simple Durable Object for storing portal data cache
export class PortalDataCache {
  state: any
  env: any
  
  constructor(state: any, env: any) {
    this.state = state
    this.env = env
  }
  
  async fetch(request: Request) {
    const url = new URL(request.url)
    
    if (url.pathname === '/get') {
      const data = await this.state.storage.get('portal-data')
      return new Response(JSON.stringify(data || { collaborators: [], notebook: [], projects: [] }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (url.pathname === '/set' && request.method === 'POST') {
      const data = await request.json()
      await this.state.storage.put('portal-data', data)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response('Not found', { status: 404 })
  }
}

export class WebSocketServer extends makeDurableObject({
  async onPush(message) {
    console.log('onPush - received events:', message.batch.length)
    
    // After events are pushed, query the materialized state from Durable Object
    // and export to portal format
    try {
      // Access the store's SQL database to query current state
      const db = (this as any).replica?.db
      
      if (db) {
        // Query materialized tables
        const projects = await db.query('SELECT * FROM projects WHERE deletedAt IS NULL ORDER BY createdAt DESC')
        const notebook = await db.query('SELECT * FROM notebookEntries WHERE deletedAt IS NULL ORDER BY date DESC')
        const collaborators = await db.query('SELECT * FROM collaborators WHERE deletedAt IS NULL ORDER BY createdAt ASC')
        
        // Transform to portal format
        const portalData = {
          projects: projects.rows?.map((p: any) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            origin: p.origin,
            description: p.description,
            learned: p.learned,
            link: p.link,
            linkText: p.linkText,
          })) || [],
          notebook: notebook.rows?.map((n: any) => ({
            id: n.id,
            date: n.date,
            title: n.title,
            type: n.type,
            content: n.content,
          })) || [],
          collaborators: collaborators.rows?.map((c: any) => ({
            id: c.id,
            icon: c.icon,
            title: c.title,
            description: c.description,
            [c.id]: {}, // Empty profile object
          })) || [],
        }
        
        console.log('Portal data prepared:', {
          projects: portalData.projects.length,
          notebook: portalData.notebook.length,
          collaborators: portalData.collaborators.length,
        });
        
        // Store in the PortalDataCache Durable Object
        try {
          const env = (this as any).env
          if (env && env.PORTAL_DATA_CACHE) {
            const cacheId = env.PORTAL_DATA_CACHE.idFromName('default')
            const cacheStub = env.PORTAL_DATA_CACHE.get(cacheId)
            const response = await cacheStub.fetch('http://fake/set', {
              method: 'POST',
              body: JSON.stringify(portalData),
              headers: { 'Content-Type': 'application/json' }
            })
            console.log('✅ Portal data stored in PortalDataCache DO');
          } else {
            console.log('⚠️ PORTAL_DATA_CACHE binding not available');
          }
        } catch (storageError) {
          console.error('Failed to store in PortalDataCache:', storageError);
        }
      }
    } catch (error) {
      console.error('Failed to export portal data:', error)
    }
  },
  async onPull(message) {
    console.log('onPull', message)
  },
}) {
  private _cachedPortalData: any = null
  
  // Add alarm method to expose portal data
  async alarm() {
    // Not used for alarm, but can be called to trigger data export
  }
  
  // Add a simple method that can be called via RPC
  async getPortalData() {
    console.log('getPortalData called - querying SQLite cache')
    
    try {
      // Access the same database that onPush uses
      const db = (this as any).replica?.db
      
      if (!db) {
        console.log('Database not available yet')
        return { collaborators: [], notebook: [], projects: [] }
      }
      
      // Query the portal_cache table
      const result = await db.query('SELECT data FROM portal_cache WHERE id = ? LIMIT 1', ['default']);
      
      if (result.rows && result.rows.length > 0) {
        const cached = JSON.parse(result.rows[0].data);
        console.log('Portal data retrieved from SQLite cache');
        return cached;
      }
      
      console.log('No cached portal data found');
      return { collaborators: [], notebook: [], projects: [] }
    } catch (error) {
      console.error('Error querying portal cache:', error)
      return { collaborators: [], notebook: [], projects: [] }
    }
  }
}

// Create base worker
const baseWorker = makeWorker({
  validatePayload: (payload: any) => {
    if (payload?.authToken !== 'insecure-token-change-me') {
      throw new Error('Invalid auth token')
    }
  },
  enableCORS: true,
})

// Extend worker to add portal read-only endpoint
export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url)
    
    // Portal data fetch endpoint - READ ONLY for portal
    if (url.pathname === '/api/portal-data' && request.method === 'GET') {
      try {
        // Get the PortalDataCache Durable Object
        const cacheId = env.PORTAL_DATA_CACHE.idFromName('default')
        const cacheStub = env.PORTAL_DATA_CACHE.get(cacheId)
        
        // Fetch from the cache DO
        const response = await cacheStub.fetch('http://fake/get')
        const portalData = await response.json()
        
        return new Response(JSON.stringify(portalData, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=5',
          },
        })
      } catch (error) {
        console.error('Error fetching portal data:', error)
        return new Response(JSON.stringify({ 
          error: String(error),
          collaborators: [], 
          notebook: [], 
          projects: [] 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    }
    
    // All other requests go to LiveStore sync worker
    return baseWorker.fetch(request, env, ctx)
  }
}
