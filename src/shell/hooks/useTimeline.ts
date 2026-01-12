/**
 * Shell: Timeline Data Hook
 * Wraps the Pure TimelineItem type from Core with Firebase side effects
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { TimelineItem } from '@core/types';

export function useTimeline() {
  const { isOwner } = useAuth();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timelineRef = collection(db, 'timeline');
    
    const unsubscribe = onSnapshot(
      timelineRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const timelineData: TimelineItem[] = snapshot.docs.map(doc => ({
          ...doc.data()
        } as TimelineItem));
        
        setTimeline(timelineData);
        setError(null);
        setLoading(false);

        if (isOwner && snapshot.metadata.hasPendingWrites) {
          console.log('📝 Timeline has pending writes');
        } else if (isOwner && snapshot.metadata.fromCache) {
          console.log('💾 Timeline loaded from cache');
        } else if (isOwner) {
          console.log('☁️ Timeline synced from server');
        }
      },
      (err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch timeline'));
        setTimeline([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOwner]);

  return { timeline, loading, error };
}
