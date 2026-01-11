/**
 * Shell: Manifesto Data Hook
 * Wraps the Pure Manifesto type from Core with service abstraction
 */

import { useState, useEffect } from 'react';
import { createEmptyManifesto } from '@core/models';
import { useDatabase } from '@shell/contexts/ServicesContext';
import type { Manifesto, Heuristic, Self } from '@core/types';

const normalizeManifesto = (
  data?: Partial<Manifesto<Heuristic, Self>>
): Manifesto<Heuristic, Self> => {
  const base = createEmptyManifesto();

  return {
    context: {
      statusQuo: data?.context?.statusQuo ?? base.context.statusQuo,
      grievance: data?.context?.grievance ?? base.context.grievance,
      thesis: data?.context?.thesis ?? base.context.thesis
    },
    values:
      Array.isArray(data?.values) && data.values.length
        ? data.values.map((entry) => ({
            axiom: entry?.axiom ?? '',
            rejection: {
              reject: entry?.rejection?.reject ?? '',
              embrace: entry?.rejection?.embrace ?? ''
            }
          }))
        : base.values,
    program: {
      items: Array.isArray(data?.program?.items)
        ? (data.program.items as Heuristic[]).filter(Boolean)
        : base.program.items,
      severity: data?.program?.severity ?? base.program.severity
    },
    execution: {
      promise: data?.execution?.promise ?? base.execution.promise,
      summons: null
    }
  };
};

export function useManifesto() {
  const database = useDatabase();
  const [manifesto, setManifesto] = useState<Manifesto<Heuristic, Self>>(createEmptyManifesto());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchManifesto = async () => {
      try {
        setLoading(true);
        // Use database service instead of Firebase directly
        const data = await database.fetchDocument<Partial<Manifesto<Heuristic, Self>>>('config', 'manifesto');
        
        if (data) {
          setManifesto(normalizeManifesto(data));
          setError(null);
        } else {
          setManifesto(createEmptyManifesto());
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch manifesto'));
        setManifesto(createEmptyManifesto());
      } finally {
        setLoading(false);
      }
    };

    fetchManifesto();
  }, [database]);

  return { manifesto, loading, error };
}
