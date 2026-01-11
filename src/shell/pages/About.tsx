import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeline } from '@shell/hooks/useTimeline';
import { useManifesto } from '@shell/hooks/useManifesto';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';

const About: React.FC = () => {
  const navigate = useNavigate();
  const { timeline: TIMELINE, loading } = useTimeline();
  const { manifesto, loading: manifestoLoading } = useManifesto();
  const { config } = useSiteConfig();
  const manifestoSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToManifesto = () => {
    manifestoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleViewResearch = () => {
    navigate('/research');
  };

  const contextCards = [
    { label: 'Status Quo', value: manifesto.context.statusQuo },
    { label: 'Grievance', value: manifesto.context.grievance },
    { label: 'Thesis', value: manifesto.context.thesis }
  ];

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
            <div className="w-full bg-center bg-no-repeat aspect-square md:aspect-video bg-cover rounded-xl shadow-sm overflow-hidden lg:w-1/2 relative group" style={{ backgroundImage: `url("${config.about.imageUrl}")` }}>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors"></div>
            </div>
            <div className="flex flex-col gap-6 lg:justify-center lg:w-1/2 lg:pl-10">
              <div className="flex flex-col gap-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">System Status: Online</span>
                </div>
                <h1 className="text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                  {config.about.heading}
                </h1>
                <h2 className="text-[#616f89] dark:text-gray-300 text-base font-normal leading-relaxed">
                  {config.about.subtitle}
                </h2>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleScrollToManifesto}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold shadow-lg hover:bg-primary/90 transition-all disabled:opacity-60"
                  disabled={manifestoLoading}
                >
                  Read Manifesto
                </button>
                <button
                  onClick={handleViewResearch}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-surface-dark border border-[#dbdfe6] dark:border-white/10 text-[#111318] dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  View Research
                </button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-10 py-16 border-t border-[#f0f2f4] dark:border-white/10">
            <div className="flex flex-col gap-4">
              <h2 className="text-[#111318] dark:text-white tracking-light text-[32px] font-bold leading-tight max-w-[720px]">{config.about.corePhilosophy}</h2>
              <p className="text-[#616f89] dark:text-gray-400 text-lg font-normal leading-normal max-w-[720px]">
                {config.about.corePhilosophySubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.about.philosophyCards.map((item, idx) => (
                <div key={idx} className="flex flex-1 gap-4 rounded-xl border border-[#dbdfe6] dark:border-white/10 bg-white dark:bg-surface-dark p-6 flex-col hover:border-primary/50 transition-colors group">
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{item.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#111318] dark:text-white text-xl font-bold leading-tight">{item.title}</h3>
                    <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-relaxed">{item.description}</p>
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

          <section ref={manifestoSectionRef} className="py-16 border-t border-[#f0f2f4] dark:border-white/10">
            <h2 className="text-[#111318] dark:text-white text-2xl font-bold mb-10">Our Manifesto</h2>

            <div className="space-y-8">
              {/* Context Section */}
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Context</h3>
                <div className="space-y-6">
                  {contextCards.map((card) => (
                    <div key={card.label}>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
                        {card.label}
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {card.value || `No ${card.label.toLowerCase()} defined yet.`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Values Section */}
              {manifesto.values && manifesto.values.length > 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Values & Principles</h3>
                  <div className="space-y-6">
                    {manifesto.values.map((value, idx) => (
                      <div key={idx} className="rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">{value.axiom || `Value ${idx + 1}`}</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-2">We Reject</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {value.rejection.reject || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-2">We Embrace</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {value.rejection.embrace || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Section */}
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Program</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
                      Severity
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {manifesto.program.severity || 'Not specified'}
                    </p>
                  </div>
                  {manifesto.program.items && manifesto.program.items.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">
                        Operating Heuristics
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {manifesto.program.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Execution Section */}
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Execution</h3>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
                    Promise
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {manifesto.execution.promise || 'No promise defined yet.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
