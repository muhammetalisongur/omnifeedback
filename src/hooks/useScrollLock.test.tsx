/**
 * useScrollLock hook unit tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import type React from 'react';
import {
  useScrollLock,
  getActiveScrollLocks,
  resetScrollLockState,
} from './useScrollLock';

/**
 * Test component that uses useScrollLock
 */
function ScrollLockComponent({ enabled }: { enabled: boolean }): React.ReactElement {
  useScrollLock(enabled);
  return <div data-testid="scroll-lock-component">Content</div>;
}

describe('useScrollLock', () => {
  beforeEach(() => {
    // Reset state before each test
    resetScrollLockState();

    // Reset body styles
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    // Cleanup after each test
    resetScrollLockState();
  });

  describe('Lock Behavior', () => {
    it('should lock body scroll when enabled', () => {
      render(<ScrollLockComponent enabled />);

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.width).toBe('100%');
    });

    it('should not lock body scroll when disabled', () => {
      render(<ScrollLockComponent enabled={false} />);

      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.position).toBe('');
    });

    it('should unlock body scroll on unmount', () => {
      const { unmount } = render(<ScrollLockComponent enabled />);

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.position).toBe('');
    });

    it('should track scroll position', () => {
      // Mock scrollY
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });

      render(<ScrollLockComponent enabled />);

      // Body should be offset by scroll position
      expect(document.body.style.top).toBe('-100px');
    });
  });

  describe('Nested Locks', () => {
    it('should support multiple locks', () => {
      render(<ScrollLockComponent enabled />);
      expect(getActiveScrollLocks()).toBe(1);

      render(<ScrollLockComponent enabled />);
      expect(getActiveScrollLocks()).toBe(2);
    });

    it('should only unlock when all locks released', () => {
      const { unmount: unmount1 } = render(<ScrollLockComponent enabled />);
      const { unmount: unmount2 } = render(<ScrollLockComponent enabled />);

      expect(document.body.style.overflow).toBe('hidden');
      expect(getActiveScrollLocks()).toBe(2);

      // Unmount first component
      unmount1();

      // Still locked (one lock remaining)
      expect(document.body.style.overflow).toBe('hidden');
      expect(getActiveScrollLocks()).toBe(1);

      // Unmount second component
      unmount2();

      // Now unlocked
      expect(document.body.style.overflow).toBe('');
      expect(getActiveScrollLocks()).toBe(0);
    });
  });

  describe('Dynamic Enable/Disable', () => {
    it('should lock when toggled to enabled', () => {
      const { rerender } = render(<ScrollLockComponent enabled={false} />);

      expect(document.body.style.overflow).toBe('');

      rerender(<ScrollLockComponent enabled />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock when toggled to disabled', () => {
      const { rerender } = render(<ScrollLockComponent enabled />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<ScrollLockComponent enabled={false} />);

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Original Styles', () => {
    it('should restore original body styles on unlock', () => {
      // Set some original styles
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';

      const { unmount } = render(<ScrollLockComponent enabled />);

      // Styles should be overridden
      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');

      unmount();

      // Original styles should be restored
      expect(document.body.style.overflow).toBe('auto');
      expect(document.body.style.position).toBe('relative');
    });
  });

  describe('getActiveScrollLocks', () => {
    it('should return correct count', () => {
      expect(getActiveScrollLocks()).toBe(0);

      const { unmount: unmount1 } = render(<ScrollLockComponent enabled />);
      expect(getActiveScrollLocks()).toBe(1);

      const { unmount: unmount2 } = render(<ScrollLockComponent enabled />);
      expect(getActiveScrollLocks()).toBe(2);

      unmount1();
      expect(getActiveScrollLocks()).toBe(1);

      unmount2();
      expect(getActiveScrollLocks()).toBe(0);
    });
  });

  describe('resetScrollLockState', () => {
    it('should reset all state', () => {
      render(<ScrollLockComponent enabled />);
      render(<ScrollLockComponent enabled />);

      expect(getActiveScrollLocks()).toBe(2);

      resetScrollLockState();

      expect(getActiveScrollLocks()).toBe(0);
    });
  });
});
