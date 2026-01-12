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
      role="article"
      aria-label={fileName}
    >
      {/* Helper functions for media detection */}
      {(() => {
        const isYouTubeUrl = (url?: string) =>
          !!url && (/youtu\.be\//.test(url) || /youtube\.com\/watch\?v=/.test(url) || /youtube\.com\/shorts\//.test(url));
        const getYouTubeEmbed = (url?: string) => {
          if (!url) return null;
          const idMatch =
            url.match(/youtu\.be\/([\w-]+)/) ||
            url.match(/v=([\w-]+)/) ||
            url.match(/shorts\/([\w-]+)/);
          const id = idMatch?.[1];
          return id ? `https://www.youtube.com/embed/${id}` : null;
        };
        const isVimeoUrl = (url?: string) => !!url && /vimeo\.com\/(\d+)/.test(url);
        const getVimeoEmbed = (url?: string) => {
          if (!url) return null;
          const m = url.match(/vimeo\.com\/(\d+)/);
          return m ? `https://player.vimeo.com/video/${m[1]}` : null;
        };
        const isAudioUrl = (url?: string) => !!url && /\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(url);
        const isVideoUrl = (url?: string) => !!url && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

        // Expose on window for components closure without redefinition per render
        (globalThis as any).__md_isYouTubeUrl = isYouTubeUrl;
        (globalThis as any).__md_getYouTubeEmbed = getYouTubeEmbed;
        (globalThis as any).__md_isVimeoUrl = isVimeoUrl;
        (globalThis as any).__md_getVimeoEmbed = getVimeoEmbed;
        (globalThis as any).__md_isAudioUrl = isAudioUrl;
        (globalThis as any).__md_isVideoUrl = isVideoUrl;
        return null;
      })()}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex, [rehypeHighlight, { detect: true }]]}
        components={{
          iframe: ({ src, title, allow, allowFullScreen }) => {
            const safeSrc = typeof src === 'string' ? src : undefined;
            return (
              <div className="my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                <div className="w-full aspect-video">
                  <iframe
                    src={safeSrc}
                    title={title || 'Embedded media'}
                    className="w-full h-full"
                    allow={typeof allow === 'string' ? allow : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'}
                    allowFullScreen={!!allowFullScreen || true}
                  />
                </div>
              </div>
            );
          },
          video: ({ src, children, controls }) => {
            const safeSrc = typeof src === 'string' ? src : undefined;
            return (
              <div className="my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                <video src={safeSrc} className="w-full" controls={controls ?? true}>
                  {children}
                </video>
              </div>
            );
          },
          audio: ({ src, children, controls }) => {
            const safeSrc = typeof src === 'string' ? src : undefined;
            return (
              <div className="my-4 rounded-lg border border-slate-200 dark:border-white/10 p-3 bg-white/60 dark:bg-white/5">
                <audio src={safeSrc} className="w-full" controls={controls ?? true}>
                  {children}
                </audio>
              </div>
            );
          },
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
          a: ({ href, children }) => {
            const url = typeof href === 'string' ? href : undefined;
            const childText = Array.isArray(children) ? children.map((c: any) => (typeof c === 'string' ? c : '')).join('').trim() : '';

            const yt = (globalThis as any).__md_isYouTubeUrl?.(url) ? (globalThis as any).__md_getYouTubeEmbed?.(url) : null;
            const vm = (globalThis as any).__md_isVimeoUrl?.(url) ? (globalThis as any).__md_getVimeoEmbed?.(url) : null;

            // Auto-embed when the link text is the URL itself
            if (url && childText === url) {
              if (yt) {
                return (
                  <div className="my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                    <div className="w-full aspect-video">
                      <iframe
                        src={yt}
                        title="YouTube video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                );
              }
              if (vm) {
                return (
                  <div className="my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                    <div className="w-full aspect-video">
                      <iframe
                        src={vm}
                        title="Vimeo video"
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                );
              }
              if ((globalThis as any).__md_isVideoUrl?.(url)) {
                return (
                  <div className="my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                    <video src={url} className="w-full" controls />
                  </div>
                );
              }
              if ((globalThis as any).__md_isAudioUrl?.(url)) {
                return (
                  <div className="my-4 rounded-lg border border-slate-200 dark:border-white/10 p-3 bg-white/60 dark:bg-white/5">
                    <audio src={url} className="w-full" controls />
                  </div>
                );
              }
            }

            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
                aria-label={typeof children === 'string' ? children : undefined}
              >
                {children}
              </a>
            );
          },
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
