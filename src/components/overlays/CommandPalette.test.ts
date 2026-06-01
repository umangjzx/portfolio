import { describe, it, expect } from 'vitest';
import { fuzzySearchService } from '../../services/fuzzySearch';
import { COMMANDS } from '../../data/commands';

/**
 * Unit tests for Command Palette logic.
 * Tests the fuzzy search integration and command filtering behavior
 * that powers the Command Palette overlay.
 */

describe('CommandPalette - Fuzzy Search Integration', () => {
  it('returns all 5 commands when query is empty', () => {
    const results = fuzzySearchService.search('', COMMANDS);
    expect(results).toHaveLength(5);
  });

  it('filters to "View Projects" when searching "proj"', () => {
    const results = fuzzySearchService.search('proj', COMMANDS);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('view-projects');
  });

  it('filters to "Download Resume" when searching "resume"', () => {
    const results = fuzzySearchService.search('resume', COMMANDS);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('download-resume');
  });

  it('filters to "Contact" when searching "contact"', () => {
    const results = fuzzySearchService.search('contact', COMMANDS);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('contact');
  });

  it('filters to "GitHub" when searching "github"', () => {
    const results = fuzzySearchService.search('github', COMMANDS);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('github');
  });

  it('filters to "LinkedIn" when searching "linkedin"', () => {
    const results = fuzzySearchService.search('linkedin', COMMANDS);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('linkedin');
  });

  it('returns empty array for nonsense query with no matches', () => {
    const results = fuzzySearchService.search('zzzzxxx', COMMANDS);
    expect(results).toHaveLength(0);
  });

  it('matches via keywords (e.g., "pdf" matches Download Resume)', () => {
    const results = fuzzySearchService.search('pdf', COMMANDS);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((cmd) => cmd.id === 'download-resume')).toBe(true);
  });

  it('matches via keywords (e.g., "network" matches LinkedIn)', () => {
    const results = fuzzySearchService.search('network', COMMANDS);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((cmd) => cmd.id === 'linkedin')).toBe(true);
  });

  it('is case-insensitive', () => {
    const lower = fuzzySearchService.search('github', COMMANDS);
    const upper = fuzzySearchService.search('GITHUB', COMMANDS);
    expect(lower).toEqual(upper);
  });

  it('results are always a subset of input commands', () => {
    const queries = ['pro', 'con', 'down', 'git', 'link', 'xyz'];
    for (const q of queries) {
      const results = fuzzySearchService.search(q, COMMANDS);
      for (const result of results) {
        expect(COMMANDS.some((cmd) => cmd.id === result.id)).toBe(true);
      }
    }
  });
});
