/**
 * Result Type for standardized error handling
 * Use Result<T> instead of try/catch in Core functions
 */
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Helper to create a successful result
 */
export function Ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

/**
 * Helper to create an error result
 */
export function Err<E = string>(error: E): Result<never, E> {
  return { ok: false, error };
}

// 1. Define the specific types for your Microlab
export type Heuristic = "Build for $0" | "Local-First" | "No Meetings" | "Ship Daily";

export interface Self {
  energy: number;
  autonomy: boolean;
  commit: (action: string) => void;
}

export interface Manifesto<Heuristic, Self> {
  context: {
    statusQuo: string;
    grievance: string;
    thesis: string;
  };
  values: Array<{
    axiom: string;
    rejection: {
      reject: string;
      embrace: string;
    };
  }>;
  program: {
    items: Heuristic[];
    severity: string;
  };
  execution: {
    promise: string;
    summons?: ((subject: Self) => void) | null;
  };
}

export interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  type: 'Tool' | 'Experiment' | 'Prototype' | 'Architecture';
  status: 'Active' | 'Archived' | 'Deprecated' | 'Research';
  version?: string;
  color: string;
}

export interface ResearchPost {
  id: string;
  category: 'DEV LOG' | 'INSIGHT' | 'TUTORIAL' | 'WHITEPAPER';
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface TimelineItem {
  version: string;
  year: string;
  description: string;
  isLatest?: boolean;
}

export interface SiteConfig {
  // Version and status
  version: string;
  statusLabel: string; // e.g., "SYSTEMS OPERATIONAL"
  
  // Hero section (Home page)
  hero: {
    tagline: string;
    highlight: string; // The highlighted word in tagline
    description: string;
    imageUrl: string; // Hero background image
  };
  
  // Current focus (Home hero section)
  currentFocus: {
    label: string; // The focus area name
    availability: string; // e.g., "Open for Q4 Projects"
  };
  
  // Systems thinking marquee
  systemsMarquee: string[];
  
  // Featured focus areas (3-item section on Home)
  focusAreas: Array<{
    title: string;
    description: string;
  }>;
  
  // About page
  about: {
    heading: string;
    subtitle: string;
    imageUrl: string; // Hero image for About page
    corePhilosophy: string; // Section heading
    corePhilosophySubtitle: string;
    philosophyCards: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  
  // Projects page
  projects: {
    heading: string;
    subtitle: string;
  };
  
  // Research page
  research: {
    heading: string;
    subtitle: string;
  };
  
  // Footer
  footer: {
    bio: string;
    copyright: string;
    sections: {
      sitemap: Array<{ label: string; route: string }>;
      social: Array<{ label: string; url: string }>;
      legal: Array<{ label: string; url: string }>;
    };
  };
}
