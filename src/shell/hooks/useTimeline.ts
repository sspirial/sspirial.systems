/**
 * Shell: Timeline Data Hook
 * Wraps the Pure TimelineItem type from Core with Firebase side effects
 */

import { useState, useEffect } from 'react';
import { collection, getDocs, getDocsFromCache, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { TimelineItem } from '@core/types';

export function useTimeline() {
  const { isOwner, user } = useAuth();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        let snapshot;
        const timelineRef = collection(db, 'timeline');

        // Owner logged in: cache-first strategy
        if (isOwner && user) {
          try {
            snapshot = await getDocsFromCache(timelineRef);
            if (!snapshot.empty) {
              const timelineData: TimelineItem[] = snapshot.docs.map(doc => ({
                ...doc.data()
              } as TimelineItem));
              setTimeline(timelineData);
              setLoading(false);
              return;
            }
          } catch (cacheErr) {
            console.debug('Cache miss for timeline, fetching from server...');
          }
          snapshot = await getDocsFromServer(timelineRef);
        } else {
          snapshot = await getDocsFromServer(timelineRef);
        }
        
        const timelineData: TimelineItem[] = snapshot.docs.map(doc => ({
          ...doc.data()
        } as TimelineItem));
        
        setTimeline(timelineData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch timeline'));
        setTimeline([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [isOwner, user]);

  return { timeline, loading, error };
}
