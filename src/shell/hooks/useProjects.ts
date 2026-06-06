import { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/ServicesContext';
import type { Project } from '@core/types';

export function useProjects() {
  const database = useDatabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = database.onCollectionChange<Project>('projects', (data) => {
      setProjects(data);
      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [database]);

  return { projects, loading, error };
}
