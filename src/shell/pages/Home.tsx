import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@shell/hooks/useContent';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';

const Home: React.FC = () => {
  const { data: projects } = useProjects();
  const { config } = useSiteConfig();
  
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <main className="flex-1 flex flex-col items-center px-6 lg:px-12 pb-20">
        <div className="max-w-[1200px] w-full flex flex-col">
          <section className="py-16 lg:py-24 border-b border-[#e5e7eb] dark:border-white/10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
              <div className="flex-1 flex flex-col gap-8">
                <div className="flex flex-col gap-4 text-left">
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded w-fit uppercase tracking-widest">{config.version} // {config.statusLabel}</span>
                  <h1 className="text-[#111318] dark:text-white text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-[-0.033em]">
                    {config.hero.tagline.split(config.hero.highlight).map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < config.hero.tagline.split(config.hero.highlight).length - 1 && (
                          <span className="text-primary">{config.hero.highlight}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </h1>
                  <p className="text-[#616f89] dark:text-gray-400 text-lg leading-relaxed max-w-[600px] mt-2">
                    {config.hero.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link to="/research" className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#111318] dark:bg-white text-white dark:text-[#111318] text-base font-bold hover:opacity-90 transition-all">
                    <span>Explore Lab</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                  <Link to="/about" className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 border border-[#e5e7eb] dark:border-[#2a3441] bg-transparent text-[#111318] dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-[#1a2332] transition-all">
                    <span>View Manifesto</span>
                  </Link>
                </div>
                <div className="flex gap-8 pt-4 border-t border-dashed border-[#e5e7eb] dark:border-white/10 mt-2">
                  <div>
                    <p className="font-mono text-xs text-[#616f89] dark:text-gray-500 uppercase mb-1">Current Focus</p>
                    <p className="font-bold text-sm">{config.currentFocus.label}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#616f89] dark:text-gray-500 uppercase mb-1">Availability</p>
                    <p className="font-bold text-sm text-green-600">{config.currentFocus.availability}</p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[45%]">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-[#111318]">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                  <div className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: `url("${config.hero.imageUrl}")` }}>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-2 rounded border border-white/20">
                      <p className="font-mono text-xs font-bold">SYS_VISUALIZER.exe</p>
                    </div>
                    <span className="material-symbols-outlined text-white opacity-80 animate-spin">settings</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="w-full overflow-hidden border-b border-[#e5e7eb] dark:border-white/10 bg-gray-50 dark:bg-surface-dark py-3">
            <div className="flex gap-12 text-sm font-mono text-[#616f89] dark:text-gray-400 uppercase tracking-widest animate-marquee will-change-transform">
              {/* Duplicate items for seamless infinite loop */}
              {[...config.systemsMarquee, ...config.systemsMarquee].map((item, idx) => (
                <span key={idx} className="whitespace-nowrap">{item}</span>
              ))}
            </div>
          </div>

          <section className="py-16 lg:py-24">
            <div className="flex justify-between items-end mb-12 px-2">
              <div>
                <h2 className="text-[#111318] dark:text-white text-3xl lg:text-4xl font-bold leading-tight tracking-tight">Featured Projects</h2>
                <p className="text-[#616f89] dark:text-gray-400 mt-2 font-mono text-sm">// SELECTED WORKS 2023-2024</p>
              </div>
              <Link to="/projects" className="hidden md:flex items-center gap-1 text-primary font-bold text-sm hover:underline">
                View All Archive
                <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="group flex flex-col gap-4 p-2 rounded-xl transition-all hover:bg-white hover:shadow-xl dark:hover:bg-[#151c2a] border border-transparent hover:border-[#e5e7eb] dark:hover:border-[#2a3441]">
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                    <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur text-white text-[10px] font-mono px-2 py-1 rounded">{project.id}</div>
                    <div className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${project.image}')` }}></div>
                  </div>
                  <div className="px-2 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[#111318] dark:text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                      <span className="material-symbols-outlined text-[#616f89] group-hover:text-primary transition-colors transform group-hover:translate-x-1">north_east</span>
                    </div>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-[#1a2332] text-[#616f89] dark:text-gray-400 text-xs font-mono rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 lg:py-24 border-t border-[#e5e7eb] dark:border-white/10">
            <div className="flex flex-col gap-12">
              <h2 className="text-[#111318] dark:text-primary text-3xl lg:text-5xl font-bold leading-tight tracking-tight">
                Current focus
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {config.focusAreas.map((area, idx) => (
                  <div key={idx} className="flex flex-col gap-4 pl-6 border-l-2 border-accent">
                    <h3 className="text-[#111318] dark:text-primary text-xl font-bold">{area.title}</h3>
                    <p className="text-[#616f89] dark:text-gray-400 text-base leading-relaxed">
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
