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
      className="group flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-surface-dark transition-all hover:border-primary hover:shadow-lg dark:hover:border-primary cursor-pointer"
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
      <div className="relative h-56 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${project.image}')` }}
          aria-hidden="true"
        ></div>
        {project.version && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 backdrop-blur-sm">
            {project.version}
          </div>
        )}
        {project.status === 'Archived' && (
          <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/40"></div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className={`flex h-2 w-2 rounded-full ${project.color}`}></span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {project.type} • {project.status}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          {project.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {project.description}
        </p>
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 dark:border-white/10 pt-4">
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-100 dark:bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
          {(() => {
            if (!linkUrl) return <span className="text-xs text-slate-400">No link</span>;
            return (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 dark:hover:text-primary/80"
              >
                {getLinkLabel()}
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover/btn:translate-x-1">
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
