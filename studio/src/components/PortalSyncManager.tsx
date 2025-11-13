import { useStore } from '@livestore/react'
import { useEffect, useRef } from 'react'

import { 
  allProjects$, 
  allNotebookEntries$, 
  allCollaborators$
} from '../livestore/queries.js'
import { syncPortalData } from '../livestore/sync-to-portal.js'

/**
 * PortalSyncManager - Watches for data changes and syncs to portal
 * This component doesn't render anything, it just manages sync in the background
 */
export const PortalSyncManager: React.FC = () => {
  const { store } = useStore()
  const projects = store.useQuery(allProjects$)
  const notebookEntries = store.useQuery(allNotebookEntries$)
  const collaborators = store.useQuery(allCollaborators$)
  
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSyncDataRef = useRef<string>('')

  useEffect(() => {
    // Debounce sync - wait 2 seconds after last change
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }

    // Create a hash of current data to detect actual changes
    const currentDataHash = JSON.stringify({
      projects: projects.map(p => ({ id: p.id, updatedAt: p.updatedAt })),
      notebook: notebookEntries.map(n => ({ id: n.id, updatedAt: n.updatedAt })),
      collaborators: collaborators.map(c => ({ id: c.id, updatedAt: c.updatedAt })),
    })

    // Only sync if data actually changed
    if (currentDataHash !== lastSyncDataRef.current) {
      syncTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Syncing to portal...')
        syncPortalData({
          collaborators: [...collaborators],
          notebookEntries: [...notebookEntries],
          projects: [...projects],
        })
        lastSyncDataRef.current = currentDataHash
      }, 2000)
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [projects, notebookEntries, collaborators])

  return null // This component doesn't render anything
}
