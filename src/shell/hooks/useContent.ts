import { useState, useEffect } from 'react';
import { Project, ResearchPost, TimelineItem } from '@core/types';
import { useAuth } from '@shell/contexts/AuthContext';
import { useDatabase } from '@shell/contexts/ServicesContext';
import {
  validateProjectArray,
  validateResearchPostArray,
  validateTimelineItemArray,
} from '@shell/utils/validators';

function useCollection<T>(
  collectionName: string,
  validator: (items: unknown[]) => T[]
) {
  const { isOwner, user } = useAuth();
  const database = useDatabase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use database service instead of Firebase directly
        const rawData = await database.fetchCollection(collectionName);
        const validatedData = validator(rawData);
        setData(validatedData);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError('Failed to load data.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, database]);

  return { data, loading, error };
}

export const useProjects = () =>
  useCollection<Project>('projects', validateProjectArray);
export const useResearch = () =>
  useCollection<ResearchPost>('research', validateResearchPostArray);
export const useTimeline = () =>
  useCollection<TimelineItem>('timeline', validateTimelineItemArray);
