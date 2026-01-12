import { useState, useEffect } from 'react';
import { SiteConfig } from '@core/types';
import { useDatabase } from '@shell/contexts/ServicesContext';

const defaultSiteConfig: SiteConfig = {
  version: 'v2.1.0',
  statusLabel: 'SYSTEMS OPERATIONAL',
  hero: {
    tagline: 'Engineering the Future of Digital Systems.',
    highlight: 'Future',
    description:
      'sspirial.systems is an independent micro-studio dedicated to experimental software, complex architecture, and building tools for the next web.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWjMVHcjg3jt4TcSYvj1nrMYPF4q7DAsLAZHGivufohQAklbA830x3wWEfVkcWpfblAP6hBItoLdvRh9bXZ1twCceSkw78dN0A3Q4On5Hu99JLvQoSgeWMLCpR8baX8nOcQxZ2ps70NszbkC57NxGIPpRvoI-MW_UgTGGRUVOIzrVxduOyA8TnrxS-T-kaEBbvLFC07S_ykJ7Nlb-UUCgGDvQOqvHMxzn9L3arECd-dyGRRtbC-dgHIjkeHl8lO9bMPDEebUVZ0ZHT',
  },
  currentFocus: {
    label: 'Autonomous Agents',
    availability: 'Open for Q4 Projects',
  },
  systemsMarquee: [
    '/// Systems Thinking',
    '/// Self-Mastery',
    '/// Perception',
    '/// Inquiry',
    '/// Resilience',
    '/// Innovation',
    '/// Architecture',
    '/// Legacy',
  ],
  focusAreas: [
    {
      title: 'Local-first software',
      description:
        'Building tools that work offline by default, sync when possible, and respect that connectivity is a luxury, not a given.',
    },
    {
      title: 'Tiny tools',
      description:
        'Software that does one thing exceptionally well. Small enough to understand. Focused enough to trust.',
    },
    {
      title: 'Open experiments',
      description:
        'Sharing our process—the sketches, the failures, the half-finished ideas—because invention is messy and that is beautiful.',
    },
  ],
  about: {
    heading: 'We are sspirial.systems. An Independent R&D Organism.',
    subtitle:
      'Exploring the intersection of design, code, and systems thinking through radical curiosity. We operate outside traditional models to foster pure innovation.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOBDPUvWdNoYaF64ArO3xoaP7S4_3LFi4r-fzIB6Xq-4qYhh0CAvKVTRIOVAIIhqhG_BhUCJMMI5ZTNmXKMVOwztpaw4c9Tyi7wJ0P0lcoaECVxJ1ElYq3ZuhelpnXKPndedG8kH99u2R5dGhSuXS5_c8tl28KoKPNDe6-BrMk6bO2hoqIMSMKXbP2nHB2OLtKuOiTLC7e9mkdzMrf6GGfeBWbYjgoDFFAY5ADSSrViuCNCpbyj-g_Ofdb6TynuGk4EGUBuKiEBUOU',
    corePhilosophy: 'Core Philosophy',
    corePhilosophySubtitle:
      'Operating as a micro-studio to maintain agility, purity of research, and direct connection to the code.',
    philosophyCards: [
      {
        icon: 'lightbulb',
        title: 'Radical Curiosity',
        description:
          'Questioning the default state. We investigate the "why" before the "how".',
      },
      {
        icon: 'code',
        title: 'Open Source',
        description:
          'Sharing knowledge to accelerate growth. Our findings are public goods.',
      },
      {
        icon: 'hub',
        title: 'Systemic Design',
        description:
          'Viewing every project as a connected part of a whole. Nothing exists in isolation.',
      },
    ],
  },
  projects: {
    heading: 'Exploring the fringes of computing.',
    subtitle:
      'An index of experiments, tools, and prototypes by sspirial.systems. Functioning as a digital lab notebook.',
  },
  research: {
    heading: 'Knowledge Hub',
    subtitle:
      'Research findings, technical documentation, and field notes from the lab. Exploring the intersection of systems, intelligence, and design.',
  },
  footer: {
    bio: 'Independent R&D micro-studio. Building tomorrow\'s digital infrastructure.',
    copyright: '© 2026 sspirial.systems. All rights reserved.',
    sections: {
      sitemap: [
        { label: 'Work Index', route: '/projects' },
        { label: 'Studio Philosophy', route: '/about' },
        { label: 'Experimental Lab', route: '/research' },
        { label: 'Journal', route: '/research' },
      ],
      social: [
        { label: 'GitHub', url: '#' },
        { label: 'Twitter / X', url: '#' },
        { label: 'LinkedIn', url: '#' },
      ],
      legal: [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' },
        { label: 'System Status: Operational', url: '#' },
      ],
    },
  },
};

function normalizeSiteConfig(data?: any): SiteConfig {
  if (!data) return defaultSiteConfig;

  return {
    version: data.version || defaultSiteConfig.version,
    statusLabel: data.statusLabel || defaultSiteConfig.statusLabel,
    hero: {
      tagline: data.hero?.tagline || defaultSiteConfig.hero.tagline,
      highlight: data.hero?.highlight || defaultSiteConfig.hero.highlight,
      description: data.hero?.description || defaultSiteConfig.hero.description,
      imageUrl: data.hero?.imageUrl || defaultSiteConfig.hero.imageUrl,
    },
    currentFocus: {
      label: data.currentFocus?.label || defaultSiteConfig.currentFocus.label,
      availability:
        data.currentFocus?.availability ||
        defaultSiteConfig.currentFocus.availability,
    },
    systemsMarquee:
      data.systemsMarquee || defaultSiteConfig.systemsMarquee,
    focusAreas: data.focusAreas || defaultSiteConfig.focusAreas,
    about: {
      heading: data.about?.heading || defaultSiteConfig.about.heading,
      imageUrl: data.about?.imageUrl || defaultSiteConfig.about.imageUrl,
      subtitle: data.about?.subtitle || defaultSiteConfig.about.subtitle,
      corePhilosophy:
        data.about?.corePhilosophy ||
        defaultSiteConfig.about.corePhilosophy,
      corePhilosophySubtitle:
        data.about?.corePhilosophySubtitle ||
        defaultSiteConfig.about.corePhilosophySubtitle,
      philosophyCards:
        data.about?.philosophyCards ||
        defaultSiteConfig.about.philosophyCards,
    },
    projects: {
      heading: data.projects?.heading || defaultSiteConfig.projects.heading,
      subtitle:
        data.projects?.subtitle || defaultSiteConfig.projects.subtitle,
    },
    research: {
      heading: data.research?.heading || defaultSiteConfig.research.heading,
      subtitle:
        data.research?.subtitle || defaultSiteConfig.research.subtitle,
    },
    footer: {
      bio: data.footer?.bio || defaultSiteConfig.footer.bio,
      copyright: data.footer?.copyright || defaultSiteConfig.footer.copyright,
      sections: {
        sitemap:
          data.footer?.sections?.sitemap ||
          defaultSiteConfig.footer.sections.sitemap,
        social:
          data.footer?.sections?.social ||
          defaultSiteConfig.footer.sections.social,
        legal:
          data.footer?.sections?.legal ||
          defaultSiteConfig.footer.sections.legal,
      },
    },
  };
}

export function useSiteConfig() {
  const database = useDatabase();
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Use real-time listener for automatic updates
    const unsubscribe = database.onDocumentChange<SiteConfig>(
      'config',
      'site',
      (data) => {
        if (data) {
          setConfig(normalizeSiteConfig(data));
        } else {
          setConfig(defaultSiteConfig);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [database]);

  return { config, loading };
}
