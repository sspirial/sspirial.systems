/**
 * Shell: Research Posts Data Hook
 * Wraps the Pure ResearchPost type from Core with Firebase side effects
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { ResearchPost } from '@core/types';

export function useResearchPosts() {
  const { isOwner } = useAuth();
  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const postsRef = collection(db, 'research');
    
    const unsubscribe = onSnapshot(
      postsRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const postData: ResearchPost[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ResearchPost));
        
        setPosts(postData);
        setError(null);
        setLoading(false);

        if (isOwner && snapshot.metadata.hasPendingWrites) {
          console.log('📝 Research posts have pending writes');
        } else if (isOwner && snapshot.metadata.fromCache) {
          console.log('💾 Research posts loaded from cache');
        } else if (isOwner) {
          console.log('☁️ Research posts synced from server');
        }
      },
      (err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch research posts'));
        setPosts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOwner]);

  return { posts, loading, error };
}
