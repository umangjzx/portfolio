import { describe, it, expect } from 'vitest';
import { fuzzySearchService } from './fuzzySearch';
import type { Command } from '../types';

const mockCommands: Command[] = [
  {
    id: 'view-projects',
    label: 'View Projects',
    action: () => {},
    keywords: ['projects', 'work', 'portfolio', 'showcase'],
    icon: '🚀',
  },
  {
    id: 'download-resume',
    label: 'Download Resume',
    action: () => {},
    keywords: ['resume', 'cv', 'download', 'pdf'],
    icon: '📄',
  },
  {
    id: 'contact',
    label: 'Contact',
    action: () => {},
    keywords: ['contact', 'email', 'message', 'reach'],
    icon: '✉️',
  },
  {
    id: 'github',
    label: 'GitHub',
    action: () => {},
    keywords: ['github', 'code', 'repository', 'source'],
    icon: '💻',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    action: () => {},
    keywords: ['linkedin', 'professional', 'network', 'connect'],
    icon: '🔗',
  },
];

describe('FuzzySearchService', () => {
  it('returns all commands when query is empty', () => {
    const result = fuzzySearchService.search('', mockCommands);
    expect(result).toHaveLength(mockCommands.length);
  });

  it('returns all commands when query is whitespace only', () => {
    const result = fuzzySearchService.search('   ', mockCommands);
    expect(result).toHaveLength(mockCommands.length);
  });

  it('returns matching commands for exact label match', () => {
    const result = fuzzySearchService.search('Contact', mockCommands);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe('contact');
  });

  it('returns matching commands for keyword match', () => {
    const result = fuzzySearchService.search('pdf', mockCommands);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe('download-resume');
  });

  it('performs case-insensitive matching', () => {
    const result = fuzzySearchService.search('github', mockCommands);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe('github');
  });

  it('performs fuzzy matching (non-consecutive characters)', () => {
    // "vp" should match "View Projects" (V...P)
    const result = fuzzySearchService.search('vp', mockCommands);
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((cmd) => cmd.id === 'view-projects')).toBe(true);
  });

  it('returns empty array when no commands match', () => {
    const result = fuzzySearchService.search('zzzzz', mockCommands);
    expect(result).toHaveLength(0);
  });

  it('returns results sorted by relevance (exact matches first)', () => {
    const result = fuzzySearchService.search('git', mockCommands);
    // "GitHub" has "git" as exact substring in label, should rank highest
    expect(result[0].id).toBe('github');
  });

  it('result is always a subset of input commands', () => {
    const result = fuzzySearchService.search('pro', mockCommands);
    for (const cmd of result) {
      expect(mockCommands.some((m) => m.id === cmd.id)).toBe(true);
    }
  });

  it('handles single character queries', () => {
    const result = fuzzySearchService.search('c', mockCommands);
    // Should match commands with 'c' in label or keywords
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles empty commands array', () => {
    const result = fuzzySearchService.search('test', []);
    expect(result).toHaveLength(0);
  });
});
