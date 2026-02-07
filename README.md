# rn-date

`rn-date` is a zero-dependency TypeScript library which fixes the date parsing issues in React Native with Android.

## Background

React Native on Android has inconsistent date parsing behavior compared to iOS and web. The native `Date` constructor may parse date strings differently depending on the platform and format. This library provides consistent, reliable date parsing across all platforms.

## Features

- **Zero runtime dependencies** - Minimal bundle size impact
- **TypeScript support** - Full type definitions included
- **Consistent parsing** - Same behavior across iOS, Android, and web
- **Multiple format support**:
  - Date-only: `YYYY-MM-DD`
  - DateTime: `YYYY-MM-DD HH:MM:SS`
  - ISO 8601: `YYYY-MM-DDTHH:MM:SS.sssZ`
- **Utility methods** - Convenient formatting and validation

## Installation

```bash
yarn add rn-date
# or
npm install rn-date
```

## Usage

### Basic Import

```ts
import { RnDate } from 'rn-date';
```

### Creating Dates

```ts
// Current date and time
const now = new RnDate();

// Date-only format (parsed as UTC)
const date = new RnDate('2022-01-01');

// DateTime with space separator (parsed as local time)
const dateTime = new RnDate('2022-01-01 17:04:03');

// ISO 8601 format (UTC with timezone)
const isoDate = new RnDate('2022-01-01T00:00:00.000Z');
```

### Using with Date Methods

`RnDate` extends the native `Date` class, so all standard Date methods are available:

```ts
const date = new RnDate('2022-01-01 17:04:03');

// Standard Date methods work as expected
date.getFullYear();  // 2022
date.getMonth();     // 0 (January)
date.getDate();      // 1
date.getHours();     // 17
date.getMinutes();   // 4
date.getSeconds();   // 3

// Format methods
date.toISOString();      // "2022-01-01T16:04:03.000Z" (UTC)
date.toDateString();     // "Sat Jan 01 2022"
date.toString();         // Full date string

// Timestamp
date.getTime();          // 1641056643000
```

## API Reference

### Constructor

#### `new RnDate(dateString?: string)`

Creates a new RnDate instance.

**Parameters:**
- `dateString` (`string | undefined`) - The date string to parse

**Supported formats:**
- `YYYY-MM-DD` - Date only (parsed as UTC)
- `YYYY-MM-DD HH:MM:SS` - DateTime (parsed as local time)
- `YYYY-MM-DDTHH:MM:SS.sssZ` - ISO 8601 format (UTC)
- `undefined` or `null` - Current date and time

**Throws:**
- `TypeError` - If `dateString` is not a string or undefined

**Examples:**

```ts
// Current date
const now = new RnDate();
const alsoNow = new RnDate(undefined);

// Specific date (UTC)
const date = new RnDate('2022-01-01');

// Specific datetime (local time)
const dateTime = new RnDate('2022-01-01 17:04:03');

// ISO format (UTC)
const isoDate = new RnDate('2022-01-01T00:00:00.000Z');

// Invalid date returns Invalid Date
const invalid = new RnDate('invalid-date');
console.log(invalid.toString()); // "Invalid Date"
```

### Methods

#### `isValid(): boolean`

Checks if this RnDate represents a valid date.

**Returns:** `boolean` - `true` if the date is valid, `false` otherwise

**Example:**

```ts
const validDate = new RnDate('2022-01-01');
validDate.isValid(); // true

const invalidDate = new RnDate('invalid');
invalidDate.isValid(); // false
```

---

#### `toDateFormat(): string`

Formats the date as a string in the format `YYYY-MM-DD` (UTC).

**Returns:** `string` - The formatted date string

**Example:**

```ts
const date = new RnDate('2022-01-01 17:04:03');
date.toDateFormat(); // "2022-01-01"
```

---

#### `toDateTimeFormat(): string`

Formats the date and time as a string in the format `YYYY-MM-DD HH:MM:SS` (local time).

**Returns:** `string` - The formatted datetime string

**Example:**

```ts
const date = new RnDate('2022-01-01 17:04:03');
date.toDateTimeFormat(); // "2022-01-01 17:04:03"
```

## Platform Differences

The native `Date` constructor has platform-specific behaviors:

| Format | iOS/Web | Android (without fix) | Android (with RnDate) |
|--------|---------|----------------------|----------------------|
| `YYYY-MM-DD` | UTC | Local (inconsistent) | UTC (consistent) |
| `YYYY-MM-DD HH:MM:SS` | Local | Local | Local |
| `YYYY-MM-DDTHH:MM:SS.sssZ` | UTC | UTC | UTC |

`RnDate` ensures consistent behavior across all platforms.

## License

MIT
