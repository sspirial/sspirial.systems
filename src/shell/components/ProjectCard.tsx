/**
 * ProjectCard Component
 * Reusable project card used in both Home and Projects pages
 */

import React from 'react';
import { Project } from '@core/types';

interface ProjectCardProps {
  project: Project;
  onReadmeClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onReadmeClick }) => {
  const activateCard = () => {
    if (project.repositoryUrl) {
      onReadmeClick?.();
    }
  };

  const getLinkUrl = () => {
    if (project.projectLinkType === 'external') {
      return project.projectUrl;
    }
    return project.repositoryUrl;
  };

  const getLinkLabel = () => {
    if (project.projectLinkType === 'external') {
      return 'Visit';
    }
    return 'Repository';
  };

  const linkUrl = getLinkUrl();

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl glass-panel glass-panel-hover cursor-pointer"
      role={project.repositoryUrl ? 'button' : undefined}
      tabIndex={project.repositoryUrl ? 0 : undefined}
      aria-label={`${project.title} – ${project.description}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) return;
        activateCard();
      }}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest('a')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateCard();
        }
      }}
    >
      <div className="relative h-48 w-full overflow-hidden border-b border-gray-200 dark:border-white/5">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale contrast-125 dark:opacity-80 group-hover:opacity-100 group-hover:grayscale-0"
          style={{ backgroundImage: `url('${project.image}')` }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        {project.version && (
          <div className="absolute right-3 top-3 rounded bg-zinc-900/90 border border-white/10 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
            v{project.version}
          </div>
        )}
        {project.status === 'Archived' && (
          <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/60 flex items-center justify-center">
            <span className="font-mono text-xs font-bold bg-red-950/80 border border-red-500/30 text-red-400 px-3 py-1 rounded">ARCHIVED</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`flex h-2 w-2 rounded-full ${project.color || 'bg-primary animate-pulse'}`}></span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#616f89] dark:text-gray-400">
              {project.type}
            </span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800/80 text-gray-500 dark:text-zinc-400 uppercase tracking-widest border border-gray-200 dark:border-white/5">
            {project.status}
          </span>
        </div>
        <h3 className="mb-1.5 text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-xs text-slate-600 dark:text-slate-400 font-body">
          {project.description}
        </p>
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 dark:border-white/5 pt-4">
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-[9px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
          {(() => {
            if (!linkUrl) return <span className="text-[10px] font-mono text-slate-400">offline</span>;
            return (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex items-center gap-0.5 text-[10px] font-mono font-bold text-primary hover:text-primary/80 dark:hover:text-primary/80"
              >
                <span>{getLinkLabel().toUpperCase()}</span>
                <span className="material-symbols-outlined text-[14px] transition-transform group-hover/btn:translate-x-0.5">
                  arrow_forward
                </span>
              </a>
            );
          })()}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
