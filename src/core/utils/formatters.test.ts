import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime } from '@core/utils/formatters';

describe('Core Utils: Formatters', () => {
  describe('formatDate', () => {
    it('should format date string to MMM DD, YYYY format', () => {
      const result = formatDate('2026-01-12');
      expect(result).toBe('Jan 12, 2026');
    });

    it('should handle ISO date strings', () => {
      const result = formatDate('2026-01-12T10:30:00Z');
      expect(result).toMatch(/Jan 12, 2026/);
    });

    it('should return "Invalid Date" for invalid date strings', () => {
      const invalidDate = 'invalid-date';
      const result = formatDate(invalidDate);
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format very recent time as "just now"', () => {
      const now = new Date();
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      const result = formatRelativeTime(fiveSecondsAgo.toISOString());
      expect(result).toBe('just now');
    });

    it('should format minutes correctly', () => {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 120000);
      const result = formatRelativeTime(twoMinutesAgo.toISOString());
      expect(result).toBe('2m ago');
    });

    it('should return "Invalid Date" for invalid date strings', () => {
      const invalidDate = 'invalid-date';
      const result = formatRelativeTime(invalidDate);
      expect(result).toBe('Invalid Date');
    });
  });
});
