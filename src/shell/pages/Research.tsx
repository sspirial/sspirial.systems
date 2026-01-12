import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResearchPosts } from '@shell/hooks/useResearchPosts';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';

const Research: React.FC = () => {
  const { posts, loading } = useResearchPosts();
  const { config } = useSiteConfig();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('All Posts');

  const featured = posts.find(p => p.featured);

  const others = posts.filter(p => {
    if (p.featured) return false;

    if (activeTab !== 'All Posts') {
      const normalizedTab = activeTab.toUpperCase().replace(/S$/, '');
      if (!p.category.includes(normalizedTab) && !p.category.includes(activeTab.toUpperCase())) {
        if (activeTab === 'Research' && p.category !== 'RESEARCH') return false;
        if (activeTab === 'Dev Logs' && p.category !== 'DEV LOG') return false;
        if (activeTab === 'Whitepapers' && p.category !== 'WHITEPAPER') return false;
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-8">
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <Link to="/" className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium leading-normal transition-colors">Home</Link>
        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Knowledge Hub</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">{config.research.heading}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-normal leading-relaxed">
            {config.research.subtitle}
          </p>
        </div>
      </div>

      {featured && !searchQuery && activeTab === 'All Posts' && (
        <section className="mb-16">
          <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row h-full">
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-between order-2 md:order-1">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary font-mono uppercase tracking-wide">
                      {featured.category}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">{featured.readTime}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {featured.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="mt-8">
                  <a className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all" href="#">
                    Read Full Report <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </a>
                </div>
              </div>
              <div className="md:w-2/5 h-64 md:h-auto order-1 md:order-2 relative bg-gray-100 dark:bg-gray-800">
                <img alt="Research thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" src={featured.imageUrl} />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white dark:from-surface-dark to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="sticky top-[72px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 md:-mx-10 md:px-10 border-b border-gray-200/50 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex overflow-x-auto pb-1 md:pb-0 no-scrollbar gap-6 md:gap-8 min-w-0 border-b md:border-b-0 border-gray-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('All Posts')}
              className={`whitespace-nowrap flex flex-col items-center justify-center border-b-2 pb-2 transition-colors ${activeTab === 'All Posts' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">All Posts</p>
            </button>
            {['Research', 'Dev Logs', 'Whitepapers'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap flex flex-col items-center justify-center border-b-2 pb-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent hover:border-gray-300 dark:hover:border-white/20 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab}</p>
              </button>
            ))}
          </div>
          <div className="w-full md:w-auto md:min-w-[320px]">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              </div>
              <input
                className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white dark:bg-surface-dark dark:ring-white/10 dark:text-white dark:placeholder:text-gray-500 transition-shadow shadow-sm"
                placeholder="Search documentation..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map((post) => (
          <article key={post.id} className="flex flex-col bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-none group h-full cursor-pointer" onClick={() => navigate(`/research/${post.id}`)}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{post.category}</span>
              <div className="flex items-center gap-2">
                {post.repositoryUrl && (
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-sm" title="Has linked repository">link</span>
                )}
                <span className="text-xs font-mono text-slate-400">{post.date}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
              {post.excerpt}
            </p>
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-semibold text-slate-400 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-xl">arrow_outward</span>
            </div>
          </article>
        ))}
        {others.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
            <p>No research found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Research;
