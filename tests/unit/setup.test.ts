/**
 * Smoke test to verify test setup is working correctly
 */
import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should have window defined', () => {
    expect(window).toBeDefined();
  });

  it('should have document defined', () => {
    expect(document).toBeDefined();
  });

  it('should have mocked matchMedia', () => {
    expect(window.matchMedia).toBeDefined();
    const result = window.matchMedia('(min-width: 768px)');
    expect(result.matches).toBe(false);
    expect(result.media).toBe('(min-width: 768px)');
  });

  it('should have mocked ResizeObserver', () => {
    expect(window.ResizeObserver).toBeDefined();
    const observer = new window.ResizeObserver(() => {
      // Empty callback for testing
    });
    expect(observer.observe).toBeDefined();
    expect(observer.disconnect).toBeDefined();
  });

  it('should have mocked IntersectionObserver', () => {
    expect(window.IntersectionObserver).toBeDefined();
    const observer = new window.IntersectionObserver(() => {
      // Empty callback for testing
    });
    expect(observer.observe).toBeDefined();
    expect(observer.disconnect).toBeDefined();
  });

  it('should have mocked requestAnimationFrame', () => {
    expect(window.requestAnimationFrame).toBeDefined();
    expect(window.cancelAnimationFrame).toBeDefined();
  });
});

