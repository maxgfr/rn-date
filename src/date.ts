/**
 * RnDate - A Date class extension that fixes Android date parsing issues in React Native.
 *
 * This class addresses the date parsing inconsistencies that occur specifically on
 * Android devices in React Native applications. It provides reliable parsing for:
 * - Date-only format: YYYY-MM-DD
 * - DateTime format: YYYY-MM-DD HH:MM:SS
 * - ISO 8601 format: YYYY-MM-DDTHH:MM:SS.sssZ
 *
 * @example
 * ```ts
 * import { RnDate } from 'rn-date';
 *
 * const date = new RnDate('2022-01-01');
 * const dateTime = new RnDate('2022-01-01 17:04:03');
 * const isoDate = new RnDate('2022-01-01T00:00:00.000Z');
 * ```
 *
 * @class RnDate
 * @extends {Date}
 */
export class RnDate extends Date {
  /**
   * Creates a new RnDate instance.
   *
   * @param {string | undefined} dateString - The date string to parse. Supports formats:
   *   - YYYY-MM-DD (date only)
   *   - YYYY-MM-DD HH:MM:SS (date and time separated by space)
   *   - YYYY-MM-DDTHH:MM:SS.sssZ (ISO 8601 format)
   *   - If undefined or empty, creates a date with the current date and time
   * @throws {TypeError} If dateString is not a string or undefined
   *
   * @example
   * ```ts
   * new RnDate() // Current date
   * new RnDate('2022-01-01') // Date only
   * new RnDate('2022-01-01 17:04:03') // DateTime with space
   * new RnDate('2022-01-01T00:00:00.000Z') // ISO format
   * ```
   */
  constructor(dateString?: string) {
    // Initialize with NaN, will be set below
    super(NaN);

    // Handle undefined
    if (dateString === undefined || dateString === null) {
      this.setTime(Date.now());
      return;
    }

    // Validate input type
    if (typeof dateString !== 'string') {
      throw new TypeError(
        `RnDate expects a string argument, received ${typeof dateString}`
      );
    }

    // Handle empty string - should return Invalid Date like native Date
    if (dateString === '') {
      // Leave as NaN (Invalid Date)
      return;
    }

    // Trim whitespace
    const trimmedDate = dateString.trim();

    // Check for ISO format (contains 'T')
    if (trimmedDate.includes('T')) {
      // ISO format - let native Date handle it
      const tempDate = new Date(trimmedDate);
      this.setTime(tempDate.getTime());
      return;
    }

    // Check for space-separated datetime format (YYYY-MM-DD HH:MM:SS)
    const spaceIndex = trimmedDate.indexOf(' ');

    if (spaceIndex !== -1) {
      // Split into date and time parts
      const datePart = trimmedDate.substring(0, spaceIndex);
      const timePart = trimmedDate.substring(spaceIndex + 1);

      // Parse date components (YYYY-MM-DD)
      const dateComponents = datePart.split('-');
      if (dateComponents.length !== 3) {
        // Invalid format, fall back to native parsing
        const tempDate = new Date(trimmedDate);
        this.setTime(tempDate.getTime());
        return;
      }

      const [yearStr, monthStr, dayStr] = dateComponents;
      const year = parseInt(yearStr, 10);
      const monthValue = parseInt(monthStr, 10); // 1-based month
      const day = parseInt(dayStr, 10);

      // Validate date components (month 1-12, day 1-31)
      if (
        isNaN(year) ||
        isNaN(monthValue) ||
        isNaN(day) ||
        monthValue < 1 ||
        monthValue > 12 ||
        day < 1 ||
        day > 31
      ) {
        // Invalid date, fall back to native parsing
        const tempDate = new Date(trimmedDate);
        this.setTime(tempDate.getTime());
        return;
      }

      const month = monthValue - 1; // Convert to 0-based month

      // Parse time components (HH:MM:SS)
      const timeComponents = timePart.split(':');
      let hours = 0,
        minutes = 0,
        seconds = 0,
        milliseconds = 0;

      if (timeComponents.length >= 1) {
        hours = parseInt(timeComponents[0], 10);
      }
      if (timeComponents.length >= 2) {
        minutes = parseInt(timeComponents[1], 10);
      }
      if (timeComponents.length >= 3) {
        // Handle potential milliseconds (e.g., "SS.fff" or "SS")
        const secondsPart = timeComponents[2];
        const dotIndex = secondsPart.indexOf('.');
        if (dotIndex !== -1) {
          seconds = parseInt(secondsPart.substring(0, dotIndex), 10);
          const msStr = secondsPart.substring(dotIndex + 1);
          // Pad or truncate milliseconds to 3 digits
          milliseconds = parseInt(msStr.padEnd(3, '0').substring(0, 3), 10);
        } else {
          seconds = parseInt(secondsPart, 10);
        }
      }

      // Use local time for space-separated datetime (matching native behavior)
      const tempDate = new Date(year, month, day, hours, minutes, seconds, milliseconds);
      this.setTime(tempDate.getTime());
      return;
    }

    // Check for date-only format (YYYY-MM-DD)
    const dateComponents = trimmedDate.split('-');
    if (dateComponents.length === 3) {
      const [yearStr, monthStr, dayStr] = dateComponents;
      const year = parseInt(yearStr, 10);
      const monthValue = parseInt(monthStr, 10); // 1-based month
      const day = parseInt(dayStr, 10);

      // Validate date components format and values
      // Month should be 1-12, day should be 1-31 (basic validation)
      if (
        !isNaN(year) &&
        !isNaN(monthValue) &&
        !isNaN(day) &&
        yearStr.length === 4 &&
        monthStr.length >= 1 &&
        monthStr.length <= 2 &&
        dayStr.length >= 1 &&
        dayStr.length <= 2 &&
        monthValue >= 1 &&
        monthValue <= 12 &&
        day >= 1 &&
        day <= 31
      ) {
        const month = monthValue - 1; // Convert to 0-based month
        // Use Date.UTC to create UTC timestamp (matching native behavior)
        const time = Date.UTC(year, month, day);
        this.setTime(time);
        return;
      }
    }

    // Fallback: try native parsing for any other format
    const tempDate = new Date(trimmedDate);
    this.setTime(tempDate.getTime());
  }

  /**
   * Checks if this RnDate represents a valid date.
   *
   * @returns {boolean} True if the date is valid, false otherwise
   *
   * @example
   * ```ts
   * const validDate = new RnDate('2022-01-01');
   * validDate.isValid(); // true
   *
   * const invalidDate = new RnDate('invalid');
   * invalidDate.isValid(); // false
   * ```
   */
  isValid(): boolean {
    return !isNaN(this.getTime());
  }

  /**
   * Formats the date as a string in the format YYYY-MM-DD.
   *
   * @returns {string} The formatted date string
   *
   * @example
   * ```ts
   * const date = new RnDate('2022-01-01 17:04:03');
   * date.toDateFormat(); // "2022-01-01"
   * ```
   */
  toDateFormat(): string {
    const year = this.getUTCFullYear();
    const month = String(this.getUTCMonth() + 1).padStart(2, '0');
    const day = String(this.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formats the date and time as a string in the format YYYY-MM-DD HH:MM:SS.
   *
   * @returns {string} The formatted datetime string
   *
   * @example
   * ```ts
   * const date = new RnDate('2022-01-01 17:04:03');
   * date.toDateTimeFormat(); // "2022-01-01 17:04:03"
   * ```
   */
  toDateTimeFormat(): string {
    const date = this.toDateFormat();
    const hours = String(this.getHours()).padStart(2, '0');
    const minutes = String(this.getMinutes()).padStart(2, '0');
    const seconds = String(this.getSeconds()).padStart(2, '0');
    return `${date} ${hours}:${minutes}:${seconds}`;
  }
}
