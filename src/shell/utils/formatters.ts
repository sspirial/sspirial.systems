/**
 * Shell: Formatting Utilities
 * Wraps Core formatters for use in React components
 */

import {
  formatDate,
  formatRelativeTime,
  truncateString,
  slugify,
  capitalize,
} from '@core/utils/formatters';

// Re-export all Core formatters for direct use in components
export {
  formatDate,
  formatRelativeTime,
  truncateString,
  slugify,
  capitalize,
};

/**
 * Format project title for display (capitalize + truncate for cards)
 */
export function formatProjectTitle(title: string, maxLength: number = 50): string {
  const capped = capitalize(title);
  return truncateString(capped, maxLength);
}

/**
 * Format research post title for display
 */
export function formatResearchTitle(title: string, maxLength: number = 60): string {
  return truncateString(title, maxLength);
}

/**
 * Format research post excerpt for card display
 */
export function formatExcerpt(excerpt: string, maxLength: number = 150): string {
  return truncateString(excerpt, maxLength);
}

/**
 * Format tag for display (lowercase slug + capitalize first letter)
 */
export function formatTag(tag: string): string {
  const slug = slugify(tag);
  return capitalize(slug);
}

/**
 * Create a readable label from camelCase or snake_case
 */
export function formatLabel(text: string): string {
  const withSpaces = text
    .replace(/([A-Z])/g, ' $1') // camelCase
    .replace(/_/g, ' ') // snake_case
    .trim();
  return capitalize(withSpaces);
}

/**
 * Format status badge text
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    Active: 'Active',
    Archived: 'Archived',
    Deprecated: 'Deprecated',
    Research: 'Research',
  };
  return statusMap[status] || capitalize(status);
}
