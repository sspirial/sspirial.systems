
import React from 'react';
import { Project, ResearchPost, TimelineItem } from './types';

// Initial data for seeding and fallback
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PROJ-01',
    title: "Fintech Core",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW09bJPOhs-GKtJebSZq0ktnW_i4bN_V2M97ZbWGbquasQkdTC36ZUFoPE49HJZeKb9GJSepxuUYGYOjR97JQasdwP5_c5oes4-F-48BDl4rR8P6QC344hw-1T-E5jmbtjAKjVs_iMST6Bc_rgEiVJEJ_ci3qkAHR4JVnIbJB_do-M5ctM1shXQTBHZA-B6AcC0Yk6UWGNdXhYhts_8ME3Y7nkz9gBCuEur6fj2iRoHy8VjkfcJ-EDHf8K9vbzzgFRxz9CMRWK1HHq",
    description: "A high-performance backend architecture for real-time transaction processing and fraud detection.",
    tags: ["Architecture", "Rust"],
    type: "Architecture",
    status: "Active",
    version: "v4.2.0",
    color: "bg-primary"
  },
  {
    id: 'PROJ-02',
    title: "Generative Art Engine",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOK8Mbq5sc1c64FZiUqseeHYqbrs-dy0vzXu4YX5KNphg4wUwRrOQRmWK8EvrF25QnpMVVBK0bF_YVI-0O-jMjuYVpQlfJgYcoooiiImOiYjuxjILTS801LAyqFVvnqzj_V9wvVXml61ru0p-DdvPGYOqgh1Bo2XgoIQZ-LAkxG40G3AxEO-eYKRxzGzFzp6AawB909noXSvv5lBneF3ouND9uBew79J99K5xxBIVgNhhj3R-407WhBbWrnr6nVwW_mCnB332p3IHZ",
    description: "Experimental canvas rendering engine exploring chaotic attractors and noise fields.",
    tags: ["WebGL", "Creative Coding"],
    type: "Experiment",
    status: "Active",
    color: "bg-emerald-500"
  },
  {
    id: 'PROJ-03',
    title: "Hyper-Index",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEoDq6bDIw__ta8VFsqxdIcLfwic6-b2IWxOLjbfi8aT3s221BE5OMKi9TDRvrQ4XOmwQXPddqgJTEiioT5vztuBOJuqsOAqulPYL2kCA4gh0WSPB16Lqmm_0RyG7cRKu8kieIp5vadjGAorcT-fWDgJPLc2fqFGceCq-mfAwcdNk-4KyDG-buKNuZ4sDvRQj1HBDX3yJjLTnLqABRSBoLF9QMFt6pUuqt-vSfu6BObOiC07psZzoAgDxFLpN5X8Uiaor5w4zGbU1O",
    description: "A decentralized knowledge graph visualizer designed for navigating complex datasets.",
    tags: ["Rust", "WASM"],
    type: "Tool",
    status: "Active",
    version: "v2.4.1",
    color: "bg-blue-600"
  },
  {
    id: 'PROJ-04',
    title: "Neural-Synth",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3NFgQgCfbUFUtQtqbVqAPAnM8Rmn3DmAHixCZ6yDZWSfropc9oUCIAimaqkuJhgRtuA8HatCR3RzbnpIT-NP4ljRvVKdIB2FpYUj4jjzKaMsglSoYibqH273MuaXUkXk3lK8IXjMfcyIuwGtxPew3GF8Cfwxy3rKKRLId86wEGHXju69oVcjyEvaABiwlUrmZ13wbxa7jcvqSIlTKG5UfhE0tfCKWBFit-7BlMOqn-ujXWlS1Eops2YfoCuhH8oepuqw9SJrJOaV7",
    description: "Generative audio experiment controlled by cursor movement and velocity.",
    tags: ["WebAudio", "TF.js"],
    type: "Experiment",
    status: "Active",
    color: "bg-indigo-500"
  },
  {
    id: 'PROJ-05',
    title: "Grid-Lock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-f3BP47VjowjZ0KbmdyPYWQK1A__m-YwcVx6cA8ZSh4n1qskuTB1ibKJq0JclFRIznA2_3qGCUd3V3Lz-WovV0OEMHOuV-y9kHWx0PlDTiTSiLNj5mnsqfehFca4NpSpW6i9N0j_S6eakJE_K2ptL7p8eyEHw9m5yp8aAWQBRutwsgifg5y_a-6y4ZJM_GdXNcKvSk3eCkvPWejLqqr-w-8eNJ5WFPUspsUGFOgTBNmRP_lfMmSke3wHZEvJjnReUg8yuP5i2f9Ir",
    description: "A distinct constraint solver running entirely in the browser canvas. Efficiently resolves layout conflicts.",
    tags: ["TypeScript", "Canvas API"],
    type: "Prototype",
    status: "Archived",
    color: "bg-slate-400"
  },
  {
    id: 'PROJ-06',
    title: "Void-Walker",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAormRLUQ8xnPsJpCyIF7KoCDsYKkpQqpImB0deovIHNTM3NohS6kLFrU7oy6oIUls__Fj-L7b-Gf6KGbAvgkvtZ9U6B-sX5E1AOUSNBjkc2z5RzuTOdRWPSbTuiv0LGgXeKU6Ubv2APMurc53SD8uGYJPsL-sEPwl4ZycTio_X_13pPLDyWYcU9PvnYEOSNzosxQRfiH1Y-sE7xIzAVPeKUdxDNJk1EbKwcueMVLCIYTDPXPWmnRjGChciBdu5F6t3m-RpO9EgtRNq",
    description: "Procedural terrain generation exploring the limits of non-euclidean geometry.",
    tags: ["Unity", "C#"],
    type: "Experiment",
    status: "Active",
    color: "bg-primary"
  }
];

export const INITIAL_RESEARCH_POSTS: ResearchPost[] = [
  {
    id: 'RES-01',
    category: 'WHITEPAPER',
    date: 'OCT 24, 2024',
    title: "The Architecture of Silent Systems: Minimizing Cognitive Load",
    excerpt: "Exploring how reducing visual noise in dashboard interfaces leads to faster decision-making cycles and predictive loading states.",
    tags: ["#Systems", "#UX"],
    readTime: "12 min read",
    featured: true,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuADNYIutXzM4_qRVWobtPKfEBW_21L-WvBmbru5xM1VGc2KEfZvjouohz415KAN2kuh3m9ae6e71CHpDaiH3ly3dJvGVnPRqfx_de_3qvfi6KqfDK8W-sJiYBTQgoYmLCz4wkqWKHJ4aiMMuUFTRkAc3cE5dGpjSRfYNejz1IA42NQB7ej8UqJkVOLm_vVFnUjCTO0y1ffbRXSaeKUaHyOQaJEhEObFGMhNMAsiFmXNmeoU9X33bYco4VdROrqpRDaUuGlAKwP6Rg8Z"
  },
  {
    id: 'RES-02',
    category: 'DEV LOG',
    date: 'OCT 12, 2024',
    title: "Optimizing Neural Networks on Edge Devices",
    excerpt: "Techniques for quantization and pruning to fit transformer models onto low-power embedded systems without sacrificing accuracy.",
    tags: ["#ML", "#IoT"],
    readTime: "8 min read"
  },
  {
    id: 'RES-03',
    category: 'INSIGHT',
    date: 'SEP 28, 2024',
    title: "Migrating Legacy Codebases: A Strategic Case Study",
    excerpt: "How we successfully refactored a 10-year-old monolith into microservices while maintaining 99.9% uptime.",
    tags: ["#Engineering", "#Refactor"],
    readTime: "15 min read"
  },
  {
    id: 'RES-04',
    category: 'TUTORIAL',
    date: 'SEP 15, 2024',
    title: "Setting up a Local LLM Playground with LangChain",
    excerpt: "A step-by-step guide to creating your own private AI experimentation lab using open-source models.",
    tags: ["#AI", "#Tutorial"],
    readTime: "10 min read"
  }
];

export const INITIAL_TIMELINE: TimelineItem[] = [
  { version: "v1.0 - Inception", year: "2020", description: "Founding of the studio as a solo consultancy focused on bridging design and engineering." },
  { version: "v1.5 - Infrastructure", year: "2021", description: "Expansion into cloud-native architectures and distributed systems research." },
  { version: "v2.0 - Studio Evolution", year: "2022", description: "Rebranded as sspirial.systems with a focus on experimental R&D and open tools." },
  { version: "v2.1 - Current State", year: "2023-Present", description: "Scaling the organism. Active research in WebGPU and autonomous agent networks.", isLatest: true }
];

export const LogoIcon = ({ className = "size-6" }: { className?: string }) => (
  <div className={`${className} text-primary`}>
    <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
      <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"></path>
    </svg>
  </div>
);
