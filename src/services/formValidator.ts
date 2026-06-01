import type { ContactFormData, ValidationResult } from '../types';

/**
 * Form Validator Service
 *
 * Pure function service for validating contact form data.
 * Validates name, email, and message fields with length and format constraints.
 *
 * Requirements: 10.1, 10.5, 10.6
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 1000;

export interface FormValidatorService {
  validate(data: ContactFormData): ValidationResult;
  validateEmail(email: string): boolean;
  validateRequired(value: string): boolean;
}

function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function validate(data: ContactFormData): ValidationResult {
  const errors: Record<string, string | null> = {
    name: null,
    email: null,
    message: null,
  };

  // Validate name: required, max 100 chars
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  } else if (data.name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
  }

  // Validate email: required, max 254 chars, valid format
  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (data.email.length > MAX_EMAIL_LENGTH) {
    errors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or less`;
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate message: required, max 1000 chars
  if (!validateRequired(data.message)) {
    errors.message = 'Message is required';
  } else if (data.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
  }

  const isValid = Object.values(errors).every((error) => error === null);

  return { isValid, errors };
}

export const formValidator: FormValidatorService = {
  validate,
  validateEmail,
  validateRequired,
};
