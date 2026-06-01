export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  fork: boolean;
  updated_at: string;
}

const CACHE_KEY_USER = 'github_user_cache';
const CACHE_KEY_REPOS = 'github_repos_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const cached = localStorage.getItem(CACHE_KEY_USER);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) return data;
    }

    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error('Failed to fetch GitHub user');
    const data = await res.json();
    
    localStorage.setItem(CACHE_KEY_USER, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY_REPOS);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) return data;
    }

    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error('Failed to fetch GitHub repos');
    let data: GitHubRepo[] = await res.json();
    
    // Filter out forks and sort by stars
    data = data.filter(repo => !repo.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);

    localStorage.setItem(CACHE_KEY_REPOS, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

export function calculateLanguageStats(repos: GitHubRepo[]): Record<string, number> {
  const stats: Record<string, number> = {};
  repos.forEach(repo => {
    if (repo.language) {
      stats[repo.language] = (stats[repo.language] || 0) + 1;
    }
  });
  return stats;
}
