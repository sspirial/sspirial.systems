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
  const filters = ['All', 'Prototypes', 'Tools', 'Experiments', 'Architecture'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredProjects = projects.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Prototypes') return p.type === 'Prototype';
    if (filter === 'Tools') return p.type === 'Tool';
    if (filter === 'Experiments') return p.type === 'Experiment';
    if (filter === 'Architecture') return p.type === 'Architecture';
    return true;
  });

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            {config.projects.heading}
          </h1>
          <p className="max-w-xl text-lg font-normal leading-normal text-slate-500 dark:text-slate-400">
            {config.projects.subtitle}
          </p>
        </div>
      </section>

      <section className="sticky top-[72px] z-40 border-b border-[#e5e7eb] dark:border-white/10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all ${filter === f
                  ? 'bg-primary text-white'
                  : 'border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:border-primary/50'
                  }`}
              >
                {f === 'All' && <span className="material-symbols-outlined text-[18px]">grid_view</span>}
                <p className="text-sm font-medium leading-normal">{f}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onReadmeClick={() => navigate(`/projects/${project.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 dark:bg-surface-dark border border-white/10 px-6 py-16 text-center shadow-inner">
          <span className="material-symbols-outlined mb-4 text-4xl text-white dark:text-primary">science</span>
          <h2 className="mb-4 max-w-lg text-3xl font-bold text-white dark:text-white sm:text-4xl">Have a weird problem?</h2>
          <p className="mb-8 max-w-md text-lg text-slate-300 dark:text-slate-300">We specialize in technical oddities. Let's research it together.</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a 
              href="https://github.com/sspirial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-background-dark transition-colors hover:bg-primary/90"
            >
              Start Collaboration
            </a>
            <Link to="/about" className="flex h-12 items-center justify-center rounded-lg border border-slate-600 bg-transparent px-8 text-base font-bold text-white transition-colors hover:bg-slate-800 dark:hover:bg-white/10">Read About Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;
