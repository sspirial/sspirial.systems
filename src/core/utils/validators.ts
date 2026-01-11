/**
 * Pure validation utilities
 * No side effects, no external dependencies
 */

/**
 * Validates email format using RFC 5322 simplified pattern
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates project object structure
 */
export function isValidProject(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  const p = obj as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.title === 'string' &&
    typeof p.description === 'string' &&
    Array.isArray(p.tags) &&
    ['Tool', 'Experiment', 'Prototype', 'Architecture'].includes(p.type as string) &&
    ['Active', 'Archived', 'Deprecated', 'Research'].includes(p.status as string)
  );
}

/**
 * Validates research post object structure
 */
export function isValidResearchPost(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  const p = obj as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    ['DEV LOG', 'INSIGHT', 'TUTORIAL', 'WHITEPAPER'].includes(p.category as string) &&
    typeof p.date === 'string' &&
    typeof p.title === 'string' &&
    typeof p.excerpt === 'string' &&
    Array.isArray(p.tags)
  );
}

/**
 * Validates timeline item object structure
 */
export function isValidTimelineItem(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  const t = obj as Record<string, unknown>;
  return (
    typeof t.version === 'string' &&
    typeof t.year === 'string' &&
    typeof t.description === 'string'
  );
}
