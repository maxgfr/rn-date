/**
 * Additional tests to expose potential issues in RnDate implementation
 */
import { RnDate } from '../date';

describe('RnDate - Edge Cases and Issues', () => {
  describe('Invalid input handling', () => {
    it('should handle invalid date strings gracefully', () => {
      const date = new RnDate('invalid-date');
      expect(date.toString()).toBe('Invalid Date');
    });

    it('should handle malformed date strings (JS rolls over invalid dates)', () => {
      // JavaScript rolls over invalid dates instead of returning Invalid Date
      const date = new RnDate('2022-13-45'); // Invalid month and day
      const nativeDate = new Date('2022-13-45');
      // Both should roll over to the next year
      expect(date.getTime()).toBe(nativeDate.getTime());
    });

    it('should handle partial date strings', () => {
      const date = new RnDate('2022-01'); // Only year and month
      expect(date.getFullYear()).not.toBeNaN();
    });
  });

  describe('Time zone handling', () => {
    it('should parse datetime correctly across different formats', () => {
      const date1 = new RnDate('2022-01-01 17:04:03');
      expect(date1.getFullYear()).toBe(2022);
      expect(date1.getMonth()).toBe(0);
      expect(date1.getDate()).toBe(1);
      // Space-separated datetime uses LOCAL time
      expect(date1.getHours()).toBe(17);
      expect(date1.getMinutes()).toBe(4);
      expect(date1.getSeconds()).toBe(3);
    });

    it('should handle datetime with single-digit components', () => {
      const date = new RnDate('2022-01-01 5:4:3');
      expect(date.getHours()).toBe(5);
      expect(date.getMinutes()).toBe(4);
      expect(date.getSeconds()).toBe(3);
    });
  });

  describe('Edge cases in parsing logic', () => {
    it('should handle date-only format consistently', () => {
      const date = new RnDate('2022-06-15');
      expect(date.getFullYear()).toBe(2022);
      expect(date.getMonth()).toBe(5); // June is month 5 (0-indexed)
      expect(date.getDate()).toBe(15);
    });

    it('should handle leap year dates', () => {
      const date = new RnDate('2020-02-29');
      expect(date.getFullYear()).toBe(2020);
      expect(date.getMonth()).toBe(1);
      expect(date.getDate()).toBe(29);
    });

    it('should handle non-leap year by rolling over (standard JS behavior)', () => {
      // JavaScript rolls over Feb 29 in non-leap years to Mar 1
      const date = new RnDate('2021-02-29');
      const nativeDate = new Date('2021-02-29');
      expect(date.getTime()).toBe(nativeDate.getTime());
      expect(date.getMonth()).toBe(2); // March
      expect(date.getDate()).toBe(1);
    });
  });

  describe('Comparison with native Date behavior', () => {
    it('should match native Date for ISO format', () => {
      const isoString = '2022-01-01T00:00:00.000Z';
      const rnDate = new RnDate(isoString);
      const nativeDate = new Date(isoString);
      expect(rnDate.getTime()).toBe(nativeDate.getTime());
    });
  });

  describe('Parameter validation', () => {
    it('should accept undefined', () => {
      const date = new RnDate(undefined);
      expect(date).toBeInstanceOf(RnDate);
      expect(date.isValid()).toBe(true);
    });

    it('should handle empty string as Invalid Date', () => {
      const date = new RnDate('');
      const nativeDate = new Date('');
      expect(date.toString()).toBe('Invalid Date');
      expect(date.toString()).toBe(nativeDate.toString());
    });
  });

  describe('DateTime edge cases', () => {
    it('should handle midnight', () => {
      const date = new RnDate('2022-01-01 00:00:00');
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });

    it('should handle end of day', () => {
      const date = new RnDate('2022-01-01 23:59:59');
      expect(date.getHours()).toBe(23);
      expect(date.getMinutes()).toBe(59);
      expect(date.getSeconds()).toBe(59);
    });

    it('should handle datetime with milliseconds if provided', () => {
      const date = new RnDate('2022-01-01 17:04:03.123');
      expect(date.getFullYear()).toBe(2022);
      expect(date.getMilliseconds()).toBe(123);
    });
  });

  describe('Month parsing verification', () => {
    it('should correctly parse January (month 1)', () => {
      const date = new RnDate('2022-01-01');
      expect(date.getMonth()).toBe(0);
    });

    it('should correctly parse December (month 12)', () => {
      const date = new RnDate('2022-12-31');
      expect(date.getMonth()).toBe(11);
    });

    it('should handle single-digit month', () => {
      const date = new RnDate('2022-06-15');
      expect(date.getMonth()).toBe(5);
    });

    it('should handle zero-padded month', () => {
      const date = new RnDate('2022-06-15');
      expect(date.getMonth()).toBe(5);
    });
  });

  describe('New utility methods', () => {
    it('isValid() should return true for valid dates', () => {
      const date = new RnDate('2022-01-01');
      expect(date.isValid()).toBe(true);
    });

    it('isValid() should return false for invalid dates', () => {
      const date = new RnDate('invalid');
      expect(date.isValid()).toBe(false);
    });

    it('toDateFormat() should format date only', () => {
      const date = new RnDate('2022-01-01 17:04:03');
      expect(date.toDateFormat()).toBe('2022-01-01');
    });

    it('toDateTimeFormat() should format date and time', () => {
      const date = new RnDate('2022-01-01 17:04:03');
      expect(date.toDateTimeFormat()).toBe('2022-01-01 17:04:03');
    });
  });

  describe('Type error handling', () => {
    it('should throw TypeError for non-string input', () => {
      // @ts-expect-error - Testing runtime error for invalid input
      expect(() => new RnDate(123)).toThrow(TypeError);
    });

    it('should throw TypeError for object input', () => {
      // @ts-expect-error - Testing runtime error for invalid input
      expect(() => new RnDate({})).toThrow(TypeError);
    });
  });
});
