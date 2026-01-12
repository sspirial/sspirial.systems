/**
 * MarkdownViewer Component
 * Full-featured markdown renderer with LaTeX, Mermaid, and syntax highlighting
 */

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Result } from '@core/types';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownViewerProps {
  /** 
   * Async function that returns a Result with markdown content
   */
  fetchMarkdown: () => Promise<Result<string>>;
  
  /**
   * File name for display (e.g., "README.md")
   */
  fileName?: string;
  
  /**
   * Custom class for the container
   */
  className?: string;
  
  /**
   * Whether to show a loading spinner
   */
  showLoading?: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  fetchMarkdown,
  fileName = 'Markdown',
  className = '',
  showLoading = true
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setContent(null);

      const result = await fetchMarkdown();
      if (result.ok) {
        setContent(result.value);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    load();
  }, [fetchMarkdown]);

  if (loading && showLoading) {
    return (
      <div className={`rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 text-center ${className}`}>
        <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm">Loading {fileName}...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-6 ${className}`}>
        <p className="text-sm text-red-700 dark:text-red-300">
          <span className="font-semibold">Failed to load {fileName}:</span> {error}
        </p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={`rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 ${className}`}>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No content available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 overflow-auto markdown-content ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex, [rehypeHighlight, { detect: true }]]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-5 mb-2 text-slate-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold mt-4 mb-2 text-slate-800 dark:text-slate-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold mt-3 mb-1 text-slate-800 dark:text-slate-100">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-bold mt-2 text-slate-800 dark:text-slate-100">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-slate-700 dark:text-slate-300 my-3 leading-relaxed">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {children}
            </a>
          ),
          code: ({ node, inline, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  {children}
                </code>
              );
            }
            return (
              <code className="text-slate-100 font-mono" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-slate-950 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto my-4 text-sm border border-slate-800">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 italic text-slate-600 dark:text-slate-400 my-4 py-2">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 my-3 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 my-3 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-700 dark:text-slate-300">
              {children}
            </li>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-700 dark:text-slate-300">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-6 border-0 border-t border-slate-300 dark:border-slate-600" />
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg my-4 border border-slate-200 dark:border-slate-700"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
