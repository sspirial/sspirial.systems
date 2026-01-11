/**
 * Shell: Project Data Hook
 * Wraps the Pure Project type from Core with Firebase side effects
 */

import { useState, useEffect } from 'react';
import { collection, getDocs, getDocsFromCache, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Project } from '@core/types';

export function useProjects() {
  const { isOwner, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let snapshot;
        const projectsRef = collection(db, 'projects');

        // Owner logged in: cache-first strategy
        if (isOwner && user) {
          try {
            snapshot = await getDocsFromCache(projectsRef);
            if (!snapshot.empty) {
              const projectData: Project[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              } as Project));
              setProjects(projectData);
              setLoading(false);
              return;
            }
          } catch (cacheErr) {
            console.debug('Cache miss for projects, fetching from server...');
          }
          snapshot = await getDocsFromServer(projectsRef);
        } else {
          snapshot = await getDocsFromServer(projectsRef);
        }
        
        const projectData: Project[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        
        setProjects(projectData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isOwner, user]);

  return { projects, loading, error };
}
