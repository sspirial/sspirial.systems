import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResearchPosts } from '@shell/hooks/useResearchPosts';
import { MarkdownViewer } from '@shell/components/MarkdownViewer';
import { fetchResearchDoc } from '@shell/services/github-impl';
import { ResearchPost } from '@core/types';

const ResearchView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { posts, loading } = useResearchPosts();
  const [post, setPost] = useState<ResearchPost | null>(null);

  useEffect(() => {
    if (!loading && id) {
      const found = posts.find(p => p.id === id);
      setPost(found || null);
    }
  }, [id, posts, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading research...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          <button
            onClick={() => navigate('/research')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Research
          </button>
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">error</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Research Not Found</h1>
            <p className="text-slate-500 dark:text-slate-400">The research post you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <button
          onClick={() => navigate('/research')}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Research
        </button>

        {/* Research Header */}
        <article className="mb-8">
          {post.imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary font-mono uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{post.date}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">·</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{post.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{post.title}</h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">{post.excerpt}</p>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Research Content */}
        {post.repositoryUrl && (
          <article className="prose prose-invert max-w-none">
            <MarkdownViewer
              fetchMarkdown={() => fetchResearchDoc(post.repositoryUrl!)}
              fileName="RESEARCH.md"
            />
          </article>
        )}

        {!post.repositoryUrl && (
          <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-xl">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">description</span>
            <p className="text-slate-500 dark:text-slate-400">No additional documentation available for this research post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchView;
