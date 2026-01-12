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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Projects
          </button>
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">error</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Project Not Found</h1>
            <p className="text-slate-500 dark:text-slate-400">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`${project.color} w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className="material-symbols-outlined text-white text-3xl">terminal</span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  project.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  project.status === 'Research' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  project.status === 'Archived' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {project.status}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{project.type}</span>
                {project.version && (
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{project.version}</span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">{project.description}</p>
          
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl.startsWith('http') ? project.repositoryUrl : `https://github.com/${project.repositoryUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">code</span>
                View Repository
              </a>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">open_in_new</span>
                Visit Project
              </a>
            )}
          </div>
        </div>

        {/* README Content */}
        {project.repositoryUrl && (
          <article className="prose prose-invert max-w-none">
            <div className="border-t border-gray-200 dark:border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Documentation</h2>
              <MarkdownViewer
                fetchMarkdown={() => fetchReadme(project.repositoryUrl!)}
                fileName="README.md"
              />
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
