import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidProject } from '@core/utils/validators';

describe('Core Utils: Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidProject', () => {
    it('should validate correct project objects', () => {
      const validProject = {
        id: 'project-1',
        title: 'Test Project',
        description: 'A test project',
        tags: ['test', 'example'],
        type: 'Tool',
        status: 'Active'
      };
      expect(isValidProject(validProject)).toBe(true);
    });

    it('should reject invalid project objects', () => {
      expect(isValidProject(null)).toBe(false);
      expect(isValidProject(undefined)).toBe(false);
      expect(isValidProject({})).toBe(false);
      expect(isValidProject({ id: 'test' })).toBe(false);
      
      const invalidType = {
        id: 'project-1',
        title: 'Test',
        description: 'Test',
        tags: [],
        type: 'InvalidType',
        status: 'Active'
      };
      expect(isValidProject(invalidType)).toBe(false);
    });
  });
});
