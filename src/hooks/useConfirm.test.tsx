/**
 * @vitest-environment jsdom
 */

/**
 * useConfirm hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useConfirm } from './useConfirm';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IConfirmOptions } from '../core/types';

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
      >
        {children}
      </FeedbackProvider>
    );
  };
}

describe('useConfirm', () => {
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
    it('should add confirm to store and return promise', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Are you sure?' });
      });

      const store = useFeedbackStore.getState();
      const confirms = Array.from(store.items.values()).filter(
        (item) => item.type === 'confirm'
      );

      expect(confirms).toHaveLength(1);
      expect(confirms[0]?.options).toHaveProperty('message', 'Are you sure?');
      expect(promise!).toBeInstanceOf(Promise);
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Test message' });
      });

      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const options = confirm?.options as IConfirmOptions | undefined;

      expect(options?.confirmText).toBe('Confirm');
      expect(options?.cancelText).toBe('Cancel');
      expect(options?.confirmVariant).toBe('primary');
    });

    it('should apply custom options', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({
          message: 'Test message',
          title: 'Custom Title',
          confirmText: 'Yes',
          cancelText: 'No',
          confirmVariant: 'danger',
        });
      });

      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const options = confirm?.options as IConfirmOptions | undefined;

      expect(options?.title).toBe('Custom Title');
      expect(options?.confirmText).toBe('Yes');
      expect(options?.cancelText).toBe('No');
      expect(options?.confirmVariant).toBe('danger');
    });

    it('should resolve true when onConfirm is called', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Test' });
      });

      // Get the confirm from store and call onConfirm
      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const options = confirm?.options as IConfirmOptions;

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
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Test' });
      });

      // Get the confirm from store and call onCancel
      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const options = confirm?.options as IConfirmOptions;

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

    it('should remove confirm from store after resolution', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Test' });
      });

      // Verify confirm exists
      let confirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'confirm'
      );
      expect(confirms).toHaveLength(1);

      // Call onConfirm
      const options = confirms[0]!.options as IConfirmOptions;
      act(() => {
        options.onConfirm();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify confirm is removed
      confirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'confirm' && item.status !== 'removed'
      );
      expect(confirms).toHaveLength(0);
    });
  });

  describe('danger()', () => {
    it('should show danger confirm with default options', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.danger('This will delete your data');
      });

      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const options = confirm?.options as IConfirmOptions | undefined;

      expect(options?.message).toBe('This will delete your data');
      expect(options?.title).toBe('Are you sure?');
      expect(options?.confirmText).toBe('Delete');
      expect(options?.confirmVariant).toBe('danger');
    });

    it('should allow custom options with danger()', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.danger('Delete account?', {
          title: 'Delete Account',
          confirmText: 'Yes, Delete',
        });
      });

      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const options = confirm?.options as IConfirmOptions | undefined;

      expect(options?.title).toBe('Delete Account');
      expect(options?.confirmText).toBe('Yes, Delete');
      expect(options?.confirmVariant).toBe('danger');
    });

    it('should resolve true on confirm', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.danger('Delete?');
      });

      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const options = confirm?.options as IConfirmOptions;

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
    it('should remove confirm by id', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      // First, we need to capture the id somehow
      // Since show() returns a Promise, we get the id from store
      act(() => {
        result.current.show({ message: 'Test' });
      });

      const store = useFeedbackStore.getState();
      const confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      const id = confirm?.id;

      act(() => {
        result.current.close(id!);
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const confirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'confirm' && item.status !== 'removed'
      );
      expect(confirms).toHaveLength(0);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useConfirm());
      }).toThrow('useConfirm must be used within FeedbackProvider');
    });
  });

  describe('Multiple confirms', () => {
    it('should handle multiple sequential confirms', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      // First confirm
      let promise1: Promise<boolean>;
      act(() => {
        promise1 = result.current.show({ message: 'First confirm' });
      });

      // Confirm the first
      let store = useFeedbackStore.getState();
      let confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm'
      );
      let options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onConfirm();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const result1 = await promise1!;
      expect(result1).toBe(true);

      // Second confirm
      let promise2: Promise<boolean>;
      act(() => {
        promise2 = result.current.show({ message: 'Second confirm' });
      });

      // Cancel the second
      store = useFeedbackStore.getState();
      confirm = Array.from(store.items.values()).find(
        (item) => item.type === 'confirm' && item.status !== 'removed'
      );
      options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onCancel?.();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const result2 = await promise2!;
      expect(result2).toBe(false);
    });
  });
});
