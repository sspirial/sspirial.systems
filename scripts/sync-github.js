import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
}

// Convert a string to a deterministic UUID
function toUuid(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str.toLowerCase();
  }

  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 << 5) - hash1 + char;
    hash1 |= 0;
    hash2 = (hash2 << 7) - hash2 + char;
    hash2 |= 0;
  }

  const hex1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const hex2 = Math.abs(hash2).toString(16).padStart(8, '0');
  const base = (hex1 + hex2 + hex1 + hex2).slice(0, 32);

  return [
    base.slice(0, 8),
    base.slice(8, 12),
    base.slice(12, 16),
    base.slice(16, 20),
    base.slice(20, 32)
  ].join('-');
}

// Parse markdown frontmatter
function parseMarkdown(content) {
  if (!content) return { metadata: {}, body: '' };
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  
  let metadata = {};
  let body = '';
  
  if (match) {
    const yaml = match[1];
    body = match[2].trim();
    
    yaml.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join(':').trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        } else if (value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value.replace(/'/g, '"'));
          } catch (e) {
            value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          }
        } else if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }
        metadata[key] = value;
      }
    });
  } else {
    body = content.trim();
  }
  
  return { metadata, body };
}

// Helper to make GitHub API requests
async function fetchGithub(url, token) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'sspirial-sync-agent'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const res = await fetch(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API Error (${res.status}): ${text}`);
  }
  return res;
}

// Fetch raw file from GitHub repository
async function fetchRawFile(owner, repo, path, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    'Accept': 'application/vnd.github.raw',
    'User-Agent': 'sspirial-sync-agent'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const res = await fetch(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return await res.text();
}

async function run() {
  loadEnv();
  
  const appId = process.env.VITE_INSTANT_APP_ID;
  const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN;
  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const githubAccount = process.env.GITHUB_ACCOUNT || 'sspirial';
  
  if (!appId || !adminToken) {
    console.error('❌ Error: VITE_INSTANT_APP_ID or INSTANT_APP_ADMIN_TOKEN is not configured in .env.local.');
    process.exit(1);
  }
  
  console.log(`📡 Fetching repositories for GitHub account: "${githubAccount}"...`);
  
  let repos = [];
  try {
    // Try organization endpoint first
    let res = await fetchGithub(`https://api.github.com/orgs/${githubAccount}/repos?per_page=100`, githubToken);
    if (!res) {
      // Fallback to user endpoint
      res = await fetchGithub(`https://api.github.com/users/${githubAccount}/repos?per_page=100`, githubToken);
    }
    
    if (!res) {
      throw new Error(`Account "${githubAccount}" not found on GitHub.`);
    }
    
    repos = await res.json();
  } catch (e) {
    console.error('❌ Failed to fetch repositories:', e.message);
    process.exit(1);
  }
  
  console.log(`   Found ${repos.length} total repositories. Filtering for portfolio tags...`);
  
  const steps = [];
  const projectsSynced = [];
  const researchSynced = [];
  
  for (const repo of repos) {
    const topics = repo.topics || [];
    const isProject = topics.includes('portfolio-project') || topics.includes('sspirial-project');
    const isResearch = topics.includes('portfolio-research') || topics.includes('sspirial-research');
    
    if (!isProject && !isResearch) continue;
    
    const owner = repo.owner.login;
    const name = repo.name;
    const uuid = toUuid(name);
    
    console.log(`📦 Processing repository: "${owner}/${name}" (${isProject ? 'Project' : 'Research'})...`);
    
    if (isProject) {
      // 1. Process Project
      // Fetch README.md
      const readmeContent = await fetchRawFile(owner, name, 'README.md', githubToken) || '';
      const { metadata, body } = parseMarkdown(readmeContent);
      
      // Fetch package.json if it exists to get version
      let version = '1.0.0';
      const packageJson = await fetchRawFile(owner, name, 'package.json', githubToken);
      if (packageJson) {
        try {
          const pkg = JSON.parse(packageJson);
          version = pkg.version || version;
        } catch (e) {
          // ignore
        }
      }
      
      // Filter out system tags from tech stack
      const cleanTopics = topics.filter(t => !['portfolio-project', 'sspirial-project', 'portfolio-research', 'sspirial-research'].includes(t));
      
      const payload = {
        id: uuid,
        title: metadata.title || name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: metadata.description || repo.description || '',
        readme: body || readmeContent,
        techStack: Array.isArray(metadata.techStack) ? metadata.techStack : (cleanTopics.length > 0 ? cleanTopics : [repo.language].filter(Boolean)),
        tags: Array.isArray(metadata.tags) ? metadata.tags : (Array.isArray(metadata.techStack) ? metadata.techStack : (cleanTopics.length > 0 ? cleanTopics : [repo.language].filter(Boolean))),
        type: metadata.type || 'Prototype',
        status: metadata.status || 'Active',
        color: metadata.color || 'bg-primary',
        version: metadata.version || version,
        featured: metadata.featured !== undefined ? !!metadata.featured : repo.stargazers_count > 0,
        githubUrl: repo.html_url,
        liveUrl: metadata.liveUrl || repo.homepage || '',
        image: metadata.image || ''
      };
      
      steps.push(['update', 'projects', uuid, payload]);
      projectsSynced.push(repo.name);
    } else if (isResearch) {
      // 2. Process Research Node
      // Fetch RESEARCH.md
      const researchContent = await fetchRawFile(owner, name, 'RESEARCH.md', githubToken) || '';
      const { metadata, body } = parseMarkdown(researchContent);
      
      const cleanTopics = topics.filter(t => !['portfolio-project', 'sspirial-project', 'portfolio-research', 'sspirial-research'].includes(t));
      const textLength = body ? body.length : researchContent.length;
      const readMinutes = Math.max(1, Math.ceil(textLength / 1500)); // Rough estimate
      
      const payload = {
        id: uuid,
        title: metadata.title || name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        category: metadata.category || 'DEV LOG',
        date: metadata.date || repo.pushed_at.split('T')[0],
        excerpt: metadata.excerpt || repo.description || body.substring(0, 160) + (body.length > 160 ? '...' : ''),
        tags: Array.isArray(metadata.tags) ? metadata.tags : cleanTopics,
        readTime: metadata.readTime || `${readMinutes} min read`,
        imageUrl: metadata.imageUrl || '',
        featured: metadata.featured !== undefined ? !!metadata.featured : false,
        repositoryUrl: repo.html_url
      };
      
      steps.push(['update', 'research', uuid, payload]);
      researchSynced.push(repo.name);
    }
  }
  
  if (steps.length === 0) {
    console.log('✅ GitHub sync complete. No repositories found with portfolio topics.');
    return;
  }
  
  console.log(`🚀 Sending ${steps.length} transaction steps to InstantDB...`);
  
  try {
    const response = await fetch('https://api.instantdb.com/admin/transact', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'App-Id': appId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`InstantDB API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`✅ Sync complete! Tx ID: ${result['tx-id']}`);
    console.log(`   Synced Projects (${projectsSynced.length}): ${projectsSynced.join(', ') || 'None'}`);
    console.log(`   Synced Research (${researchSynced.length}): ${researchSynced.join(', ') || 'None'}`);
  } catch (error) {
    console.error('❌ Transaction failed:', error.message);
    process.exit(1);
  }
}

run();
