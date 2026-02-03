/**
 * @vitest-environment jsdom
 */

/**
 * usePopconfirm hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { usePopconfirm } from './usePopconfirm';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IPopconfirmOptions } from '../core/types';

/**
 * Wrapper component for renderHook
 */
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider
        renderToasts={false}
        renderModals={false}
        renderLoadings={false}
        renderConfirms={false}
        renderBanners={false}
        renderDrawers={false}
        renderPopconfirms={false}
      >
        {children}
      </FeedbackProvider>
    );
  };
}

/**
 * Create mock target element
 */
function createMockTarget(): HTMLElement {
  const element = document.createElement('button');
  element.getBoundingClientRect = () => ({
    top: 200,
    left: 100,
    right: 200,
    bottom: 240,
    width: 100,
    height: 40,
    x: 100,
    y: 200,
    toJSON: () => ({}),
  });
  return element;
}

describe('usePopconfirm', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('show()', () => {
    it('should add popconfirm to store and return promise', async () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({
          target,
          message: 'Are you sure?',
        });
      });

      const store = useFeedbackStore.getState();
      const popconfirms = Array.from(store.items.values()).filter(
        (item) => item.type === 'popconfirm'
      );

      expect(popconfirms).toHaveLength(1);
      expect(popconfirms[0]?.options).toHaveProperty('message', 'Are you sure?');
      expect(promise!).toBeInstanceOf(Promise);
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      act(() => {
        result.current.show({ target, message: 'Test message' });
      });

      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions | undefined;

      expect(options?.confirmText).toBe('Yes');
      expect(options?.cancelText).toBe('No');
      expect(options?.confirmVariant).toBe('primary');
      expect(options?.placement).toBe('top');
      expect(options?.showArrow).toBe(true);
      expect(options?.offset).toBe(8);
      expect(options?.closeOnClickOutside).toBe(true);
    });

    it('should apply custom options', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      act(() => {
        result.current.show({
          target,
          message: 'Test message',
          title: 'Custom Title',
          confirmText: 'Delete',
          cancelText: 'Keep',
          confirmVariant: 'danger',
          placement: 'bottom',
        });
      });

      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions | undefined;

      expect(options?.title).toBe('Custom Title');
      expect(options?.confirmText).toBe('Delete');
      expect(options?.cancelText).toBe('Keep');
      expect(options?.confirmVariant).toBe('danger');
      expect(options?.placement).toBe('bottom');
    });

    it('should resolve true when onConfirm is called', async () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ target, message: 'Test' });
      });

      // Get the popconfirm from store and call onConfirm
      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions;

      act(() => {
        options.onConfirm();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const resolvedValue = await promise!;
      expect(resolvedValue).toBe(true);
    });

    it('should resolve false when onCancel is called', async () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ target, message: 'Test' });
      });

      // Get the popconfirm from store and call onCancel
      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions;

      act(() => {
        options.onCancel?.();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const resolvedValue = await promise!;
      expect(resolvedValue).toBe(false);
    });

    it('should remove popconfirm from store after resolution', async () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      act(() => {
        result.current.show({ target, message: 'Test' });
      });

      // Verify popconfirm exists
      let popconfirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'popconfirm'
      );
      expect(popconfirms).toHaveLength(1);

      // Call onConfirm
      const options = popconfirms[0]!.options as IPopconfirmOptions;
      act(() => {
        options.onConfirm();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify popconfirm is removed
      popconfirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'popconfirm' && item.status !== 'removed'
      );
      expect(popconfirms).toHaveLength(0);
    });
  });

  describe('danger()', () => {
    it('should show danger popconfirm with default options', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      act(() => {
        result.current.danger(target, 'This action cannot be undone');
      });

      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions | undefined;

      expect(options?.message).toBe('This action cannot be undone');
      expect(options?.confirmText).toBe('Delete');
      expect(options?.confirmVariant).toBe('danger');
    });

    it('should allow custom options with danger()', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      act(() => {
        result.current.danger(target, 'Delete account?', {
          title: 'Delete Account',
          confirmText: 'Yes, Delete',
        });
      });

      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions | undefined;

      expect(options?.title).toBe('Delete Account');
      expect(options?.confirmText).toBe('Yes, Delete');
      expect(options?.confirmVariant).toBe('danger');
    });

    it('should resolve true on confirm', async () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.danger(target, 'Delete?');
      });

      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions;

      act(() => {
        options.onConfirm();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const resolvedValue = await promise!;
      expect(resolvedValue).toBe(true);
    });
  });

  describe('close()', () => {
    it('should remove popconfirm when close is called', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      act(() => {
        result.current.show({ target, message: 'Test' });
      });

      // Verify popconfirm exists
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify popconfirm is removed
      const popconfirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'popconfirm' && item.status !== 'removed'
      );
      expect(popconfirms).toHaveLength(0);
    });
  });

  describe('isOpen', () => {
    it('should return false when no popconfirm is open', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should return true when popconfirm is open', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      act(() => {
        result.current.show({ target, message: 'Test' });
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => usePopconfirm());
      }).toThrow('usePopconfirm must be used within FeedbackProvider');
    });
  });

  describe('Single Popconfirm', () => {
    it('should only show one popconfirm at a time', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target1 = createMockTarget();
      const target2 = createMockTarget();

      // Show first popconfirm
      act(() => {
        result.current.show({ target: target1, message: 'First' });
      });

      // Show second popconfirm (should replace first)
      act(() => {
        result.current.show({ target: target2, message: 'Second' });
      });

      // Should only have one popconfirm
      const popconfirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'popconfirm' && item.status !== 'removed'
      );
      expect(popconfirms).toHaveLength(1);
      expect((popconfirms[0]?.options as IPopconfirmOptions).message).toBe('Second');
    });
  });

  describe('RefObject target', () => {
    it('should work with RefObject target', () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const element = createMockTarget();
      const refTarget = { current: element };

      act(() => {
        result.current.show({
          target: refTarget,
          message: 'Test with ref',
        });
      });

      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );

      expect(popconfirm).toBeDefined();
      expect((popconfirm?.options as IPopconfirmOptions).target).toBe(refTarget);
    });
  });

  describe('Delete Action Scenario', () => {
    it('should implement delete confirmation flow', async () => {
      const { result } = renderHook(() => usePopconfirm(), {
        wrapper: createWrapper(),
      });

      const target = createMockTarget();

      // User clicks delete button
      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.danger(target, 'Delete this item?');
      });

      // Verify popconfirm is shown
      expect(result.current.isOpen).toBe(true);

      // User clicks confirm
      const store = useFeedbackStore.getState();
      const popconfirm = Array.from(store.items.values()).find(
        (item) => item.type === 'popconfirm'
      );
      const options = popconfirm?.options as IPopconfirmOptions;

      act(() => {
        options.onConfirm();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify confirmation result
      const confirmed = await promise!;
      expect(confirmed).toBe(true);
    });
  });
});
