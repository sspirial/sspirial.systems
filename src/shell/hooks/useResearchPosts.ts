/**
 * Shell: Research Posts Data Hook
 * Wraps the Pure ResearchPost type from Core with Firebase side effects
 */

import { useState, useEffect } from 'react';
import { collection, getDocs, getDocsFromCache, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { ResearchPost } from '@core/types';

export function useResearchPosts() {
  const { isOwner, user } = useAuth();
  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let snapshot;
        const postsRef = collection(db, 'research');

        // Owner logged in: cache-first strategy
        if (isOwner && user) {
          try {
            snapshot = await getDocsFromCache(postsRef);
            if (!snapshot.empty) {
              const postData: ResearchPost[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              } as ResearchPost));
              setPosts(postData);
              setLoading(false);
              return;
            }
          } catch (cacheErr) {
            console.debug('Cache miss for research posts, fetching from server...');
          }
          snapshot = await getDocsFromServer(postsRef);
        } else {
          snapshot = await getDocsFromServer(postsRef);
        }
        
        const postData: ResearchPost[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ResearchPost));
        
        setPosts(postData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch research posts'));
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isOwner, user]);

  return { posts, loading, error };
}
