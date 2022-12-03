# rn-date

`rn-date` is a zero-dependency library which fixes the date parsing issue in React Native with Android.

## Installation

```bash
yarn add rn-date
```

## Usage

```ts
import { RnDate } from 'rn-date';

const date = new RnDate('2020-01-01T00:00:00.000Z'); // instead of new Date('2020-01-01T00:00:00.000Z')
```
