/**
 * Vitest test setup file
 * Configures test environment with DOM mocks and cleanup
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

/**
 * Cleanup DOM after each test to prevent memory leaks
 * and ensure test isolation
 */
afterEach(() => {
  cleanup();

  // Clean up any portal-rendered content left in document.body
  // This is necessary for components using createPortal
  const portalContainers = document.body.querySelectorAll('[data-testid]');
  portalContainers.forEach((el) => {
    if (el.parentElement === document.body) {
      el.remove();
    }
  });

  // Also clean up any orphaned portal elements (dialogs, overlays, etc.)
  const dialogElements = document.body.querySelectorAll('[role="dialog"]');
  dialogElements.forEach((el) => el.remove());

  const alertElements = document.body.querySelectorAll('[role="alert"]');
  alertElements.forEach((el) => el.remove());
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
 * Suppress React act() warnings caused by Zustand store subscriptions.
 *
 * When FeedbackManager triggers async state updates (via setTimeout in
 * scheduleStatusChange), Container components re-render through Zustand
 * subscriptions outside of React's act() wrapper. This is a known
 * false-positive with Zustand + React 18 and does not indicate real bugs.
 */
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
