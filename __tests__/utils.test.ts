import { formatDate, formatRelativeTime, truncateText, getInitials } from '@/utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBe('January 15, 2024');
    });
  });

  describe('formatRelativeTime', () => {
    beforeAll(() => {
      // Mock the current date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns "X minutes ago" for recent times', () => {
      const date = new Date('2024-01-15T11:30:00Z'); // 30 minutes ago
      const result = formatRelativeTime(date);
      expect(result).toBe('30 minutes ago');
    });

    it('returns "X hours ago" for times within the day', () => {
      const date = new Date('2024-01-15T10:00:00Z'); // 2 hours ago
      const result = formatRelativeTime(date);
      expect(result).toBe('2 hours ago');
    });

    it('returns "Yesterday" for yesterday', () => {
      const date = new Date('2024-01-14T12:00:00Z'); // Yesterday
      const result = formatRelativeTime(date);
      expect(result).toBe('Yesterday');
    });
  });

  describe('truncateText', () => {
    it('truncates text when it exceeds max length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
    });

    it('returns original text when it does not exceed max length', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe('Short text');
    });
  });

  describe('getInitials', () => {
    it('returns initials for full name', () => {
      const result = getInitials('John Doe');
      expect(result).toBe('JD');
    });

    it('returns initials for single name', () => {
      const result = getInitials('John');
      expect(result).toBe('J');
    });

    it('returns first two initials for multiple names', () => {
      const result = getInitials('John Michael Doe');
      expect(result).toBe('JM');
    });
  });
});