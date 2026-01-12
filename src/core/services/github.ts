/**
 * GitHub Service - Pure Logic for GitHub interactions
 * No I/O, no frameworks - just parsing and validation
 */

import { Result, Ok, Err } from '../types';

/**
 * Represents parsed GitHub repository info
 */
export interface GitHubRepo {
  owner: string;
  repo: string;
  url: string;
}

/**
 * Parse a GitHub repository URL into its components
 * Supports:
 *  - https://github.com/owner/repo
 *  - https://github.com/owner/repo.git
 *  - owner/repo
 */
export function parseGitHubUrl(url: string): Result<GitHubRepo> {
  if (!url || typeof url !== 'string') {
    return Err('Invalid GitHub URL: must be a non-empty string');
  }

  const trimmed = url.trim();

  // Handle "owner/repo" format
  if (!trimmed.includes('http')) {
    const parts = trimmed.split('/');
    if (parts.length === 2) {
      const [owner, repo] = parts;
      if (owner && repo) {
        return Ok({
          owner: owner.trim(),
          repo: repo.replace('.git', '').trim(),
          url: `https://github.com/${owner}/${repo}`
        });
      }
    }
  }

  // Handle full URL
  const githubUrlRegex = /https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/;
  const match = trimmed.match(githubUrlRegex);

  if (!match) {
    return Err(
      'Invalid GitHub URL. Expected format: https://github.com/owner/repo or owner/repo'
    );
  }

  const [, , owner, repo] = match;
  return Ok({
    owner: owner.trim(),
    repo: repo.trim(),
    url: `https://github.com/${owner}/${repo}`
  });
}

/**
 * Construct a raw GitHub file URL
 */
export function buildRawFileUrl(repo: GitHubRepo, filePath: string, branch: string = 'main'): string {
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${filePath}`;
}

/**
 * Validate if a file path looks like a markdown file
 */
export function isMarkdownFile(filePath: string): boolean {
  return /\.md$/i.test(filePath);
}

/**
 * Common markdown files to look for in a repo
 */
export const DEFAULT_MARKDOWN_FILES = {
  README: 'README.md',
  RESEARCH: 'RESEARCH.md'
} as const;
