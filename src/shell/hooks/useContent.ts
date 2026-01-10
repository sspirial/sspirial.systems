import { useState, useEffect } from 'react';
import { collection, getDocs, getDocsFromCache, getDocsFromServer } from 'firebase/firestore';
import { db } from '@shell/firebase';
import { Project, ResearchPost, TimelineItem } from '@core/types';
import { useAuth } from '@shell/contexts/AuthContext';

function useCollection<T>(collectionName: string) {
  const { isOwner, user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let querySnapshot;

        // Owner logged in: cache-first strategy
        if (isOwner && user) {
          try {
            // Try cache first
            querySnapshot = await getDocsFromCache(collection(db, collectionName));
            if (!querySnapshot.empty) {
              const fetchedData = querySnapshot.docs.map(docSnap => docSnap.data() as T);
              setData(fetchedData);
              setLoading(false);
              return;
            }
          } catch (cacheErr) {
            // Cache miss or error, fall through to server
            console.debug(`Cache miss for ${collectionName}, fetching from server...`);
          }

          // Fall back to server if cache is empty
          querySnapshot = await getDocsFromServer(collection(db, collectionName));
        } else {
          // Not logged in or not owner: server-first strategy
          querySnapshot = await getDocsFromServer(collection(db, collectionName));
        }

        if (!querySnapshot.empty) {
          const fetchedData = querySnapshot.docs.map(docSnap => docSnap.data() as T);
          setData(fetchedData);
        } else {
          console.warn(`No data found in Firestore collection: ${collectionName}`);
          setData([]);
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError('Failed to load data.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, isOwner, user]);

  return { data, loading, error };
}

export const useProjects = () => useCollection<Project>('projects');
export const useResearch = () => useCollection<ResearchPost>('research');
export const useTimeline = () => useCollection<TimelineItem>('timeline');
