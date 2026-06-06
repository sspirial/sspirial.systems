import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/ServicesContext';
import type { TimelineItem } from '@core/types';

export function useTimeline() {
  const database = useDatabase();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = database.onCollectionChange<TimelineItem>('timeline', (data) => {
      setTimeline(data);
      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [database]);

  return { timeline, loading, error };
}
