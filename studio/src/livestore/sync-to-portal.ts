/**
 * Live sync from studio to portal
 * 
 * This module listens to LiveStore events and automatically syncs
 * data to a format consumable by the portal. In production, this
 * writes to Cloudflare KV/Durable Objects. In dev, writes to a local endpoint.
 */

import type { Store } from '@livestore/livestore'

interface PortalCollaborator {
  id: string
  icon: string
  title: string
  description: string
  [key: string]: any // Profile objects like "builders": {}
}

interface PortalNotebookEntry {
  id: string
  date: string
  title: string
  type: string
  content: string
}

interface PortalProject {
  id: string
  name: string
  status: 'active' | 'archived'
  origin: string
  description: string
  learned: string
  link: string | null
  linkText: string | null
}

interface PortalData {
  collaborators: PortalCollaborator[]
  notebook: PortalNotebookEntry[]
  projects: PortalProject[]
}

/**
 * Transform LiveStore data to portal format
 */
function transformToPortalFormat(storeData: {
  collaborators: any[]
  notebookEntries: any[]
  projects: any[]
}): PortalData {
  return {
    collaborators: storeData.collaborators.map(c => ({
      id: c.id,
      icon: c.icon,
      title: c.title,
      description: c.description,
      [c.id]: {}, // Empty profile - portal manages this
    })),
    notebook: storeData.notebookEntries.map(n => ({
      id: n.id,
      date: n.date,
      title: n.title,
      type: n.type,
      content: n.content,
    })),
    projects: storeData.projects.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      origin: p.origin,
      description: p.description,
      learned: p.learned,
      link: p.link,
      linkText: p.linkText,
    })),
  }
}

/**
 * Sync data to portal endpoint
 */
async function syncToPortal(data: PortalData): Promise<void> {
  const syncUrl = import.meta.env.VITE_PORTAL_SYNC_URL || 'http://localhost:8787/api/portal-sync'
  
  try {
    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`)
    }
    
    console.log('✅ Synced to portal:', await response.json())
  } catch (error) {
    console.error('❌ Portal sync error:', error)
    // Don't throw - sync failures shouldn't break the app
  }
}

/**
 * Setup event listener for live sync
 * Pass in the actual data from useQuery hooks
 */
export function syncPortalData(data: {
  collaborators: any[]
  notebookEntries: any[]
  projects: any[]
}): void {
  const portalData = transformToPortalFormat(data)
  syncToPortal(portalData).catch(console.error)
}
