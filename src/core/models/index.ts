/**
 * Domain Models - Pure data structures and factories
 * No side effects, framework-agnostic
 */

import {
  Heuristic,
  Self,
  Manifesto,
  Project,
  ResearchPost,
  TimelineItem,
} from '../types';

/**
 * Factory function to create an empty Manifesto
 */
export function createEmptyManifesto(): Manifesto<Heuristic, Self> {
  return {
    context: {
      statusQuo: '',
      grievance: '',
      thesis: '',
    },
    values: [],
    program: {
      items: [],
      severity: '',
    },
    execution: {
      promise: '',
      summons: null,
    },
  };
}

/**
 * Factory function to create a project with defaults
 */
export function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: '',
    title: '',
    image: '',
    description: '',
    tags: [],
    type: 'Experiment',
    status: 'Research',
    color: '#000000',
    ...overrides,
  };
}

/**
 * Factory function to create a research post with defaults
 */
export function createResearchPost(overrides: Partial<ResearchPost> = {}): ResearchPost {
  return {
    id: '',
    category: 'DEV LOG',
    date: new Date().toISOString(),
    title: '',
    excerpt: '',
    tags: [],
    readTime: '5 min',
    imageUrl: undefined,
    featured: false,
    ...overrides,
  };
}

/**
 * Factory function to create a timeline item with defaults
 */
export function createTimelineItem(overrides: Partial<TimelineItem> = {}): TimelineItem {
  return {
    version: '',
    year: new Date().getFullYear().toString(),
    description: '',
    isLatest: false,
    ...overrides,
  };
}

/**
 * Check if two projects are equal by their id
 */
export function projectsEqual(a: Project, b: Project): boolean {
  return a.id === b.id;
}

/**
 * Sort projects by status priority
 */
export function sortProjectsByStatus(projects: Project[]): Project[] {
  const statusOrder: Record<Project['status'], number> = {
    Active: 0,
    Research: 1,
    Archived: 2,
    Deprecated: 3,
  };

  return [...projects].sort((a, b) => {
    const aOrder = statusOrder[a.status] ?? 99;
    const bOrder = statusOrder[b.status] ?? 99;
    return aOrder - bOrder;
  });
}

/**
 * Filter research posts by category
 */
export function filterResearchByCategory(
  posts: ResearchPost[],
  category: ResearchPost['category']
): ResearchPost[] {
  return posts.filter(post => post.category === category);
}

/**
 * Find most recent research post
 */
export function getLatestResearchPost(posts: ResearchPost[]): ResearchPost | null {
  if (posts.length === 0) return null;
  return posts.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  });
}
