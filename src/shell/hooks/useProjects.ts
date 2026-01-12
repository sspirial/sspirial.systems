/**
 * Shell: Project Data Hook
 * Wraps the Pure Project type from Core with Firebase side effects
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Project } from '@core/types';

export function useProjects() {
  const { isOwner, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Use real-time listener for local-first sync
    const projectsRef = collection(db, 'projects');
    
    const unsubscribe = onSnapshot(
      projectsRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const projectData: Project[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        
        setProjects(projectData);
        setError(null);
        setLoading(false);

        // Log sync status for owner
        if (isOwner && snapshot.metadata.hasPendingWrites) {
          console.log('📝 Projects have pending writes (offline edits)');
        } else if (isOwner && snapshot.metadata.fromCache) {
          console.log('💾 Projects loaded from cache (offline mode)');
        } else if (isOwner) {
          console.log('☁️ Projects synced from server');
        }
      },
      (err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
        setProjects([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOwner]);

  return { projects, loading, error };
}
