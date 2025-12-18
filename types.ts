
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
