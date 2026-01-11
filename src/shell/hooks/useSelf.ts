/**
 * Shell: Self State Hook
 * Wraps the Pure Self type from Core with local state side effects
 */

import { useState, useCallback } from 'react';
import type { Self } from '@core/types';

export function useSelf(initialEnergy: number = 100): Self & { 
  setEnergy: (energy: number) => void;
  setAutonomy: (autonomy: boolean) => void;
} {
  const [energy, setEnergy] = useState(initialEnergy);
  const [autonomy, setAutonomy] = useState(false);

  const commit = useCallback((action: string) => {
    console.log(`[Self] Committing to: ${action}`);
    
    // Side effect: Reduce energy on commitment
    setEnergy(prev => Math.max(0, prev - 10));
    
    // Side effect: Could trigger analytics, logging, or notifications
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'self_commit', {
        event_category: 'engagement',
        event_label: action
      });
    }
  }, []);

  return {
    energy,
    autonomy,
    commit,
    setEnergy,
    setAutonomy
  };
}
