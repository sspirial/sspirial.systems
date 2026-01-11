/**
 * Shell: Validation Utilities
 * Wraps Core validators and adds Firestore-specific validation
 */

import {
  isValidEmail,
  isValidProject,
  isValidResearchPost,
  isValidTimelineItem,
} from '@core/utils/validators';
import type { Project, ResearchPost, TimelineItem, SiteConfig } from '@core/types';

/**
 * Validates and sanitizes a project from Firestore
 */
export function validateAndSanitizeProject(data: unknown): Project | null {
  if (!isValidProject(data)) {
    console.warn('Invalid project data:', data);
    return null;
  }
  return data as Project;
}

/**
 * Validates and sanitizes a research post from Firestore
 */
export function validateAndSanitizeResearchPost(data: unknown): ResearchPost | null {
  if (!isValidResearchPost(data)) {
    console.warn('Invalid research post data:', data);
    return null;
  }
  return data as ResearchPost;
}

/**
 * Validates and sanitizes a timeline item from Firestore
 */
export function validateAndSanitizeTimelineItem(data: unknown): TimelineItem | null {
  if (!isValidTimelineItem(data)) {
    console.warn('Invalid timeline item data:', data);
    return null;
  }
  return data as TimelineItem;
}

/**
 * Batch validates array of projects
 */
export function validateProjectArray(items: unknown[]): Project[] {
  if (!Array.isArray(items)) {
    console.warn('Expected array of projects, got:', items);
    return [];
  }
  return items
    .map(item => validateAndSanitizeProject(item))
    .filter((item): item is Project => item !== null);
}

/**
 * Batch validates array of research posts
 */
export function validateResearchPostArray(items: unknown[]): ResearchPost[] {
  if (!Array.isArray(items)) {
    console.warn('Expected array of research posts, got:', items);
    return [];
  }
  return items
    .map(item => validateAndSanitizeResearchPost(item))
    .filter((item): item is ResearchPost => item !== null);
}

/**
 * Batch validates array of timeline items
 */
export function validateTimelineItemArray(items: unknown[]): TimelineItem[] {
  if (!Array.isArray(items)) {
    console.warn('Expected array of timeline items, got:', items);
    return [];
  }
  return items
    .map(item => validateAndSanitizeTimelineItem(item))
    .filter((item): item is TimelineItem => item !== null);
}

/**
 * Reusable export validation - checks that all required fields are non-empty
 */
export function canExportData(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  // Check that core identifying fields are present and non-empty
  return (
    typeof obj.id === 'string' &&
    obj.id.trim().length > 0 &&
    typeof obj.title === 'string' &&
    obj.title.trim().length > 0
  );
}

// Re-export Core validators for convenience
export { isValidEmail, isValidProject, isValidResearchPost, isValidTimelineItem };
