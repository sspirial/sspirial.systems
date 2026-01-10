import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@shell/hooks/useContent';

const Projects: React.FC = () => {
  const { data: projects, loading } = useProjects();
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
            Exploring the fringes of computing.
          </h1>
          <p className="max-w-xl text-lg font-normal leading-normal text-slate-500 dark:text-slate-400">
            An index of experiments, tools, and prototypes by sspirial.systems. Functioning as a digital lab notebook.
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
            <article key={project.id} className="group flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-surface-dark transition-all hover:border-primary hover:shadow-lg dark:hover:border-primary">
              <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${project.image}')` }}></div>
                {project.version && (
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 backdrop-blur-sm">{project.version}</div>
                )}
                {project.status === 'Archived' && <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/40"></div>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`flex h-2 w-2 rounded-full ${project.color}`}></span>
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{project.type} • {project.status}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">{project.title}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
                <div className="mt-auto flex items-end justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map(tag => (
                      <span key={tag} className="rounded bg-slate-100 dark:bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400">{tag}</span>
                    ))}
                  </div>
                  <a className="group/btn flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 dark:hover:text-primary/80" href="#">
                    Log
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 dark:bg-surface-dark border border-white/10 px-6 py-16 text-center shadow-inner">
          <span className="material-symbols-outlined mb-4 text-4xl text-white dark:text-primary">science</span>
          <h2 className="mb-4 max-w-lg text-3xl font-bold text-white dark:text-white sm:text-4xl">Have a weird problem?</h2>
          <p className="mb-8 max-w-md text-lg text-slate-300 dark:text-slate-300">We specialize in technical oddities. Let's research it together.</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-background-dark transition-colors hover:bg-primary/90">Start Collaboration</button>
            <Link to="/about" className="flex h-12 items-center justify-center rounded-lg border border-slate-600 bg-transparent px-8 text-base font-bold text-white transition-colors hover:bg-slate-800 dark:hover:bg-white/10">Read About Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;
