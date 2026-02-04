/**
 * Integration tests: Confirm Promise Flow
 *
 * Validates the Promise-based confirmation dialog lifecycle
 * through Manager -> Store -> Hook resolution flow.
 * Tests that show() returns a Promise, confirm resolves with true,
 * cancel resolves with false, and danger variant renders correctly.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FeedbackProvider } from '@providers/FeedbackProvider';
import { FeedbackManager } from '@core/FeedbackManager';
import { useFeedbackStore } from '@core/FeedbackStore';
import { useConfirm } from '@hooks/useConfirm';
import type { IConfirmOptions } from '@core/types';

/**
 * Wrapper component that disables all container rendering
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
        renderSheets={false}
      >
        {children}
      </FeedbackProvider>
    );
  };
}

/**
 * Helper to extract the first confirm item from the store
 */
function getFirstConfirmFromStore() {
  const store = useFeedbackStore.getState();
  const confirms = Array.from(store.items.values()).filter(
    (item) => item.type === 'confirm' && item.status !== 'removed'
  );
  return confirms[0];
}

describe('Integration: Confirm Promise Flow', () => {
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

  // ==================== PROMISE RETURN ====================

  describe('confirm.show() returns a Promise', () => {
    it('should return a Promise instance from show()', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Promise return test' });
      });

      expect(promise!).toBeInstanceOf(Promise);
    });

    it('should add a confirm item to the store when show() is called', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Store addition test' });
      });

      const confirm = getFirstConfirmFromStore();
      expect(confirm).toBeDefined();
      expect(confirm?.type).toBe('confirm');
    });

    it('should store the message and default options', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({
          message: 'Do you want to proceed?',
          title: 'Confirmation Required',
        });
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      expect(options.message).toBe('Do you want to proceed?');
      expect(options.title).toBe('Confirmation Required');
      expect(options.confirmText).toBe('Confirm'); // default
      expect(options.cancelText).toBe('Cancel');   // default
    });

    it('should keep the promise pending until user responds', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let resolved = false;
      act(() => {
        result.current.show({ message: 'Pending test' }).then(() => {
          resolved = true;
        });
      });

      // Without user action, promise should remain unresolved
      expect(resolved).toBe(false);
    });
  });

  // ==================== CONFIRM RESOLVES TRUE ====================

  describe('Clicking confirm resolves with true', () => {
    it('should resolve the promise with true when onConfirm is called', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Confirm resolution test' });
      });

      // Simulate user clicking the confirm button
      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onConfirm();
      });

      // Wait for exit animation to complete
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const resolvedValue = await promise!;
      expect(resolvedValue).toBe(true);
    });

    it('should remove the confirm from the store after confirming', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Cleanup after confirm' });
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onConfirm();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify confirm is removed from store
      const remainingConfirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'confirm' && item.status !== 'removed'
      );
      expect(remainingConfirms).toHaveLength(0);
    });

    it('should emit correct events when confirmed', async () => {
      const manager = FeedbackManager.getInstance();
      const statusHandler = vi.fn();
      const removedHandler = vi.fn();
      manager.on('feedback:statusChanged', statusHandler);
      manager.on('feedback:removed', removedHandler);

      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Event emission test' });
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onConfirm();
      });

      // Verify exiting status change was emitted
      expect(statusHandler).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'exiting' })
      );

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(removedHandler).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== CANCEL RESOLVES FALSE ====================

  describe('Clicking cancel resolves with false', () => {
    it('should resolve the promise with false when onCancel is called', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Cancel resolution test' });
      });

      // Simulate user clicking the cancel button
      const confirm = getFirstConfirmFromStore();
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

    it('should remove the confirm from the store after cancelling', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Cleanup after cancel' });
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onCancel?.();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const remainingConfirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'confirm' && item.status !== 'removed'
      );
      expect(remainingConfirms).toHaveLength(0);
    });
  });

  // ==================== DANGER VARIANT ====================

  describe('Danger variant renders correctly', () => {
    it('should set confirmVariant to danger when using danger()', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.danger('This will permanently delete your data.');
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      expect(options.confirmVariant).toBe('danger');
      expect(options.message).toBe('This will permanently delete your data.');
    });

    it('should apply default danger title and confirm text', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.danger('Delete all records?');
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      expect(options.title).toBe('Are you sure?');
      expect(options.confirmText).toBe('Delete');
    });

    it('should allow custom title and text for danger variant', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.danger('Remove this user permanently?', {
          title: 'Remove User',
          confirmText: 'Yes, Remove',
          cancelText: 'Keep User',
        });
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      expect(options.title).toBe('Remove User');
      expect(options.confirmText).toBe('Yes, Remove');
      expect(options.cancelText).toBe('Keep User');
      expect(options.confirmVariant).toBe('danger');
    });

    it('should resolve danger confirm with true when confirmed', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.danger('Delete everything?');
      });

      const confirm = getFirstConfirmFromStore();
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

    it('should resolve danger confirm with false when cancelled', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.danger('Delete everything?');
      });

      const confirm = getFirstConfirmFromStore();
      const options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onCancel?.();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const resolvedValue = await promise!;
      expect(resolvedValue).toBe(false);
    });
  });

  // ==================== SEQUENTIAL CONFIRMS ====================

  describe('Sequential confirm dialogs', () => {
    it('should handle multiple sequential confirm operations', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      // First confirm - user confirms
      let promise1: Promise<boolean>;
      act(() => {
        promise1 = result.current.show({ message: 'First action' });
      });

      let confirm = getFirstConfirmFromStore();
      let options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onConfirm();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const result1 = await promise1!;
      expect(result1).toBe(true);

      // Second confirm - user cancels
      let promise2: Promise<boolean>;
      act(() => {
        promise2 = result.current.show({ message: 'Second action' });
      });

      confirm = getFirstConfirmFromStore();
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

    it('should close confirm dialog by ID without resolution', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Close test' });
      });

      const confirm = getFirstConfirmFromStore();
      const id = confirm?.id;

      // Close via the close method (without resolving the promise)
      act(() => {
        result.current.close(id!);
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const remainingConfirms = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'confirm' && item.status !== 'removed'
      );
      expect(remainingConfirms).toHaveLength(0);
    });
  });
});
