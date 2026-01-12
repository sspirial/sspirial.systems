/**
 * GitHub API Implementation - Side Effects
 * Handles actual HTTP calls to fetch markdown files from GitHub
 */

import { Result, Ok, Err } from '@core/types';
import { parseGitHubUrl, buildRawFileUrl } from '@core/services/github';

export interface FetchMarkdownOptions {
  branch?: string;
  timeout?: number;
}

/**
 * Fetch a markdown file from a GitHub repository
 * Uses raw GitHub URL to fetch plain text content
 */
export async function fetchMarkdownFromGitHub(
  repoUrl: string,
  filePath: string,
  options: FetchMarkdownOptions = {}
): Promise<Result<string>> {
  const { branch = 'main', timeout = 5000 } = options;

  try {
    // Parse the repo URL first (using Core logic)
    const parseResult = parseGitHubUrl(repoUrl);
    if (!parseResult.ok) {
      return parseResult as Result<never>;
    }

    const repo = parseResult.value;
    const rawUrl = buildRawFileUrl(repo, filePath, branch);

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(rawUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain, text/markdown',
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return Err(
        `Failed to fetch ${filePath} from ${repo.owner}/${repo.repo}. Status: ${response.status}`
      );
    }

    const content = await response.text();
    return Ok(content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return Err(`Request timeout while fetching markdown file`);
      }
      return Err(`Failed to fetch markdown: ${error.message}`);
    }
    return Err('Unknown error fetching markdown file');
  }
}

/**
 * Fetch README.md from a repository
 */
export async function fetchReadme(
  repoUrl: string,
  options?: FetchMarkdownOptions
): Promise<Result<string>> {
  return fetchMarkdownFromGitHub(repoUrl, 'README.md', options);
}

/**
 * Fetch RESEARCH.md from a repository
 */
export async function fetchResearchDoc(
  repoUrl: string,
  options?: FetchMarkdownOptions
): Promise<Result<string>> {
  return fetchMarkdownFromGitHub(repoUrl, 'RESEARCH.md', options);
}

/**
 * Try fetching a file with fallback branches
 */
export async function fetchMarkdownWithFallback(
  repoUrl: string,
  filePath: string,
  branches: string[] = ['main', 'master']
): Promise<Result<string>> {
  for (const branch of branches) {
    const result = await fetchMarkdownFromGitHub(repoUrl, filePath, { branch });
    if (result.ok) {
      return result;
    }
  }

  return Err(
    `Could not find ${filePath} in any branch (tried: ${branches.join(', ')})`
  );
}
