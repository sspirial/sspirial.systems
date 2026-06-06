import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '@shell/hooks/useProjects';
import { MarkdownViewer } from '@shell/components/MarkdownViewer';
import { fetchReadme } from '@shell/services/github-impl';
import { Project } from '@core/types';

const ProjectView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { projects, loading } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!loading && id) {
      const found = projects.find(p => p.id === id);
      setProject(found || null);
    }
  }, [id, projects, loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Reading project node...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark cyber-grid">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-primary/80 transition-colors mb-8 bg-primary/5 border border-primary/20 px-3 py-1.5 rounded"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            ESC_TO_DIRECTORY
          </button>
          <div className="text-center py-12 glass-panel rounded-xl border border-gray-200 dark:border-white/5 p-8">
            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-mono">NODE_NOT_FOUND</h1>
            <p className="text-slate-500 dark:text-slate-400">The specified project registry node could not be resolved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark cyber-grid transition-colors duration-300">
      
      {/* Decorative background glows */}
      <div className="glow-spot w-[300px] h-[300px] bg-primary/10 top-24 left-10 dark:bg-primary/5" />
      <div className="glow-spot w-[300px] h-[300px] bg-accent/10 bottom-24 right-10 dark:bg-accent/5" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12 relative z-10">
        
        {/* Navigation */}
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-primary/80 transition-colors mb-8 bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 px-3 py-1.5 rounded"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          ESC_TO_DIRECTORY
        </button>

        {/* Primary Content Structure: Split Screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Block (7 cols): Document Main Container */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Project Cover Block */}
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 relative bg-[#111318] shadow-2xl">
              <div 
                className="w-full h-full bg-cover bg-center filter grayscale contrast-125 dark:opacity-85" 
                style={{ backgroundImage: `url("${project.image}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="font-mono text-[10px] bg-zinc-900/80 border border-white/10 px-2.5 py-1 rounded text-primary">
                  SYS_IMAGE_RESOLVER.obj
                </span>
                {project.version && (
                  <span className="font-mono text-xs bg-primary/20 border border-primary/40 text-primary px-3 py-0.5 rounded font-bold">
                    VERSION: {project.version}
                  </span>
                )}
              </div>
            </div>

            {/* Document Render block */}
            {project.repositoryUrl && (
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-mono">SYSTEM_DOCUMENTATION.md</h2>
                  </div>
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">UTF-8 // RAW</span>
                </div>
                <MarkdownViewer
                  fetchMarkdown={() => fetchReadme(project.repositoryUrl!)}
                  fileName="README.md"
                  className="rounded-xl"
                />
              </section>
            )}

          </div>

          {/* Right Block (4 cols): Technical Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Metadata Card */}
            <div className="rounded-xl glass-panel p-6 flex flex-col gap-6 text-left shadow-lg">
              
              <div className="flex items-center gap-3">
                <div className={`${project.color || 'bg-primary'} w-10 h-10 rounded flex items-center justify-center text-white flex-shrink-0`}>
                  <span className="material-symbols-outlined text-[24px]">terminal</span>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{project.title}</h1>
                  <p className="font-mono text-[10px] text-gray-500 dark:text-zinc-400 uppercase mt-0.5">{project.type}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-body">
                {project.description}
              </p>

              {/* Status matrix */}
              <div className="border-t border-b border-gray-200 dark:border-white/5 py-4 my-2 flex flex-col gap-3 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">SYSTEM STATUS:</span>
                  <span className={`font-bold ${
                    project.status === 'Active' ? 'text-emerald-500' :
                    project.status === 'Research' ? 'text-blue-500' :
                    project.status === 'Archived' ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NODE CLASS:</span>
                  <span className="text-slate-900 dark:text-gray-300">{project.type.toUpperCase()}</span>
                </div>
                {project.version && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">VERSION ID:</span>
                    <span className="text-slate-900 dark:text-gray-300">v{project.version}</span>
                  </div>
                )}
              </div>

              {/* Technology Index */}
              {project.tags.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">TAG_INDEX.sys</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-slate-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-gray-200 dark:border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-white/5">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl.startsWith('http') ? project.repositoryUrl : `https://github.com/${project.repositoryUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-2 bg-[#111318] dark:bg-white text-white dark:text-[#111318] text-xs font-mono font-bold rounded hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">code</span>
                    <span>REPO_ACCESS.sh</span>
                  </a>
                )}
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center justify-center gap-2 border border-primary text-primary text-xs font-mono font-bold rounded bg-primary/5 hover:bg-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>LIVE_DEPLOY.exe</span>
                  </a>
                )}
              </div>

            </div>

          </aside>

        </div>

      </div>
    </div>
  );
};

export default ProjectView;
