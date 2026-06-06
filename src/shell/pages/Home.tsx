import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '@shell/hooks/useContent';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';
import { ProjectCard } from '@shell/components/ProjectCard';
import { Terminal } from '@shell/components/Terminal';
import { db } from '@shell/services/instantdb-impl';

const Home: React.FC = () => {
  const { data: projects } = useProjects();
  const { config } = useSiteConfig();
  const navigate = useNavigate();
  const connectionStatus = db.useConnectionStatus();

  // Helper to format connection status display
  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'authenticated':
        return { label: 'ONLINE / SECURE', color: 'bg-emerald-500 text-emerald-500' };
      case 'opened':
      case 'connecting':
        return { label: 'CONNECTING...', color: 'bg-amber-500 text-amber-500 animate-pulse' };
      default:
        return { label: 'OFFLINE', color: 'bg-red-500 text-red-500' };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark cyber-grid transition-colors duration-300">
      
      {/* Decorative background glows */}
      <div className="glow-spot w-[300px] h-[300px] bg-primary/20 top-24 left-1/4 dark:bg-primary/5" />
      <div className="glow-spot w-[400px] h-[400px] bg-accent/20 bottom-1/4 right-1/4 dark:bg-accent/5" />

      <main className="flex-1 flex flex-col items-center px-6 lg:px-12 pb-20 relative z-10">
        <div className="max-w-[1200px] w-full flex flex-col">
          
          {/* 1. Hero Section */}
          <section className="py-12 lg:py-20 border-b border-[#e5e7eb] dark:border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Studio Specs & CTA */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                
                {/* Meta Indicator */}
                {import.meta.env.DEV && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] tracking-widest text-[#616f89] dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 px-2.5 py-1 rounded">
                      SYS_VER: {config.version}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-white/5">
                      <span className={`w-2 h-2 rounded-full ${status.color.split(' ')[0]}`} />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111318] dark:text-gray-300">
                        DB_NET: {status.label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tagline */}
                <h1 className="text-[#111318] dark:text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.03em]">
                  {config.hero.tagline.split(config.hero.highlight).map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < config.hero.tagline.split(config.hero.highlight).length - 1 && (
                        <span className="text-primary relative inline-block">
                          {config.hero.highlight}
                          <span className="absolute left-0 bottom-0.5 w-full h-[4px] bg-primary/20 rounded" />
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </h1>

                {/* Description */}
                <p className="text-[#616f89] dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-[620px] font-body">
                  {config.hero.description}
                </p>

                {/* Action Controls */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <Link 
                    to="/research" 
                    className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[#111318] dark:bg-white text-white dark:text-[#111318] text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10 dark:shadow-white/5"
                  >
                    <span>Inspect Lab Logs</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 border border-gray-300 dark:border-white/10 bg-white/40 dark:bg-white/5 text-[#111318] dark:text-white text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span>Read Manifesto</span>
                  </Link>
                </div>

                {/* Status Sub-panel */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-dashed border-[#e5e7eb] dark:border-white/10 mt-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">hub</span>
                      <p className="font-mono text-[10px] text-[#616f89] dark:text-zinc-500 uppercase tracking-wider">Current Focus</p>
                    </div>
                    <p className="font-bold text-sm text-[#111318] dark:text-gray-200">{config.currentFocus.label}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">task_alt</span>
                      <p className="font-mono text-[10px] text-[#616f89] dark:text-zinc-500 uppercase tracking-wider">Availability</p>
                    </div>
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{config.currentFocus.availability}</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Console */}
              <div className="lg:col-span-5 w-full">
                <Terminal />
              </div>

            </div>
          </section>

          {/* 2. Marquee Ticker */}
          <div className="w-full overflow-hidden border-b border-[#e5e7eb] dark:border-white/10 bg-gray-50/50 dark:bg-surface-dark/50 py-3.5 backdrop-blur-sm">
            <div className="flex gap-16 text-[10px] font-mono text-[#616f89] dark:text-gray-500 uppercase tracking-[0.2em] animate-marquee will-change-transform">
              {[...config.systemsMarquee, ...config.systemsMarquee].map((item, idx) => (
                <span key={idx} className="whitespace-nowrap flex items-center gap-2">
                  <span className="text-primary font-bold">◇</span> {item}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Featured Work */}
          <section className="py-16 lg:py-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="font-mono text-xs text-primary uppercase tracking-wider">Selected R&D Nodes</span>
                </div>
                <h2 className="text-[#111318] dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">
                  Featured Projects
                </h2>
              </div>
              <Link 
                to="/projects" 
                className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:underline bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded border border-primary/20 self-start md:self-auto transition-colors"
              >
                <span>OPEN_DIRECTORY.exe</span>
                <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter((p) => p.featured).slice(0, 3).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onReadmeClick={() => navigate(`/projects/${project.id}`)}
                />
              ))}
            </div>
          </section>

          {/* 4. Strategic Objectives / Focus Areas */}
          <section className="py-16 lg:py-24 border-t border-[#e5e7eb] dark:border-white/10">
            <div className="flex flex-col gap-12">
              <div className="max-w-[600px] text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="font-mono text-xs text-accent uppercase tracking-wider">Architectural Directives</span>
                </div>
                <h2 className="text-[#111318] dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">
                  Systems Philosophy
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {config.focusAreas.map((area, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-white/5 glass-panel-hover text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                      <span className="font-mono text-xs text-accent font-bold">0{idx + 1}</span>
                    </div>
                    <h3 className="text-[#111318] dark:text-primary text-lg font-bold">{area.title}</h3>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm leading-relaxed font-body">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Home;
