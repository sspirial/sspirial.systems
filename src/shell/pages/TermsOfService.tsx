import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '@shell/hooks/useSiteConfig';
import { MarkdownViewer } from '@shell/components/MarkdownViewer';
import { Ok } from '@core/types';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useSiteConfig();

  const fetchContent = async () => {
    return Ok(config.legal.termsOfService);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </button>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
          
          <MarkdownViewer
            fetchMarkdown={fetchContent}
            fileName="terms-of-service"
          />
        </article>
      </div>
    </div>
  );
};

export default TermsOfService;
