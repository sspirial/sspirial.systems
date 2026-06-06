import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/ServicesContext';
import type { ResearchPost } from '@core/types';

export function useResearchPosts() {
  const database = useDatabase();
  const [posts, setPosts] = useState<ResearchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = database.onCollectionChange<ResearchPost>('research', (data) => {
      setPosts(data);
      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [database]);

  return { posts, loading, error };
}
