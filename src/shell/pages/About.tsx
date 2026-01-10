import React from 'react';
import { useTimeline } from '@shell/hooks/useContent';

const About: React.FC = () => {
  const { data: TIMELINE, loading } = useTimeline();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="px-5 md:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <section className="flex flex-col gap-6 py-10 lg:flex-row items-center">
            <div className="w-full bg-center bg-no-repeat aspect-square md:aspect-video bg-cover rounded-xl shadow-sm overflow-hidden lg:w-1/2 relative group" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOBDPUvWdNoYaF64ArO3xoaP7S4_3LFi4r-fzIB6Xq-4qYhh0CAvKVTRIOVAIIhqhG_BhUCJMMI5ZTNmXKMVOwztpaw4c9Tyi7wJ0P0lcoaECVxJ1ElYq3ZuhelpnXKPndedG8kH99u2R5dGhSuXS5_c8tl28KoKPNDe6-BrMk6bO2hoqIMSMKXbP2nHB2OLtKuOiTLC7e9mkdzMrf6GGfeBWbYjgoDFFAY5ADSSrViuCNCpbyj-g_Ofdb6TynuGk4EGUBuKiEBUOU")' }}>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors"></div>
            </div>
            <div className="flex flex-col gap-6 lg:justify-center lg:w-1/2 lg:pl-10">
              <div className="flex flex-col gap-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">System Status: Online</span>
                </div>
                <h1 className="text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                  We are sspirial.systems.<br />An Independent R&D Organism.
                </h1>
                <h2 className="text-[#616f89] dark:text-gray-300 text-base font-normal leading-relaxed">
                  Exploring the intersection of design, code, and systems thinking through radical curiosity. We operate outside traditional models to foster pure innovation.
                </h2>
              </div>
              <div className="flex gap-4">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold shadow-lg hover:bg-primary/90 transition-all">Read Manifesto</button>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-surface-dark border border-[#dbdfe6] dark:border-white/10 text-[#111318] dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all">View Research</button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-10 py-16 border-t border-[#f0f2f4] dark:border-white/10">
            <div className="flex flex-col gap-4">
              <h2 className="text-[#111318] dark:text-white tracking-light text-[32px] font-bold leading-tight max-w-[720px]">Core Philosophy</h2>
              <p className="text-[#616f89] dark:text-gray-400 text-lg font-normal leading-normal max-w-[720px]">
                Operating as a micro-studio to maintain agility, purity of research, and direct connection to the code.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'lightbulb', title: 'Radical Curiosity', desc: 'Questioning the default state. We investigate the "why" before the "how".' },
                { icon: 'code', title: 'Open Source', desc: 'Sharing knowledge to accelerate growth. Our findings are public goods.' },
                { icon: 'hub', title: 'Systemic Design', desc: 'Viewing every project as a connected part of a whole. Nothing exists in isolation.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-1 gap-4 rounded-xl border border-[#dbdfe6] dark:border-white/10 bg-white dark:bg-surface-dark p-6 flex-col hover:border-primary/50 transition-colors group">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{item.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#111318] dark:text-white text-xl font-bold leading-tight">{item.title}</h3>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 border-t border-[#f0f2f4] dark:border-white/10">
            <h2 className="text-[#111318] dark:text-white text-2xl font-bold mb-10">Evolution Log</h2>
            <div className="grid grid-cols-[40px_1fr] gap-x-6 px-4">
              {TIMELINE.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className={`p-2 rounded-full ${item.isLatest ? 'bg-primary text-background-dark shadow-lg shadow-primary/30' : 'bg-[#f0f2f4] dark:bg-surface-dark text-[#111318] dark:text-white'}`}>
                      <span className="material-symbols-outlined text-sm">{item.isLatest ? 'monitor_heart' : 'terminal'}</span>
                    </div>
                    {idx < TIMELINE.length - 1 && <div className="w-[2px] bg-[#f0f2f4] dark:bg-white/10 h-full grow my-2"></div>}
                  </div>
                  <div className={`flex flex-1 flex-col ${idx < TIMELINE.length - 1 ? 'pb-8' : 'pt-1'}`}>
                    <div className="flex justify-between items-baseline mb-2">
                      <p className="text-[#111318] dark:text-white text-lg font-bold leading-normal">{item.version}</p>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${item.isLatest ? 'bg-primary text-background-dark' : 'bg-primary/10 text-primary'}`}>{item.year}</span>
                    </div>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">{item.description}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
