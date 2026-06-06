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
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Reading manifesto node...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark cyber-grid transition-colors duration-300">
      
      {/* Decorative background glows */}
      <div className="glow-spot w-[300px] h-[300px] bg-primary/10 top-24 left-10 dark:bg-primary/5" />
      <div className="glow-spot w-[400px] h-[400px] bg-accent/10 bottom-24 right-10 dark:bg-accent/5" />

      <main className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 relative z-10">
        
        {/* 1. Header Section */}
        <section className="flex flex-col gap-8 py-10 lg:flex-row items-center border-b border-gray-200 dark:border-white/10">
          <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 relative bg-[#111318] shadow-2xl">
            <div 
              className="w-full h-full bg-cover bg-center filter grayscale contrast-125 dark:opacity-80 hover:opacity-100 transition-opacity duration-500" 
              style={{ backgroundImage: `url("${config.about.imageUrl}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4">
              <span className="font-mono text-[10px] bg-zinc-900/80 border border-white/10 px-2.5 py-1 rounded text-primary">
                MANIFESTO_NODE.img
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-6 lg:w-1/2 lg:pl-10 text-left">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-white/5 w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-gray-300">
                  SYSTEM STATUS: OPERATIONAL
                </span>
              </div>
              <h1 className="text-[#111318] dark:text-white text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.035em]">
                {config.about.heading}
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-sm leading-relaxed font-body">
                {config.about.subtitle}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleScrollToManifesto}
                className="flex items-center justify-center rounded-lg h-11 px-6 bg-[#111318] dark:bg-white text-white dark:text-[#111318] text-xs font-mono font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                disabled={manifestoLoading}
              >
                READ_MANIFESTO.sh
              </button>
              <button
                onClick={handleViewResearch}
                className="flex items-center justify-center rounded-lg h-11 px-6 border border-gray-300 dark:border-white/10 bg-white/40 dark:bg-white/5 text-[#111318] dark:text-white text-xs font-mono font-bold hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                BROWSE_RESEARCH.exe
              </button>
            </div>
          </div>
        </section>

        {/* 2. Core Philosophy */}
        <section className="py-16 border-b border-gray-200 dark:border-white/10 text-left">
          <div className="flex flex-col gap-4 mb-10 max-w-[720px]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-wider">AXIOMATIC PRINCIPLES</span>
            </div>
            <h2 className="text-[#111318] dark:text-white text-2xl sm:text-3xl font-bold tracking-tight">
              {config.about.corePhilosophy}
            </h2>
            <p className="text-[#616f89] dark:text-gray-400 text-sm font-body leading-relaxed">
              {config.about.corePhilosophySubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.about.philosophyCards.map((item, idx) => (
              <div 
                key={idx} 
                className="flex rounded-xl glass-panel p-6 flex-col gap-4 shadow-sm glass-panel-hover text-left"
              >
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] dark:text-white text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="text-[#616f89] dark:text-gray-400 text-xs font-body leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Evolution Log (Timeline) */}
        <section className="py-16 border-b border-gray-200 dark:border-white/10 text-left">
          <div className="flex items-center gap-2 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs text-accent uppercase tracking-wider">SYSTEM_EVOLUTION_LOG.db</span>
          </div>
          
          <div className="grid grid-cols-[30px_1fr] gap-x-6 px-2">
            {TIMELINE.map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Visual Pipeline Node */}
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    item.isLatest 
                      ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' 
                      : 'bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-white/5 text-gray-500'
                  }`}>
                    <span className="material-symbols-outlined text-[12px]">{item.isLatest ? 'monitor_heart' : 'terminal'}</span>
                  </div>
                  {idx < TIMELINE.length - 1 && (
                    <div className="w-[1px] bg-gray-200 dark:bg-white/5 h-full grow my-2" />
                  )}
                </div>
                
                {/* Content Block */}
                <div className={`flex flex-col ${idx < TIMELINE.length - 1 ? 'pb-8' : 'pt-0.5'}`}>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-slate-900 dark:text-white text-base font-extrabold tracking-tight">{item.version}</p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                      item.isLatest 
                        ? 'bg-primary/15 border-primary/30 text-primary font-bold animate-pulse' 
                        : 'bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-white/5 text-gray-500'
                    }`}>
                      {item.year}
                    </span>
                  </div>
                  <p className="text-[#616f89] dark:text-gray-400 text-xs font-body leading-relaxed">{item.description}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 4. Manifesto Deep Dive */}
        <section ref={manifestoSectionRef} className="py-16 text-left">
          <div className="flex items-center gap-2 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-mono text-xs text-primary uppercase tracking-wider">MANIFESTO_DEEP_DIVE.md</span>
          </div>

          <div className="space-y-8">
            
            {/* Context Block */}
            <div className="rounded-xl glass-panel p-6 sm:p-8 shadow-md flex flex-col gap-6">
              <h3 className="font-mono text-xs text-primary uppercase tracking-wider border-b border-gray-200 dark:border-white/5 pb-3">
                SEC_01 // CONTEXTUAL_ANALYSIS
              </h3>
              <div className="space-y-6">
                {contextCards.map((card) => (
                  <div key={card.label} className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      &gt; {card.label.toUpperCase()}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-body whitespace-pre-wrap pl-3 border-l border-primary/20">
                      {card.value || `No ${card.label.toLowerCase()} defined.`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Values Axiom Block */}
            {manifesto.values && manifesto.values.length > 0 && (
              <div className="rounded-xl glass-panel p-6 sm:p-8 shadow-md flex flex-col gap-6">
                <h3 className="font-mono text-xs text-accent dark:text-purple-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/5 pb-3">
                  SEC_02 // VALUES_&_AXIOMS
                </h3>
                <div className="space-y-6">
                  {manifesto.values.map((value, idx) => (
                    <div key={idx} className="rounded-lg border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-950/40 p-5 flex flex-col gap-3">
                      <h4 className="font-mono text-xs font-bold text-primary">
                        AXIOM 0{idx + 1} // {value.axiom ? value.axiom.toUpperCase() : `V_${idx + 1}`}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-dashed border-gray-200 dark:border-white/5">
                        <div className="pl-3 border-l border-red-500/30">
                          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-500 mb-1">We Reject</p>
                          <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-body">
                            {value.rejection.reject || 'Unspecified'}
                          </p>
                        </div>
                        <div className="pl-3 border-l border-emerald-500/30">
                          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-500 mb-1">We Embrace</p>
                          <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-body">
                            {value.rejection.embrace || 'Unspecified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program / Heuristics Block */}
            <div className="rounded-xl glass-panel p-6 sm:p-8 shadow-md flex flex-col gap-6">
              <h3 className="font-mono text-xs text-emerald-500 uppercase tracking-wider border-b border-gray-200 dark:border-white/5 pb-3">
                SEC_03 // DIRECTIVE_PROGRAM
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">&gt; SEVERITY_METRIC</p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 font-body leading-relaxed pl-3 border-l border-emerald-500/20">
                    {manifesto.program.severity || 'Unspecified'}
                  </p>
                </div>
                
                {manifesto.program.items && manifesto.program.items.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">&gt; OPERATING_HEURISTICS</p>
                    <div className="flex flex-wrap gap-2 pl-3">
                      {manifesto.program.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {item.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Execution / Promise Block */}
            <div className="rounded-xl glass-panel p-6 sm:p-8 shadow-md flex flex-col gap-6">
              <h3 className="font-mono text-xs text-primary uppercase tracking-wider border-b border-gray-200 dark:border-white/5 pb-3">
                SEC_04 // COMMITMENT_EXECUTION
              </h3>
              <div className="flex flex-col gap-1.5">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  &gt; STUDIO_PROMISE
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-body whitespace-pre-wrap pl-3 border-l border-primary/20">
                  {manifesto.execution.promise || 'No promise defined.'}
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default About;
