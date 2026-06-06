import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useResearchPosts } from '@shell/hooks/useResearchPosts';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';
import { MarkdownViewer } from '@shell/components/MarkdownViewer';
import { fetchResearchDoc } from '@shell/services/github-impl';

const Research: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { posts, loading } = useResearchPosts();
  const { config } = useSiteConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // Sync activePostId with URL parameter
  useEffect(() => {
    if (!loading && posts.length > 0) {
      if (id) {
        setActivePostId(id);
      } else {
        // Fallback to featured post or first post
        const featured = posts.find(p => p.featured);
        if (featured) {
          setActivePostId(featured.id);
        } else if (posts[0]) {
          setActivePostId(posts[0].id);
        }
      }
    }
  }, [id, posts, loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-gray-500 dark:text-zinc-500 uppercase tracking-widest">Opening knowledge database...</p>
        </div>
      </div>
    );
  }

  // Filter posts based on category and search query
  const filteredPosts = posts.filter(p => {
    if (activeTab !== 'All') {
      const categoryMap: Record<string, string> = {
        'Research': 'RESEARCH',
        'Dev Logs': 'DEV LOG',
        'Whitepapers': 'WHITEPAPER',
      };
      const targetCategory = categoryMap[activeTab];
      if (targetCategory && p.category !== targetCategory) {
        return false;
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

  const activePost = posts.find(p => p.id === activePostId);

  const handlePostSelect = (postId: string) => {
    setActivePostId(postId);
    navigate(`/research/${postId}`);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark cyber-grid transition-colors duration-300 flex flex-col">
      
      {/* Decorative background glows */}
      <div className="glow-spot w-[300px] h-[300px] bg-primary/10 top-24 left-10 dark:bg-primary/5" />
      <div className="glow-spot w-[300px] h-[300px] bg-accent/10 bottom-24 right-10 dark:bg-accent/5" />

      {/* Breadcrumbs & Header */}
      <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-12 pt-6 pb-4 relative z-10 text-left">
        <div className="flex flex-wrap gap-2 items-center mb-4 font-mono text-[10px] tracking-wider">
          <Link to="/" className="text-slate-500 hover:text-primary transition-colors">sspirial@systems</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 dark:text-white font-bold">knowledge_hub</span>
        </div>
        <div className="flex flex-col gap-2 border-b border-gray-200 dark:border-white/10 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {config.research.heading}
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 max-w-2xl font-body">
            {config.research.subtitle}
          </p>
        </div>
      </div>

      {/* Main split dashboard section */}
      <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 relative z-10 text-left">
        
        {/* Left column (4 cols): File Tree / Sidebar Directory */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Controls: Category tabs & Search bar */}
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/50 backdrop-blur shadow-sm">
            
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 dark:text-zinc-600 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Query documentation index..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-4 rounded border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-950/60 text-[11px] font-mono placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-gray-400 dark:text-zinc-500 hover:text-primary">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-100 dark:border-white/5 pb-1">
              {['All', 'Research', 'Dev Logs', 'Whitepapers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 text-[9px] font-mono rounded tracking-wider transition-all ${activeTab === tab
                    ? 'bg-primary/15 border border-primary/30 text-primary font-bold'
                    : 'text-gray-500 hover:text-primary border border-transparent'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

          </div>

          {/* Directory File Tree List */}
          <div className="flex-1 overflow-y-auto max-h-[500px] lg:max-h-[640px] pr-1 flex flex-col gap-2.5">
            {filteredPosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 p-6 text-center">
                <span className="material-symbols-outlined text-3xl text-gray-400 dark:text-zinc-600 mb-1">find_in_page</span>
                <p className="font-mono text-[10px] text-gray-500 dark:text-zinc-500">NO INDEX MATCHES FOUND</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostSelect(post.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden select-none text-left ${activePostId === post.id
                    ? 'border-primary bg-primary/[0.03] dark:bg-primary/[0.01] shadow-md shadow-primary/5'
                    : 'border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 hover:border-primary/30 hover:bg-white/60 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  {/* Selected Indicator Light */}
                  {activePostId === post.id && (
                    <div className="absolute top-0 left-0 w-[3px] h-full bg-primary" />
                  )}

                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      post.category === 'WHITEPAPER' ? 'bg-primary/10 text-primary' :
                      post.category === 'DEV LOG' ? 'bg-accent/10 text-accent dark:text-purple-400' :
                      'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {post.category}
                    </span>
                    <span className="font-mono text-[9px] text-gray-400 dark:text-zinc-500">{post.date}</span>
                  </div>

                  <h3 className={`text-sm font-bold leading-tight tracking-tight transition-colors ${activePostId === post.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                    {post.title}
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-normal line-clamp-2 font-body">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                    <span className="font-mono text-[9px] text-gray-400 dark:text-zinc-500">{post.readTime}</span>
                    <span className="material-symbols-outlined text-[16px] text-gray-300 dark:text-zinc-700 group-hover:text-primary">arrow_right</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </aside>

        {/* Right column (8 cols): Document Detail Panel */}
        <section className="lg:col-span-8">
          
          {activePost ? (
            <div className="rounded-xl border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/30 p-6 sm:p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden min-h-[500px]">
              
              {/* Document Header */}
              <header className="flex flex-col gap-4 border-b border-gray-200 dark:border-white/5 pb-6 text-left">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-mono font-bold text-primary uppercase tracking-wide">
                    {activePost.category}
                  </span>
                  <span className="font-mono text-[10px] text-gray-400 dark:text-zinc-500">{activePost.date}</span>
                  <span className="text-gray-400 select-none">·</span>
                  <span className="font-mono text-[10px] text-gray-400 dark:text-zinc-500">{activePost.readTime}</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{activePost.title}</h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 font-body leading-relaxed">{activePost.excerpt}</p>
                
                {activePost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {activePost.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-slate-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-850 px-2 py-0.5 rounded border border-gray-200 dark:border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Document Main Image */}
              {activePost.imageUrl && (
                <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-200 dark:border-white/5 relative bg-[#111318]">
                  <img src={activePost.imageUrl} alt={activePost.title} className="w-full h-full object-cover filter grayscale contrast-125 dark:opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Markdown Content */}
              {activePost.repositoryUrl ? (
                <article className="prose prose-invert max-w-none">
                  <MarkdownViewer
                    fetchMarkdown={() => fetchResearchDoc(activePost.repositoryUrl!)}
                    fileName="RESEARCH.md"
                    className="border-none bg-transparent p-0 rounded-none"
                  />
                </article>
              ) : (
                <div className="text-center py-16 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/5 p-6">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">description</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-mono">NO RESEARCH ATTACHMENTS FOR THIS NODE</p>
                </div>
              )}

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 p-16 text-center min-h-[500px] flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-zinc-600 mb-3 animate-pulse">terminal</span>
              <p className="font-mono text-xs text-gray-500 dark:text-zinc-500">AWAITING_NODE_SELECTION.sys</p>
              <p className="text-xs text-gray-400 dark:text-zinc-600 font-body max-w-xs mt-1">Select an active research node index from the left sidebar registry directory to mount documentation.</p>
            </div>
          )}

        </section>

      </div>
    </div>
  );
};

export default Research;
