import { describe, it, expect } from 'vitest';
import { formValidator } from './formValidator';

describe('FormValidatorService', () => {
  describe('validate', () => {
    it('returns isValid=true for valid form data', () => {
      const result = formValidator.validate({
        name: 'Umang Jaiswal',
        email: 'umang@example.com',
        message: 'Hello, I would like to connect!',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors.name).toBeNull();
      expect(result.errors.email).toBeNull();
      expect(result.errors.message).toBeNull();
    });

    it('returns error when name is empty', () => {
      const result = formValidator.validate({
        name: '',
        email: 'test@example.com',
        message: 'Hello',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
    });

    it('returns error when name is only whitespace', () => {
      const result = formValidator.validate({
        name: '   ',
        email: 'test@example.com',
        message: 'Hello',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
    });

    it('returns error when name exceeds 100 characters', () => {
      const result = formValidator.validate({
        name: 'a'.repeat(101),
        email: 'test@example.com',
        message: 'Hello',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name must be 100 characters or less');
    });

    it('accepts name at exactly 100 characters', () => {
      const result = formValidator.validate({
        name: 'a'.repeat(100),
        email: 'test@example.com',
        message: 'Hello',
      });

      expect(result.errors.name).toBeNull();
    });

    it('returns error when email is empty', () => {
      const result = formValidator.validate({
        name: 'Test',
        email: '',
        message: 'Hello',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required');
    });

    it('returns error when email exceeds 254 characters', () => {
      const result = formValidator.validate({
        name: 'Test',
        email: 'a'.repeat(246) + '@test.com',
        message: 'Hello',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email must be 254 characters or less');
    });

    it('returns error when email has invalid format', () => {
      const result = formValidator.validate({
        name: 'Test',
        email: 'not-an-email',
        message: 'Hello',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    it('returns error when message is empty', () => {
      const result = formValidator.validate({
        name: 'Test',
        email: 'test@example.com',
        message: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('Message is required');
    });

    it('returns error when message is only whitespace', () => {
      const result = formValidator.validate({
        name: 'Test',
        email: 'test@example.com',
        message: '   \n\t  ',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('Message is required');
    });

    it('returns error when message exceeds 1000 characters', () => {
      const result = formValidator.validate({
        name: 'Test',
        email: 'test@example.com',
        message: 'a'.repeat(1001),
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('Message must be 1000 characters or less');
    });

    it('accepts message at exactly 1000 characters', () => {
      const result = formValidator.validate({
        name: 'Test',
        email: 'test@example.com',
        message: 'a'.repeat(1000),
      });

      expect(result.errors.message).toBeNull();
    });

    it('returns multiple errors when multiple fields are invalid', () => {
      const result = formValidator.validate({
        name: '',
        email: 'bad-email',
        message: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).not.toBeNull();
      expect(result.errors.email).not.toBeNull();
      expect(result.errors.message).not.toBeNull();
    });
  });

  describe('validateEmail', () => {
    it('returns true for valid email formats', () => {
      expect(formValidator.validateEmail('user@example.com')).toBe(true);
      expect(formValidator.validateEmail('user.name@domain.co')).toBe(true);
      expect(formValidator.validateEmail('user+tag@sub.domain.com')).toBe(true);
    });

    it('returns false for invalid email formats', () => {
      expect(formValidator.validateEmail('')).toBe(false);
      expect(formValidator.validateEmail('no-at-sign')).toBe(false);
      expect(formValidator.validateEmail('@no-local.com')).toBe(false);
      expect(formValidator.validateEmail('no-domain@')).toBe(false);
      expect(formValidator.validateEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('returns true for non-empty strings', () => {
      expect(formValidator.validateRequired('hello')).toBe(true);
      expect(formValidator.validateRequired('a')).toBe(true);
    });

    it('returns false for empty or whitespace-only strings', () => {
      expect(formValidator.validateRequired('')).toBe(false);
      expect(formValidator.validateRequired('   ')).toBe(false);
      expect(formValidator.validateRequired('\t\n')).toBe(false);
    });
  });
});
