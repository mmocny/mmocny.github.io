import { describe, it, expect, vi } from 'vitest';
import { perf$ } from '../src/perf.js';

describe('perf$', () => {
  it('should be a function', () => {
    expect(typeof perf$).toBe('function');
  });

  // Note: Full integration testing of PerformanceObserver would require a specialized mock environment.
  // This serves as a placeholder for where frame-grouping logic tests would go.
});
