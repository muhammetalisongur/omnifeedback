/**
 * Vitest test setup file
 * Configures test environment with DOM mocks and cleanup
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Cleanup DOM after each test to prevent memory leaks
 * and ensure test isolation
 */
afterEach(() => {
  cleanup();
});

/**
 * Mock window.matchMedia for responsive testing
 * Required for components that use media queries
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock ResizeObserver for components that observe element sizes
 * Required for responsive components and layout calculations
 */
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof ResizeObserver;

/**
 * Mock IntersectionObserver for lazy loading and visibility detection
 * Required for components that detect viewport visibility
 */
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn().mockReturnValue([]),
})) as unknown as typeof IntersectionObserver;

/**
 * Mock requestAnimationFrame for animation testing
 * Ensures consistent behavior across test environments
 */
window.requestAnimationFrame = vi.fn().mockImplementation((callback: FrameRequestCallback) => {
  return window.setTimeout(() => callback(Date.now()), 0);
}) as typeof window.requestAnimationFrame;

window.cancelAnimationFrame = vi.fn().mockImplementation((id: number) => {
  window.clearTimeout(id);
}) as typeof window.cancelAnimationFrame;

/**
 * Mock scrollTo for components that manipulate scroll position
 */
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

/**
 * Mock getComputedStyle for style-dependent tests
 */
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue(''),
  })),
});

/**
 * Suppress console errors during tests unless explicitly testing error handling
 * Uncomment below to enable error suppression
 */
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args: unknown[]) => {
//     if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
//       return;
//     }
//     originalError.call(console, ...args);
//   };
// });
// afterAll(() => {
//   console.error = originalError;
// });
