/**
 * Shell: Heuristics Data Hook
 * Wraps the Pure Heuristic type from Core with Firebase side effects
 */

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Heuristic } from '@core/types';

export function useHeuristics() {
  const [heuristics, setHeuristics] = useState<Heuristic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHeuristics = async () => {
      try {
        setLoading(true);
        const manifestoRef = doc(db, 'config', 'manifesto');
        const snapshot = await getDoc(manifestoRef);
        
        if (snapshot.exists()) {
          const data = snapshot.data();
          const items: Heuristic[] = data?.program?.items || [];
          setHeuristics(items);
          setError(null);
        } else {
          setHeuristics([]);
          setError(new Error('Manifesto not found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch heuristics'));
        setHeuristics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeuristics();
  }, []);

  return { heuristics, loading, error };
}
