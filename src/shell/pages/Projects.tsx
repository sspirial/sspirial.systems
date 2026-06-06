import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '@shell/hooks/useProjects';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';
import { ProjectCard } from '@shell/components/ProjectCard';

const Projects: React.FC = () => {
  const { projects, loading } = useProjects();
  const { config } = useSiteConfig();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const filters = ['All', 'Prototypes', 'Tools', 'Experiments', 'Architecture'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Reading registry nodes...</p>
        </div>
      </div>
    );
  }

  // Filter & Search logic
  const filteredProjects = projects.filter(p => {
    const matchesFilter = 
      filter === 'All' ||
      (filter === 'Prototypes' && p.type === 'Prototype') ||
      (filter === 'Tools' && p.type === 'Tool') ||
      (filter === 'Experiments' && p.type === 'Experiment') ||
      (filter === 'Architecture' && p.type === 'Architecture');
      
    const matchesSearch = 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark cyber-grid transition-colors duration-300">
      
      {/* Decorative background glows */}
      <div className="glow-spot w-[250px] h-[250px] bg-primary/20 top-24 right-10 dark:bg-primary/5" />
      <div className="glow-spot w-[350px] h-[350px] bg-accent/25 bottom-12 left-10 dark:bg-accent/5" />

      <main className="flex-1 flex flex-col items-center px-6 lg:px-12 pb-20 relative z-10">
        <div className="max-w-[1200px] w-full flex flex-col">
          
          {/* Header */}
          <section className="py-12 lg:py-16 border-b border-gray-200 dark:border-white/10">
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs text-primary uppercase tracking-wider">PROJECT_REGISTRY.sh</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.03em] text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                {config.projects.heading}
              </h1>
              <p className="max-w-2xl text-base sm:text-lg text-slate-500 dark:text-gray-400">
                {config.projects.subtitle}
              </p>
            </div>
          </section>

          {/* Sticky Filtering & Search Control Bar */}
          <section className="sticky top-[72px] z-40 border-b border-[#e5e7eb] dark:border-white/15 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md py-4 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Category Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                {filters.map((f) => {
                  const count = projects.filter(p => {
                    if (f === 'All') return true;
                    if (f === 'Prototypes') return p.type === 'Prototype';
                    if (f === 'Tools') return p.type === 'Tool';
                    if (f === 'Experiments') return p.type === 'Experiment';
                    if (f === 'Architecture') return p.type === 'Architecture';
                    return false;
                  }).length;

                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded px-4 border transition-all font-mono text-xs ${filter === f
                        ? 'border-primary bg-primary/15 text-primary font-bold'
                        : 'border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/50 text-slate-600 dark:text-gray-400 hover:border-primary/50'
                        }`}
                    >
                      <span>{f.toUpperCase()}</span>
                      <span className={`text-[10px] ${filter === f ? 'text-primary' : 'text-gray-400 dark:text-zinc-600'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-[280px]">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 dark:text-zinc-600 text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Query index node..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 rounded border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/50 text-xs font-mono placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-white transition-colors"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2.5 text-gray-400 dark:text-zinc-500 hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

            </div>
          </section>

          {/* Cards Grid */}
          <section className="py-8">
            {filteredProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-zinc-600 mb-2">database_off</span>
                <p className="font-mono text-sm text-gray-500 dark:text-zinc-500">NO REGISTRY NODES MATCHED THE FILTER QUERY</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onReadmeClick={() => navigate(`/projects/${project.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Collaboration Banner */}
          <section className="mt-8">
            <div className="flex flex-col items-center justify-center rounded-2xl glass-panel border border-[#e5e7eb] dark:border-white/5 px-6 py-14 text-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 animate-pulse">
                  <span className="material-symbols-outlined text-2xl text-primary">science</span>
                </div>
                <h2 className="mb-3 max-w-lg text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Have a complex architectural challenge?
                </h2>
                <p className="mb-8 max-w-md text-sm text-slate-500 dark:text-gray-400 font-body leading-relaxed">
                  We design experimental systems, custom subagents, and solve non-standard problems. Let's inspect it together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a 
                    href="mailto:hello@sspirial.systems" 
                    className="flex h-11 items-center justify-center rounded-lg bg-[#111318] dark:bg-white px-8 text-sm font-bold text-white dark:text-[#111318] hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                  >
                    Initiate Connection
                  </a>
                  <Link 
                    to="/about" 
                    className="flex h-11 items-center justify-center rounded-lg border border-gray-300 dark:border-white/10 bg-white/40 dark:bg-white/5 px-8 text-sm font-bold text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Inspect Manifesto
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Projects;
