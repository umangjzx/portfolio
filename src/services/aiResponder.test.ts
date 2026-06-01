import { describe, it, expect } from 'vitest';
import { aiResponder } from './aiResponder';
import { AI_KNOWLEDGE } from '../data/ai-knowledge';

describe('AIResponderService', () => {
  describe('respond', () => {
    it('should return a skills topic response for skills-related questions', () => {
      const result = aiResponder.respond('What are your skills?');
      expect(result.topic).toBe('skills');
      const skillsEntry = AI_KNOWLEDGE.find((e) => e.topic === 'skills')!;
      expect(skillsEntry.responses).toContain(result.content);
    });

    it('should return a projects topic response for project-related questions', () => {
      const result = aiResponder.respond('Tell me about your projects');
      expect(result.topic).toBe('projects');
      const projectsEntry = AI_KNOWLEDGE.find((e) => e.topic === 'projects')!;
      expect(projectsEntry.responses).toContain(result.content);
    });

    it('should return a contact topic response for contact-related questions', () => {
      const result = aiResponder.respond('How can I contact you?');
      expect(result.topic).toBe('contact');
      const contactEntry = AI_KNOWLEDGE.find((e) => e.topic === 'contact')!;
      expect(contactEntry.responses).toContain(result.content);
    });

    it('should return an experience topic response for experience-related questions', () => {
      const result = aiResponder.respond('What is your experience?');
      expect(result.topic).toBe('experience');
      const experienceEntry = AI_KNOWLEDGE.find((e) => e.topic === 'experience')!;
      expect(experienceEntry.responses).toContain(result.content);
    });

    it('should be case-insensitive when matching keywords', () => {
      const result = aiResponder.respond('WHAT ARE YOUR SKILLS?');
      expect(result.topic).toBe('skills');
    });

    it('should return fallback for unrecognized questions', () => {
      const result = aiResponder.respond('What is the meaning of life?');
      expect(result.topic).toBe('fallback');
      expect(result.content).toContain('skills');
      expect(result.content).toContain('projects');
      expect(result.content).toContain('contact');
      expect(result.content).toContain('experience');
    });

    it('should return fallback for empty questions', () => {
      const result = aiResponder.respond('');
      expect(result.topic).toBe('fallback');
    });

    it('should pick the topic with the most keyword matches when multiple match', () => {
      // "skills" and "technologies" are both keywords for the skills topic
      const result = aiResponder.respond(
        'Tell me about your skills and technologies and expertise'
      );
      expect(result.topic).toBe('skills');
    });
  });

  describe('getAvailableTopics', () => {
    it('should return all four topics', () => {
      const topics = aiResponder.getAvailableTopics();
      expect(topics).toEqual(['skills', 'projects', 'contact', 'experience']);
    });

    it('should return exactly 4 topics', () => {
      const topics = aiResponder.getAvailableTopics();
      expect(topics).toHaveLength(4);
    });
  });
});
