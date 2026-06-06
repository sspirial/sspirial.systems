import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/ServicesContext';
import type { Heuristic } from '@core/types';

export function useHeuristics() {
  const database = useDatabase();
  const [heuristics, setHeuristics] = useState<Heuristic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = database.onDocumentChange<any>('config', 'manifesto', (data) => {
      if (data) {
        setHeuristics(data.program?.items || []);
        setError(null);
      } else {
        setHeuristics([]);
        setError(new Error('Manifesto not found'));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [database]);

  return { heuristics, loading, error };
}
