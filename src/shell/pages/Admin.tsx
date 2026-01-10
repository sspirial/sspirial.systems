import React, { useEffect, useState } from 'react';
import { collection, doc, getDocsFromCache, getDocsFromServer, writeBatch } from 'firebase/firestore';
import { Project, ResearchPost, TimelineItem } from '@core/types';
import { db } from '@shell/firebase';
import { useAuth } from '@shell/contexts/AuthContext';

type TabKey = 'projects' | 'research' | 'timeline';
type EditableItem = (Project | ResearchPost | TimelineItem) & { __key?: string };

const inputClass = 'w-full rounded-lg border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/70';
const textAreaClass = `${inputClass} min-h-[80px]`;
const btnBase = 'px-3 py-2 rounded-lg text-sm font-medium transition-colors';
const btnMuted = `${btnBase} bg-gray-100 dark:bg-white/10 text-slate-700 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-white/20`;
const btnPrimary = `${btnBase} bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-white`;
const btnStrong = `${btnBase} bg-primary text-white hover:bg-primary/90 disabled:opacity-60`;
const btnAccent = `${btnBase} bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60`;

const tabLabels: Record<TabKey, string> = {
  projects: 'Projects',
  research: 'Research',
  timeline: 'Timeline'
};

const emptyTemplates: Record<TabKey, () => Project | ResearchPost | TimelineItem> = {
  projects: () => ({
    id: `PROJ-${Date.now()}`,
    title: '',
    image: '',
    description: '',
    tags: [],
    type: 'Tool',
    status: 'Active',
    version: '',
    color: 'bg-primary'
  }),
  research: () => ({
    id: `RES-${Date.now()}`,
    category: 'DEV LOG',
    date: 'JAN 1, 2025',
    title: '',
    excerpt: '',
    tags: [],
    readTime: '',
    imageUrl: '',
    featured: false
  }),
  timeline: () => ({
    version: 'v1.0',
    year: new Date().getFullYear().toString(),
    description: '',
    isLatest: false,
    __key: `TIM-${Date.now()}`
  })
};

const Admin: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('projects');
  const [items, setItems] = useState<EditableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const attachKeys = (list: EditableItem[]) =>
    list.map((item, index) => ({
      ...item,
      __key: item.__key || (item as any).id || (item as any).version || `k-${index}-${Date.now()}`
    }));

  const deriveKey = (item: EditableItem | undefined | null): string | null => {
    if (!item) return null;
    if (item.__key) return item.__key;
    if ('id' in item && (item as any).id) return (item as any).id as string;
    if ('version' in item && (item as any).version) return (item as any).version as string;
    return null;
  };

  const fetchContentFromCache = async (collectionName: TabKey) => {
    setLoading(true);
    setMessage(null);
    try {
      const snapshot = await getDocsFromCache(collection(db, collectionName));
      if (!snapshot.empty) {
        const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, __key: docSnap.id, ...(docSnap.data() as any) }));
        const keyed = attachKeys(data as EditableItem[]);
        setItems(keyed);
        setExpandedKey((prev) => prev ?? deriveKey(keyed[0]));
        setMessage({ type: 'success', text: 'Loaded from local cache.' });
      } else {
        // Fallback to server when cache is empty
        await fetchContentFromServer(collectionName);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage({ type: 'error', text: 'Failed to load from cache.' });
      setItems([]);
      setExpandedKey(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentFromServer = async (collectionName: TabKey) => {
    setLoading(true);
    setMessage(null);
    try {
      const snapshot = await getDocsFromServer(collection(db, collectionName));
      if (!snapshot.empty) {
        const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, __key: docSnap.id, ...(docSnap.data() as any) }));
        const keyed = attachKeys(data as EditableItem[]);
        setItems(keyed);
        setExpandedKey((prev) => prev ?? deriveKey(keyed[0]));
        setMessage({ type: 'success', text: 'Refreshed from server.' });
      } else {
        setItems([]);
        setExpandedKey(null);
      }
    } catch (error) {
      console.error('Error fetching from server:', error);
      setMessage({ type: 'error', text: 'Failed to fetch from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset view immediately to avoid rendering prior tab's shape during async fetch
    setItems([]);
    setExpandedKey(null);
    fetchContentFromCache(activeTab);
  }, [activeTab]);

  const handleAddItem = () => {
    const template = { ...emptyTemplates[activeTab](), __key: crypto.randomUUID() } as EditableItem;
    setItems((prev) => [template, ...prev]);
    setExpandedKey(deriveKey(template));
  };

  const handleChange = <T extends Project | ResearchPost | TimelineItem>(index: number, update: Partial<T>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...update } : item)));
  };

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (items[index]) {
      const key = getItemKey(items[index], index);
      setExpandedKey((prev) => (prev === key ? null : prev));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const snapshot = await getDocsFromServer(collection(db, activeTab));
      const existingIds: Set<string> = new Set(snapshot.docs.map((d) => d.id as string));
      const batch = writeBatch(db);

      items.forEach((item) => {
        const id = (item as any).id || (item as any).version || item.__key || crypto.randomUUID();
        const docRef = doc(db, activeTab, id);
        const { __key, ...data } = item as any;
        batch.set(docRef, { ...data, id });
        existingIds.delete(id);
      });

      for (const staleId of Array.from(existingIds)) {
        batch.delete(doc(db, activeTab, staleId));
      }

      await batch.commit();
      setMessage({ type: 'success', text: 'Content saved and synced.' });
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage({ type: 'error', text: 'Failed to save content.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    await fetchContentFromServer(activeTab);
  };

  const getItemKey = (item: EditableItem, index: number) => deriveKey(item) || `idx-${index}`;

  const renderProjectCard = (project: EditableItem, index: number) => {
    const key = getItemKey(project, index);
    const isOpen = expandedKey === key;
    const p = project as Project;
    const tags = Array.isArray(p.tags) ? p.tags : [];
    return (
      <div key={key} className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Project</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {p.title || p.id || 'New Project'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => setExpandedKey(isOpen ? null : key)} className={btnMuted}>
              {isOpen ? 'Collapse' : 'Expand'}
            </button>
            <button onClick={() => handleRemove(index)} className="text-sm text-red-600 hover:text-red-700">
              Remove
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="p-4 grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Title
          <input
            value={p.title}
            onChange={(e) => handleChange<Project>(index, { title: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Image URL
          <input
            value={p.image}
            onChange={(e) => handleChange<Project>(index, { image: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
          Description
          <textarea
            value={p.description}
            onChange={(e) => handleChange<Project>(index, { description: e.target.value })}
            className={textAreaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Tags (comma separated)
          <input
            value={tags.join(', ')}
            onChange={(e) => handleChange<Project>(index, { tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
            Type
            <select
              value={p.type}
              onChange={(e) => handleChange<Project>(index, { type: e.target.value as Project['type'] })}
              className={inputClass}
            >
              <option>Tool</option>
              <option>Experiment</option>
              <option>Prototype</option>
              <option>Architecture</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
            Status
            <select
              value={p.status}
              onChange={(e) => handleChange<Project>(index, { status: e.target.value as Project['status'] })}
              className={inputClass}
            >
              <option>Active</option>
              <option>Archived</option>
              <option>Deprecated</option>
              <option>Research</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Version
          <input
            value={p.version || ''}
            onChange={(e) => handleChange<Project>(index, { version: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Color (Tailwind class)
          <input
            value={p.color}
            onChange={(e) => handleChange<Project>(index, { color: e.target.value })}
            className={inputClass}
          />
        </label>
          </div>
        )}
      </div>
    );
  };

  const renderResearchCard = (post: EditableItem, index: number) => {
    const key = getItemKey(post, index);
    const isOpen = expandedKey === key;
    const r = post as ResearchPost;
    const tags = Array.isArray(r.tags) ? r.tags : [];
    return (
      <div key={key} className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Research</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {r.title || r.id || 'New Research'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => setExpandedKey(isOpen ? null : key)} className={btnMuted}>
              {isOpen ? 'Collapse' : 'Expand'}
            </button>
            <button onClick={() => handleRemove(index)} className="text-sm text-red-600 hover:text-red-700">
              Remove
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="p-4 grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Title
          <input
            value={r.title}
            onChange={(e) => handleChange<ResearchPost>(index, { title: e.target.value })}
              className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Date
          <input
            value={r.date}
            onChange={(e) => handleChange<ResearchPost>(index, { date: e.target.value })}
              className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Category
          <select
            value={r.category}
            onChange={(e) => handleChange<ResearchPost>(index, { category: e.target.value as ResearchPost['category'] })}
              className={inputClass}
          >
            <option>DEV LOG</option>
            <option>INSIGHT</option>
            <option>TUTORIAL</option>
            <option>WHITEPAPER</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Read Time
          <input
            value={r.readTime}
            onChange={(e) => handleChange<ResearchPost>(index, { readTime: e.target.value })}
              className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
          Excerpt
          <textarea
            value={r.excerpt}
            onChange={(e) => handleChange<ResearchPost>(index, { excerpt: e.target.value })}
              className={textAreaClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
          Image URL (optional)
          <input
            value={r.imageUrl || ''}
            onChange={(e) => handleChange<ResearchPost>(index, { imageUrl: e.target.value })}
              className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Tags (comma separated)
          <input
            value={tags.join(', ')}
            onChange={(e) => handleChange<ResearchPost>(index, { tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              className={inputClass}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={r.featured ?? false}
            onChange={(e) => handleChange<ResearchPost>(index, { featured: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          Featured
        </label>
          </div>
        )}
      </div>
    );
  };

  const renderTimelineCard = (item: EditableItem, index: number) => {
    const key = getItemKey(item, index);
    const isOpen = expandedKey === key;
    const t = item as TimelineItem;
    return (
      <div key={key} className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Version</p>
            <p className="font-semibold text-slate-900 dark:text-white">{t.version || 'New Version'}</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => setExpandedKey(isOpen ? null : key)} className={btnMuted}>
              {isOpen ? 'Collapse' : 'Expand'}
            </button>
            <button onClick={() => handleRemove(index)} className="text-sm text-red-600 hover:text-red-700">
              Remove
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="p-4 grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Version label
          <input
            value={t.version}
            onChange={(e) => handleChange<TimelineItem>(index, { version: e.target.value })}
              className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Year
          <input
            value={t.year}
            onChange={(e) => handleChange<TimelineItem>(index, { year: e.target.value })}
              className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
          Description
          <textarea
            value={t.description}
            onChange={(e) => handleChange<TimelineItem>(index, { description: e.target.value })}
              className={textAreaClass}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={t.isLatest ?? false}
            onChange={(e) => handleChange<TimelineItem>(index, { isLatest: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          Mark as latest
        </label>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-slate-500 dark:text-slate-400">Loading {tabLabels[activeTab]}...</div>;
    }

    if (!items.length) {
      return (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-white/10 p-6 text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-3">No entries yet.</p>
          <button onClick={handleAddItem} className={btnPrimary}>Add first entry</button>
        </div>
      );
    }

    if (activeTab === 'projects') {
      return (
        <div className="space-y-4">
          {items.map((project, index) => renderProjectCard(project, index))}
        </div>
      );
    }

    if (activeTab === 'research') {
      return (
        <div className="space-y-4">
          {items.map((post, index) => renderResearchCard(post, index))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((entry, index) => renderTimelineCard(entry, index))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400">Systems Operational</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Admin</h1>
          </div>
          <div className="flex gap-3 text-sm">
            <button onClick={logout} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-slate-700 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
              Logout
            </button>
            <a href="/" className="px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Back to Site</a>
          </div>
        </header>

        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-white/5">
            {(Object.keys(tabLabels) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary bg-surface-light dark:bg-surface-dark'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Editing</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{tabLabels[activeTab]}</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <button onClick={handleRefresh} className={btnMuted}>Refresh</button>
                <button onClick={handleAddItem} className={btnPrimary}>Add Entry</button>
                <button onClick={handleSave} disabled={saving} className={btnStrong}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  message.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
