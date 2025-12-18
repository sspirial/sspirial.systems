import React, { useState, useEffect } from 'react';
import { db } from '../src/firebase';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { INITIAL_PROJECTS, INITIAL_RESEARCH_POSTS, INITIAL_TIMELINE } from '../constants';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'projects' | 'research' | 'timeline'>('projects');
    const [jsonContent, setJsonContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchContent = async (collectionName: string) => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            if (!querySnapshot.empty) {
                const data = querySnapshot.docs.map(doc => doc.data());
                setJsonContent(JSON.stringify(data, null, 2));
            } else {
                setJsonContent('[]');
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            setMessage({ type: 'error', text: 'Failed to fetch content.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent(activeTab);
    }, [activeTab]);

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const data = JSON.parse(jsonContent);
            if (!Array.isArray(data)) throw new Error('Content must be an array.');

            const batch = writeBatch(db);
            const colRef = collection(db, activeTab);

            // Note: This is a naive implementation that overwrites everything.
            // In a real app, you'd want to handle updates more carefully.
            // For this demo, we'll just assume we can overwrite documents based on ID if present,
            // or we might need to clear the collection first (which is hard in Firestore without cloud functions).
            // So we will just iterate and set.

            // Better approach for this "file editor" style:
            // We treat the JSON as the source of truth.
            // We'll loop through the JSON and set each document.
            // We assume each item has an 'id' or 'version' field to use as key.

            for (const item of data) {
                const id = item.id || item.version || Math.random().toString(36).substring(7);
                const docRef = doc(db, activeTab, id);
                batch.set(docRef, item);
            }

            await batch.commit();
            setMessage({ type: 'success', text: 'Content saved successfully!' });
        } catch (error) {
            console.error('Error saving content:', error);
            setMessage({ type: 'error', text: 'Failed to save content. Check JSON format.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        if (!confirm('This will overwrite current data with defaults. Continue?')) return;

        let data: any[] = [];
        if (activeTab === 'projects') data = INITIAL_PROJECTS;
        if (activeTab === 'research') data = INITIAL_RESEARCH_POSTS;
        if (activeTab === 'timeline') data = INITIAL_TIMELINE;

        setJsonContent(JSON.stringify(data, null, 2));
        // We don't auto-save here, let user click save.
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0d11] p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Admin</h1>
                    <a href="/" className="text-primary hover:underline">Back to Site</a>
                </header>

                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-white/10">
                        {(['projects', 'research', 'timeline'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${activeTab === tab
                                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-lg font-semibold capitalize text-slate-800 dark:text-white">
                                Edit {activeTab}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSeed}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Load Defaults
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className={`mb-4 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <textarea
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                            className="w-full h-[600px] font-mono text-sm p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-[#151c2a] text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:outline-none resize-y"
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
