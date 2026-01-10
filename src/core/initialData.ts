import { Project, ResearchPost, TimelineItem } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PROJ-01',
    title: 'Fintech Core',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW09bJPOhs-GKtJebSZq0ktnW_i4bN_V2M97ZbWGbquasQkdTC36ZUFoPE49HJZeKb9GJSepxuUYGYOjR97JQasdwP5_c5oes4-F-48BDl4rR8P6QC344hw-1T-E5jmbtjAKjVs_iMST6Bc_rgEiVJEJ_ci3qkAHR4JVnIbJB_do-M5ctM1shXQTBHZA-B6AcC0Yk6UWGNdXhYhts_8ME3Y7nkz9gBCuEur6fj2iRoHy8VjkfcJ-EDHf8K9vbzzgFRxz9CMRWK1HHq',
    description: 'A high-performance backend architecture for real-time transaction processing and fraud detection.',
    tags: ['Architecture', 'Rust'],
    type: 'Architecture',
    status: 'Active',
    version: 'v4.2.0',
    color: 'bg-primary'
  },
  {
    id: 'PROJ-02',
    title: 'Generative Art Engine',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOK8Mbq5sc1c64FZiUqseeHYqbrs-dy0vzXu4YX5KNphg4wUwRrOQRmWK8EvrF25QnpMVVBK0bF_YVI-0O-jMjuYVpQlfJgYcoooiiImOiYjuxjILTS801LAyqFVvnqzj_V9wvVXml61ru0p-DdvPGYOqgh1Bo2XgoIQZ-LAkxG40G3AxEO-eYKRxzGzFzp6AawB909noXSvv5lBneF3ouND9uBew79J99K5xxBIVgNhhj3R-407WhBbWrnr6nVwW_mCnB332p3IHZ',
    description: 'Experimental canvas rendering engine exploring chaotic attractors and noise fields.',
    tags: ['WebGL', 'Creative Coding'],
    type: 'Experiment',
    status: 'Active',
    color: 'bg-emerald-500'
  },
  {
    id: 'PROJ-03',
    title: 'Hyper-Index',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEoDq6bDIw__ta8VFsqxdIcLfwic6-b2IWxOLjbfi8aT3s221BE5OMKi9TDRvrQ4XOmwQXPddqgJTEiioT5vztuBOJuqsOAqulPYL2kCA4gh0WSPB16Lqmm_0RyG7cRKu8kieIp5vadjGAorcT-fWDgJPLc2fqFGceCq-mfAwcdNk-4KyDG-buKNuZ4sDvRQj1HBDX3yJjLTnLqABRSBoLF9QMFt6pUuqt-vSfu6BObOiC07psZzoAgDxFLpN5X8Uiaor5w4zGbU1O',
    description: 'A decentralized knowledge graph visualizer designed for navigating complex datasets.',
    tags: ['Rust', 'WASM'],
    type: 'Tool',
    status: 'Active',
    version: 'v2.4.1',
    color: 'bg-blue-600'
  },
  {
    id: 'PROJ-04',
    title: 'Neural-Synth',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3NFgQgCfbUFUtQtqbVqAPAnM8Rmn3DmAHixCZ6yDZWSfropc9oUCIAimaqkuJhgRtuA8HatCR3RzbnpIT-NP4ljRvVKdIB2FpYUj4jjzKaMsglSoYibqH273MuaXUkXk3lK8IXjMfcyIuwGtxPew3GF8Cfwxy3rKKRLId86wEGHXju69oVcjyEvaABiwlUrmZ13wbxa7jcvqSIlTKG5UfhE0tfCKWBFit-7BlMOqn-ujXWlS1Eops2YfoCuhH8oepuqw9SJrJOaV7',
    description: 'Generative audio experiment controlled by cursor movement and velocity.',
    tags: ['WebAudio', 'TF.js'],
    type: 'Experiment',
    status: 'Active',
    color: 'bg-indigo-500'
  },
  {
    id: 'PROJ-05',
    title: 'Grid-Lock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-f3BP47VjowjZ0KbmdyPYWQK1A__m-YwcVx6cA8ZSh4n1qskuTB1ibKJq0JclFRIznA2_3qGCUd3V3Lz-WovV0OEMHOuV-y9kHWx0PlDTiTSiLNj5mnsqfehFca4NpSpW6i9N0j_S6eakJE_K2ptL7p8eyEHw9m5yp8aAWQBRutwsgifg5y_a-6y4ZJM_GdXNcKvSk3eCkvPWejLqqr-w-8eNJ5WFPUspsUGFOgTBNmRP_lfMmSke3wHZEvJjnReUg8yuP5i2f9Ir',
    description: 'A distinct constraint solver running entirely in the browser canvas. Efficiently resolves layout conflicts.',
    tags: ['TypeScript', 'Canvas API'],
    type: 'Prototype',
    status: 'Archived',
    color: 'bg-slate-400'
  },
  {
    id: 'PROJ-06',
    title: 'Void-Walker',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAormRLUQ8xnPsJpCyIF7KoCDsYKkpQqpImB0deovIHNTM3NohS6kLFrU7oy6oIUls__Fj-L7b-Gf6KGbAvgkvtZ9U6B-sX5E1AOUSNBjkc2z5RzuTOdRWPSbTuiv0LGgXeKU6Ubv2APMurc53SD8uGYJPsL-sEPwl4ZycTio_X_13pPLDyWYcU9PvnYEOSNzosxQRfiH1Y-sE7xIzAVPeKUdxDNJk1EbKwcueMVLCIYTDPXPWmnRjGChciBdu5F6t3m-RpO9EgtRNq',
    description: 'Procedural terrain generation exploring the limits of non-euclidean geometry.',
    tags: ['Unity', 'C#'],
    type: 'Experiment',
    status: 'Active',
    color: 'bg-primary'
  }
];

export const INITIAL_RESEARCH_POSTS: ResearchPost[] = [
  {
    id: 'RES-01',
    category: 'WHITEPAPER',
    date: 'OCT 24, 2024',
    title: 'The Architecture of Silent Systems: Minimizing Cognitive Load',
    excerpt: 'Exploring how reducing visual noise in dashboard interfaces leads to faster decision-making cycles and predictive loading states.',
    tags: ['#Systems', '#UX'],
    readTime: '12 min read',
    featured: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADNYIutXzM4_qRVWobtPKfEBW_21L-WvBmbru5xM1VGc2KEfZvjouohz415KAN2kuh3m9ae6e71CHpDaiH3ly3dJvGVnPRqfx_de_3qvfi6KqfDK8W-sJiYBTQgoYmLCz4wkqWKHJ4aiMMuUFTRkAc3cE5dGpjSRfYNejz1IA42NQB7ej8UqJkVOLm_vVFnUjCTO0y1ffbRXSaeKUaHyOQaJEhEObFGMhNMAsiFmXNmeoU9X33bYco4VdROrqpRDaUuGlAKwP6Rg8Z'
  },
  {
    id: 'RES-02',
    category: 'DEV LOG',
    date: 'OCT 12, 2024',
    title: 'Optimizing Neural Networks on Edge Devices',
    excerpt: 'Techniques for quantization and pruning to fit transformer models onto low-power embedded systems without sacrificing accuracy.',
    tags: ['#ML', '#IoT'],
    readTime: '8 min read'
  },
  {
    id: 'RES-03',
    category: 'INSIGHT',
    date: 'SEP 28, 2024',
    title: 'Migrating Legacy Codebases: A Strategic Case Study',
    excerpt: 'How we successfully refactored a 10-year-old monolith into microservices while maintaining 99.9% uptime.',
    tags: ['#Engineering', '#Refactor'],
    readTime: '15 min read'
  },
  {
    id: 'RES-04',
    category: 'TUTORIAL',
    date: 'SEP 15, 2024',
    title: 'Setting up a Local LLM Playground with LangChain',
    excerpt: 'A step-by-step guide to creating your own private AI experimentation lab using open-source models.',
    tags: ['#AI', '#Tutorial'],
    readTime: '10 min read'
  }
];

export const INITIAL_TIMELINE: TimelineItem[] = [
  { version: 'v1.0 - Inception', year: '2020', description: 'Founding of the studio as a solo consultancy focused on bridging design and engineering.' },
  { version: 'v1.5 - Infrastructure', year: '2021', description: 'Expansion into cloud-native architectures and distributed systems research.' },
  { version: 'v2.0 - Studio Evolution', year: '2022', description: 'Rebranded as sspirial.systems with a focus on experimental R&D and open tools.' },
  { version: 'v2.1 - Current State', year: '2023-Present', description: 'Scaling the organism. Active research in WebGPU and autonomous agent networks.', isLatest: true }
];
