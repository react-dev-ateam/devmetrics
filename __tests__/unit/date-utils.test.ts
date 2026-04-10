import { describe, it, expect } from 'vitest';
import { formatDistanceToNow, formatTime, formatDate } from '@/lib/date-utils';

describe('Date Utils', () => {
  describe('formatDistanceToNow', () => {
    it('should format just now', () => {
      const now = new Date();
      const result = formatDistanceToNow(now);
      expect(result).toBe('just now');
    });

    it('should format minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatDistanceToNow(fiveMinutesAgo);
      expect(result).toMatch(/^\d+m$/);
    });

    it('should format hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatDistanceToNow(twoHoursAgo);
      expect(result).toMatch(/^\d+h$/);
    });

    it('should format days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatDistanceToNow(threeDaysAgo);
      expect(result).toMatch(/^\d+d$/);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15 14:30:00');
      const result = formatTime(date);
      expect(result).toMatch(/^\d{1,2}:\d{2}\s(AM|PM)$/);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });
  });
});
