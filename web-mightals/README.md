# Web-Mightals

Deterministic Performance Monitoring for the Modern Web.

## Project Structure

- `src/perf.js`: Low-level `perf$` stream that segments performance entries by animation frame.
- `src/webMightals.js`: High-level `webMightals$` and `finalized$` observables for navigation and interaction tracking.
- `src/reporter.js`: Console-based reporting logic with delta-tracking and "pretty" formatting.
- `src/index.js`: Entry point that subscribes the reporter to the data streams.

## Development

### Install Dependencies
```bash
npm install
```

### Build the Bundle
Generates a self-contained bundle in `dist/web-mightals.iife.js` suitable for console injection.
```bash
npm run build
```

## Features

- **Frame-Atomic Updates:** Groups performance entries by visual animation frame using `paintTime`.
- **Navigation Slices:** Tracks INP, CLS, LCP, and TBT per URL (including soft-navigations).
- **Delta Logging:** Real-time updates only show what changed in each frame.
- **Chromium Metadata Support:** Automatically uses `largestPaintedElement` and `firstPaintedElement` from upcoming Chromium updates.
- **Observable-based API:** Decoupled data aggregation from reporting for maximum flexibility. Uses the [W3C Observable proposal](https://github.com/W3C/observable).
