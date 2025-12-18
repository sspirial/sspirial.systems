import { useState, useEffect } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, ResearchPost, TimelineItem } from '../../types';

// Generic hook for fetching collections
function useCollection<T>(collectionName: string, initialData: T[]) {
    const [data, setData] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, collectionName));
                if (!querySnapshot.empty) {
                    const fetchedData = querySnapshot.docs.map(doc => doc.data() as T);
                    setData(fetchedData);
                } else {
                    // Fallback to initial data if DB is empty
                    console.log(`No data found for ${collectionName}, using defaults.`);
                }
            } catch (err) {
                console.error(`Error fetching ${collectionName}:`, err);
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collectionName, initialData]);

    return { data, loading, error };
}

export const useProjects = (initial: Project[]) => useCollection<Project>('projects', initial);
export const useResearch = (initial: ResearchPost[]) => useCollection<ResearchPost>('research', initial);
export const useTimeline = (initial: TimelineItem[]) => useCollection<TimelineItem>('timeline', initial);
