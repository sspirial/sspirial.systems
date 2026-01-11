import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Project, ResearchPost, TimelineItem, Heuristic, Manifesto, Self, SiteConfig } from '@core/types';
import { db, storage } from '@shell/firebase';
import { useAuth } from '@shell/contexts/AuthContext';
import { useProjects } from '@shell/hooks/useProjects';
import { useResearchPosts } from '@shell/hooks/useResearchPosts';
import { useTimeline } from '@shell/hooks/useTimeline';
import { useHeuristics } from '@shell/hooks/useHeuristics';
import { useManifesto } from '@shell/hooks/useManifesto';
import { createEmptyManifesto } from '@core/models';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';

type TabKey = 'projects' | 'research' | 'timeline' | 'heuristics' | 'manifesto' | 'siteConfig';
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
  timeline: 'Timeline',
  heuristics: 'Heuristics',
  manifesto: 'Manifesto',
  siteConfig: 'Site Config'
};

const emptyTemplates: Partial<Record<TabKey, () => Project | ResearchPost | TimelineItem>> = {
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

const heuristicOptions: Heuristic[] = ['Build for $0', 'Local-First', 'No Meetings', 'Ship Daily'];

const materialIconOptions = [
  { value: 'lightbulb', label: 'Light Bulb - Ideas, Innovation, Creativity' },
  { value: 'code', label: 'Code - Programming, Development' },
  { value: 'hub', label: 'Hub - Networks, Connections, Systems' },
  { value: 'rocket_launch', label: 'Rocket Launch - Growth, Launch, Speed' },
  { value: 'psychology', label: 'Psychology - Thinking, Intelligence, Mind' },
  { value: 'explore', label: 'Explore - Discovery, Research, Navigation' },
  { value: 'science', label: 'Science - Experiments, Lab, Testing' },
  { value: 'settings', label: 'Settings - Configuration, Tools' },
  { value: 'architecture', label: 'Architecture - Structure, Design, Blueprint' },
  { value: 'engineering', label: 'Engineering - Building, Technical' },
  { value: 'construction', label: 'Construction - Building, Creating' },
  { value: 'design_services', label: 'Design Services - Design, Creative' },
  { value: 'extension', label: 'Extension - Plugins, Modules, Add-ons' },
  { value: 'terminal', label: 'Terminal - Command Line, Development' },
  { value: 'developer_mode', label: 'Developer Mode - Coding, Dev Tools' },
  { value: 'data_object', label: 'Data Object - Data, Structure' },
  { value: 'integration_instructions', label: 'Integration - APIs, Connecting' },
  { value: 'schema', label: 'Schema - Database, Structure' },
  { value: 'account_tree', label: 'Account Tree - Hierarchy, Organization' },
  { value: 'memory', label: 'Memory - Storage, Processing' },
  { value: 'cloud', label: 'Cloud - Cloud Services, Infrastructure' },
  { value: 'storage', label: 'Storage - Data Storage, Persistence' },
  { value: 'speed', label: 'Speed - Performance, Fast' },
  { value: 'security', label: 'Security - Protection, Safety' },
  { value: 'lock_open', label: 'Lock Open - Open Source, Access' },
  { value: 'share', label: 'Share - Sharing, Community' },
  { value: 'group', label: 'Group - Team, Collaboration' },
  { value: 'people', label: 'People - Community, Users' },
  { value: 'diversity_3', label: 'Diversity - Inclusion, Variety' },
  { value: 'handshake', label: 'Handshake - Partnership, Agreement' },
  { value: 'verified', label: 'Verified - Quality, Trusted' },
  { value: 'stars', label: 'Stars - Excellence, Premium' },
  { value: 'grade', label: 'Grade - Quality, Rating' },
  { value: 'eco', label: 'Eco - Sustainability, Green' },
  { value: 'recycling', label: 'Recycling - Reuse, Circular' },
  { value: 'analytics', label: 'Analytics - Data, Insights' },
  { value: 'insights', label: 'Insights - Analysis, Understanding' },
  { value: 'query_stats', label: 'Query Stats - Metrics, Performance' },
  { value: 'dashboard', label: 'Dashboard - Overview, Monitoring' },
  { value: 'monitoring', label: 'Monitoring - Tracking, Observability' },
  { value: 'visibility', label: 'Visibility - Transparency, Clarity' },
  { value: 'radio_button_checked', label: 'Radio Checked - Focus, Selection' },
  { value: 'target', label: 'Target - Goals, Objectives' },
  { value: 'flag', label: 'Flag - Milestone, Achievement' },
  { value: 'trending_up', label: 'Trending Up - Growth, Progress' },
  { value: 'timeline', label: 'Timeline - Progress, History' },
  { value: 'auto_awesome', label: 'Auto Awesome - Magic, Automation' },
  { value: 'blur_on', label: 'Blur On - Effects, Processing' },
  { value: 'filter_vintage', label: 'Filter Vintage - Style, Aesthetics' }
];

const Admin: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('projects');
  
  // Use the woven hooks from Shell
  const projectsHook = useProjects();
  const researchHook = useResearchPosts();
  const timelineHook = useTimeline();
  const heuristicsHook = useHeuristics();
  const manifestoHook = useManifesto();
  const siteConfigHook = useSiteConfig();
  
  const [items, setItems] = useState<EditableItem[]>([]);
  const [heuristics, setHeuristics] = useState<Heuristic[]>([]);
  const [manifesto, setManifesto] = useState<Manifesto<Heuristic, Self>>(createEmptyManifesto());
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(siteConfigHook.config);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Sync hook data to local state when tab changes
  useEffect(() => {
    setMessage(null);
    setExpandedKey(null);
    
    if (activeTab === 'projects') {
      const keyed = attachKeys(projectsHook.projects as EditableItem[]);
      setItems(keyed);
      setExpandedKey(deriveKey(keyed[0]));
    } else if (activeTab === 'research') {
      const keyed = attachKeys(researchHook.posts as EditableItem[]);
      setItems(keyed);
      setExpandedKey(deriveKey(keyed[0]));
    } else if (activeTab === 'timeline') {
      const keyed = attachKeys(timelineHook.timeline as EditableItem[]);
      setItems(keyed);
      setExpandedKey(deriveKey(keyed[0]));
    } else if (activeTab === 'heuristics') {
      setItems([]);
      setHeuristics(heuristicsHook.heuristics);
    } else if (activeTab === 'manifesto') {
      setItems([]);
      setManifesto(manifestoHook.manifesto ?? createEmptyManifesto());
    } else if (activeTab === 'siteConfig') {
      setItems([]);
      setSiteConfig(siteConfigHook.config);
    }
  }, [activeTab, projectsHook.projects, researchHook.posts, timelineHook.timeline, heuristicsHook.heuristics, manifestoHook.manifesto, siteConfigHook.config]);
  
  const loading = projectsHook.loading || researchHook.loading || timelineHook.loading || heuristicsHook.loading || manifestoHook.loading || siteConfigHook.loading;

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

  const handleAddItem = () => {
    if (activeTab in emptyTemplates) {
      const template = { ...emptyTemplates[activeTab]!(), __key: crypto.randomUUID() } as EditableItem;
      setItems((prev) => [template, ...prev]);
      setExpandedKey(deriveKey(template));
    }
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

  const handleAddHeuristic = () => {
    setHeuristics(prev => [...prev, "Build for $0"]);
  };

  const handleUpdateHeuristic = (index: number, value: Heuristic) => {
    setHeuristics(prev => prev.map((h, i) => i === index ? value : h));
  };

  const handleRemoveHeuristic = (index: number) => {
    setHeuristics(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateManifesto = (field: string, value: any) => {
    setManifesto((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddValue = () => {
    setManifesto((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        {
          axiom: '',
          rejection: {
            reject: '',
            embrace: ''
          }
        }
      ]
    }));
  };

  const handleUpdateValue = (
    index: number,
    update: Partial<{ axiom: string; rejection: { reject: string; embrace: string } }>
  ) => {
    setManifesto((prev) => ({
      ...prev,
      values: prev.values.map((value, i) =>
        i === index
          ? {
              axiom: update.axiom ?? value.axiom,
              rejection: {
                reject: update.rejection?.reject ?? value.rejection.reject,
                embrace: update.rejection?.embrace ?? value.rejection.embrace
              }
            }
          : value
      )
    }));
  };

  const handleRemoveValue = (index: number) => {
    setManifesto((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const handleAddProgramItem = () => {
    setManifesto((prev) => ({
      ...prev,
      program: {
        ...prev.program,
        items: [...prev.program.items, 'Build for $0']
      }
    }));
  };

  const handleUpdateProgramItem = (index: number, value: Heuristic) => {
    setManifesto((prev) => ({
      ...prev,
      program: {
        ...prev.program,
        items: prev.program.items.map((item, i) => (i === index ? value : item))
      }
    }));
  };

  const handleRemoveProgramItem = (index: number) => {
    setManifesto((prev) => ({
      ...prev,
      program: {
        ...prev.program,
        items: prev.program.items.filter((_, i) => i !== index)
      }
    }));
  };

  const sanitizeManifesto = (data: Manifesto<Heuristic, Self>) => ({
    context: {
      statusQuo: data.context.statusQuo || '',
      grievance: data.context.grievance || '',
      thesis: data.context.thesis || ''
    },
    values: (data.values || []).map((value) => ({
      axiom: value.axiom || '',
      rejection: {
        reject: value.rejection?.reject || '',
        embrace: value.rejection?.embrace || ''
      }
    })),
    program: {
      items: Array.isArray(data.program?.items) ? data.program.items.filter(Boolean) : [],
      severity: data.program?.severity || ''
    },
    execution: {
      promise: data.execution?.promise || ''
    }
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (activeTab === 'siteConfig') {
        // Save site config
        const siteConfigRef = doc(db, 'config', 'site');
        await setDoc(siteConfigRef, siteConfig, { merge: true });
        setMessage({ type: 'success', text: 'Site configuration saved.' });
      } else if (activeTab === 'heuristics') {
        // Save heuristics to manifesto config document
        const manifestoRef = doc(db, 'config', 'manifesto');
        const manifestoSnap = await getDoc(manifestoRef);
        const currentData = manifestoSnap.exists() ? manifestoSnap.data() : {};
        await setDoc(manifestoRef, {
          ...currentData,
          program: {
            ...(currentData.program || {}),
            items: heuristics
          }
        }, { merge: true });
        setMessage({ type: 'success', text: 'Heuristics saved.' });
      } else if (activeTab === 'manifesto') {
        // Save full manifesto
        const manifestoRef = doc(db, 'config', 'manifesto');
        const payload = sanitizeManifesto(manifesto);
        await setDoc(manifestoRef, payload, { merge: true });
        setMessage({ type: 'success', text: 'Manifesto saved.' });
      } else {
        // Save collection-based data (projects, research, timeline)
        const batch = writeBatch(db);
        const collectionName = activeTab;

        items.forEach((item) => {
          const id = (item as any).id || (item as any).version || item.__key || crypto.randomUUID();
          const docRef = doc(db, collectionName, id);
          const { __key, ...data } = item as any;
          batch.set(docRef, { ...data, id });
        });

        await batch.commit();
        setMessage({ type: 'success', text: 'Content saved and synced.' });
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage({ type: 'error', text: 'Failed to save content.' });
    } finally {
      setSaving(false);
    }
  };

  const getItemKey = (item: EditableItem, index: number) => deriveKey(item) || `idx-${index}`;

  const handleImageUpload = async (file: File, imageType: 'hero' | 'about') => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file.' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB.' });
      return;
    }

    setUploadingImage(imageType);
    setMessage(null);

    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${imageType}-${timestamp}-${file.name}`;
      const storageRef = ref(storage, `site-images/${fileName}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update the site config with the new URL
      if (imageType === 'hero') {
        setSiteConfig({
          ...siteConfig,
          hero: { ...siteConfig.hero, imageUrl: downloadURL }
        });
      } else if (imageType === 'about') {
        setSiteConfig({
          ...siteConfig,
          about: { ...siteConfig.about, imageUrl: downloadURL }
        });
      }

      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setUploadingImage(null);
    }
  };

  const renderSiteConfigEditor = () => {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Version & Status */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Version & Status</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Version
              <input
                value={siteConfig.version}
                onChange={(e) => setSiteConfig({ ...siteConfig, version: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Status Label
              <input
                value={siteConfig.statusLabel}
                onChange={(e) => setSiteConfig({ ...siteConfig, statusLabel: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        {/* Hero Section */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Hero Section</h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Tagline
              <input
                value={siteConfig.hero.tagline}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  hero: { ...siteConfig.hero, tagline: e.target.value }
                })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Highlight Word (in tagline)
              <input
                value={siteConfig.hero.highlight}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  hero: { ...siteConfig.hero, highlight: e.target.value }
                })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Description
              <textarea
                value={siteConfig.hero.description}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  hero: { ...siteConfig.hero, description: e.target.value }
                })}
                className={textAreaClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Hero Image URL
              <input
                value={siteConfig.hero.imageUrl}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  hero: { ...siteConfig.hero, imageUrl: e.target.value }
                })}
                className={inputClass}
                placeholder="https://..."
              />
            </label>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Or Upload New Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'hero');
                  }}
                  className="text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary hover:file:text-white file:cursor-pointer"
                  disabled={uploadingImage === 'hero'}
                />
                {uploadingImage === 'hero' && (
                  <span className="text-sm text-slate-500">Uploading...</span>
                )}
              </div>
              {siteConfig.hero.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={siteConfig.hero.imageUrl} 
                    alt="Hero preview" 
                    className="w-full max-w-md h-auto rounded-lg border border-gray-200 dark:border-white/10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Focus */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Current Focus</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Focus Label
              <input
                value={siteConfig.currentFocus.label}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  currentFocus: { ...siteConfig.currentFocus, label: e.target.value }
                })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Availability
              <input
                value={siteConfig.currentFocus.availability}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  currentFocus: { ...siteConfig.currentFocus, availability: e.target.value }
                })}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        {/* Systems Marquee */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Systems Thinking Marquee</h3>
          <div className="space-y-3">
            {siteConfig.systemsMarquee.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  value={item}
                  onChange={(e) => {
                    const updated = [...siteConfig.systemsMarquee];
                    updated[idx] = e.target.value;
                    setSiteConfig({ ...siteConfig, systemsMarquee: updated });
                  }}
                  className={inputClass}
                />
                <button
                  onClick={() => setSiteConfig({
                    ...siteConfig,
                    systemsMarquee: siteConfig.systemsMarquee.filter((_, i) => i !== idx)
                  })}
                  className="text-red-600 hover:text-red-700 text-sm px-3"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => setSiteConfig({
                ...siteConfig,
                systemsMarquee: [...siteConfig.systemsMarquee, '///']
              })}
              className={btnPrimary}
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Focus Areas (Home Page)</h3>
          <div className="space-y-4">
            {siteConfig.focusAreas.map((area, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">Area {idx + 1}</p>
                  <button
                    onClick={() => setSiteConfig({
                      ...siteConfig,
                      focusAreas: siteConfig.focusAreas.filter((_, i) => i !== idx)
                    })}
                    className="text-red-600 hover:text-red-700 text-sm px-3"
                  >
                    Remove
                  </button>
                </div>
                <input
                  placeholder="Title"
                  value={area.title}
                  onChange={(e) => {
                    const updated = [...siteConfig.focusAreas];
                    updated[idx].title = e.target.value;
                    setSiteConfig({ ...siteConfig, focusAreas: updated });
                  }}
                  className={inputClass}
                />
                <textarea
                  placeholder="Description"
                  value={area.description}
                  onChange={(e) => {
                    const updated = [...siteConfig.focusAreas];
                    updated[idx].description = e.target.value;
                    setSiteConfig({ ...siteConfig, focusAreas: updated });
                  }}
                  className={textAreaClass}
                />
              </div>
            ))}
            <button
              onClick={() => setSiteConfig({
                ...siteConfig,
                focusAreas: [...siteConfig.focusAreas, { title: '', description: '' }]
              })}
              className={btnPrimary}
            >
              Add Focus Area
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">About Section</h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Main Heading
              <textarea
                value={siteConfig.about.heading}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  about: { ...siteConfig.about, heading: e.target.value }
                })}
                className={textAreaClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Subtitle
              <textarea
                value={siteConfig.about.subtitle}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  about: { ...siteConfig.about, subtitle: e.target.value }
                })}
                className={textAreaClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Hero Image URL
              <input
                value={siteConfig.about.imageUrl}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  about: { ...siteConfig.about, imageUrl: e.target.value }
                })}
                className={inputClass}
                placeholder="https://..."
              />
            </label>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                Or Upload New Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'about');
                  }}
                  className="text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary hover:file:text-white file:cursor-pointer"
                  disabled={uploadingImage === 'about'}
                />
                {uploadingImage === 'about' && (
                  <span className="text-sm text-slate-500">Uploading...</span>
                )}
              </div>
              {siteConfig.about.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={siteConfig.about.imageUrl} 
                    alt="About page preview" 
                    className="w-full max-w-md h-auto rounded-lg border border-gray-200 dark:border-white/10"
                  />
                </div>
              )}
            </div>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Core Philosophy Heading
              <input
                value={siteConfig.about.corePhilosophy}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  about: { ...siteConfig.about, corePhilosophy: e.target.value }
                })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Core Philosophy Subtitle
              <textarea
                value={siteConfig.about.corePhilosophySubtitle}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  about: { ...siteConfig.about, corePhilosophySubtitle: e.target.value }
                })}
                className={textAreaClass}
              />
            </label>

            {/* Philosophy Cards */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Philosophy Cards</p>
              </div>
              {siteConfig.about.philosophyCards.map((card, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4 space-y-3 mb-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">Card {idx + 1}</p>
                    <button
                      onClick={() => setSiteConfig({
                        ...siteConfig,
                        about: {
                          ...siteConfig.about,
                          philosophyCards: siteConfig.about.philosophyCards.filter((_, i) => i !== idx)
                        }
                      })}
                      className="text-red-600 hover:text-red-700 text-sm px-3"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                    Icon
                    <div className="flex gap-2 items-center">
                      <select
                        value={card.icon}
                        onChange={(e) => {
                          const updated = [...siteConfig.about.philosophyCards];
                          updated[idx].icon = e.target.value;
                          setSiteConfig({ ...siteConfig, about: { ...siteConfig.about, philosophyCards: updated } });
                        }}
                        className={inputClass}
                      >
                        {materialIconOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex-shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{card.icon}</span>
                      </div>
                    </div>
                  </label>
                  <input
                    placeholder="Title"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...siteConfig.about.philosophyCards];
                      updated[idx].title = e.target.value;
                      setSiteConfig({ ...siteConfig, about: { ...siteConfig.about, philosophyCards: updated } });
                    }}
                    className={inputClass}
                  />
                  <textarea
                    placeholder="Description"
                    value={card.description}
                    onChange={(e) => {
                      const updated = [...siteConfig.about.philosophyCards];
                      updated[idx].description = e.target.value;
                      setSiteConfig({ ...siteConfig, about: { ...siteConfig.about, philosophyCards: updated } });
                    }}
                    className={textAreaClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Projects Page</h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Heading
              <input
                value={siteConfig.projects.heading}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  projects: { ...siteConfig.projects, heading: e.target.value }
                })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Subtitle
              <textarea
                value={siteConfig.projects.subtitle}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  projects: { ...siteConfig.projects, subtitle: e.target.value }
                })}
                className={textAreaClass}
              />
            </label>
          </div>
        </div>

        {/* Research Section */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Research Page</h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Heading
              <input
                value={siteConfig.research.heading}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  research: { ...siteConfig.research, heading: e.target.value }
                })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Subtitle
              <textarea
                value={siteConfig.research.subtitle}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  research: { ...siteConfig.research, subtitle: e.target.value }
                })}
                className={textAreaClass}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Footer</h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Bio
              <textarea
                value={siteConfig.footer.bio}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  footer: { ...siteConfig.footer, bio: e.target.value }
                })}
                className={textAreaClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Copyright
              <input
                value={siteConfig.footer.copyright}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  footer: { ...siteConfig.footer, copyright: e.target.value }
                })}
                className={inputClass}
              />
            </label>

            {/* Sitemap */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Sitemap Links</p>
              {siteConfig.footer.sections.sitemap.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...siteConfig.footer.sections.sitemap];
                      updated[idx].label = e.target.value;
                      setSiteConfig({
                        ...siteConfig,
                        footer: { ...siteConfig.footer, sections: { ...siteConfig.footer.sections, sitemap: updated } }
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                  <input
                    placeholder="Route"
                    value={link.route}
                    onChange={(e) => {
                      const updated = [...siteConfig.footer.sections.sitemap];
                      updated[idx].route = e.target.value;
                      setSiteConfig({
                        ...siteConfig,
                        footer: { ...siteConfig.footer, sections: { ...siteConfig.footer.sections, sitemap: updated } }
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Social Links</p>
              {siteConfig.footer.sections.social.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...siteConfig.footer.sections.social];
                      updated[idx].label = e.target.value;
                      setSiteConfig({
                        ...siteConfig,
                        footer: { ...siteConfig.footer, sections: { ...siteConfig.footer.sections, social: updated } }
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                  <input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...siteConfig.footer.sections.social];
                      updated[idx].url = e.target.value;
                      setSiteConfig({
                        ...siteConfig,
                        footer: { ...siteConfig.footer, sections: { ...siteConfig.footer.sections, social: updated } }
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>

            {/* Legal */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Legal Links</p>
              {siteConfig.footer.sections.legal.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...siteConfig.footer.sections.legal];
                      updated[idx].label = e.target.value;
                      setSiteConfig({
                        ...siteConfig,
                        footer: { ...siteConfig.footer, sections: { ...siteConfig.footer.sections, legal: updated } }
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                  <input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...siteConfig.footer.sections.legal];
                      updated[idx].url = e.target.value;
                      setSiteConfig({
                        ...siteConfig,
                        footer: { ...siteConfig.footer, sections: { ...siteConfig.footer.sections, legal: updated } }
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeuristicsEditor = () => {
    return (
      <div className="space-y-4">
        {heuristics.map((h, index) => (
          <div key={index} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-4">
            <select
              value={h}
              onChange={(e) => handleUpdateHeuristic(index, e.target.value as Heuristic)}
              className={`flex-1 ${inputClass}`}
            >
              <option>Build for $0</option>
              <option>Local-First</option>
              <option>No Meetings</option>
              <option>Ship Daily</option>
            </select>
            <button
              onClick={() => handleRemoveHeuristic(index)}
              className="text-red-600 hover:text-red-700 text-sm px-3"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddHeuristic} className={btnPrimary}>
          Add Heuristic
        </button>
      </div>
    );
  };

  const renderManifestoEditor = () => {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Context</h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Status Quo
              <textarea
                value={manifesto.context.statusQuo}
                onChange={(e) => handleUpdateManifesto('context', { ...manifesto.context, statusQuo: e.target.value })}
                className={textAreaClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Grievance
              <textarea
                value={manifesto.context.grievance}
                onChange={(e) => handleUpdateManifesto('context', { ...manifesto.context, grievance: e.target.value })}
                className={textAreaClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Thesis
              <textarea
                value={manifesto.context.thesis}
                onChange={(e) => handleUpdateManifesto('context', { ...manifesto.context, thesis: e.target.value })}
                className={textAreaClass}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Program</h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              Severity
              <input
                value={manifesto.program.severity}
                onChange={(e) => handleUpdateManifesto('program', { ...manifesto.program, severity: e.target.value })}
                className={inputClass}
              />
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Heuristics</p>
                <button onClick={handleAddProgramItem} className={btnPrimary}>
                  Add Heuristic
                </button>
              </div>
              {manifesto.program.items.length === 0 && (
                <p className="text-xs text-slate-500">No heuristics added yet.</p>
              )}
              {manifesto.program.items.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center gap-3">
                  <select
                    value={item}
                    onChange={(e) => handleUpdateProgramItem(index, e.target.value as Heuristic)}
                    className={`flex-1 ${inputClass}`}
                  >
                    {heuristicOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <button onClick={() => handleRemoveProgramItem(index)} className="text-red-600 hover:text-red-700 text-sm px-3">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Values</h3>
            <button onClick={handleAddValue} className={btnPrimary}>Add Value</button>
          </div>
          <div className="space-y-4">
            {manifesto.values.length === 0 && (
              <p className="text-sm text-slate-500">No values defined yet.</p>
            )}
            {manifesto.values.map((value, index) => (
              <div key={index} className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Value {index + 1}</p>
                  <button onClick={() => handleRemoveValue(index)} className="text-red-600 hover:text-red-700 text-sm px-3">
                    Remove
                  </button>
                </div>
                <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                  Axiom
                  <input
                    value={value.axiom}
                    onChange={(e) => handleUpdateValue(index, { axiom: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                    Reject
                    <textarea
                      value={value.rejection.reject}
                      onChange={(e) => handleUpdateValue(index, { rejection: { reject: e.target.value, embrace: value.rejection.embrace } })}
                      className={textAreaClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                    Embrace
                    <textarea
                      value={value.rejection.embrace}
                      onChange={(e) => handleUpdateValue(index, { rejection: { reject: value.rejection.reject, embrace: e.target.value } })}
                      className={textAreaClass}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Execution</h3>
          <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
            Promise
            <textarea
              value={manifesto.execution.promise}
              onChange={(e) => handleUpdateManifesto('execution', { ...manifesto.execution, promise: e.target.value })}
              className={textAreaClass}
            />
          </label>
        </div>
      </div>
    );
  };

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

    if (activeTab === 'siteConfig') {
      return renderSiteConfigEditor();
    }

    if (activeTab === 'heuristics') {
      return renderHeuristicsEditor();
    }

    if (activeTab === 'manifesto') {
      return renderManifestoEditor();
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
                {!['heuristics', 'manifesto', 'siteConfig'].includes(activeTab) && (
                  <button onClick={handleAddItem} className={btnPrimary}>Add Entry</button>
                )}
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
