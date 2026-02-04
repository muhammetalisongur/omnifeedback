/**
 * Integration tests: FeedbackProvider + Hooks
 *
 * Validates that FeedbackProvider correctly provides context
 * and that all hooks work together within the provider tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FeedbackProvider, useFeedbackContext } from '@providers/FeedbackProvider';
import { FeedbackManager } from '@core/FeedbackManager';
import { useFeedbackStore } from '@core/FeedbackStore';
import { useToast } from '@hooks/useToast';
import { useModal } from '@hooks/useModal';
import { useLoading } from '@hooks/useLoading';
import { useConfirm } from '@hooks/useConfirm';
import { useFeedback } from '@hooks/useFeedback';
import type { IToastOptions, IModalOptions, IConfirmOptions } from '@core/types';

/**
 * Wrapper component that disables all container rendering
 * to isolate hook behavior from UI rendering.
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

describe('Integration: FeedbackProvider + Hooks', () => {
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

  // ==================== PROVIDER RENDERING ====================

  describe('FeedbackProvider renders children', () => {
    it('should render child components within the provider', () => {
      render(
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
          <div data-testid="child-content">Hello OmniFeedback</div>
        </FeedbackProvider>
      );

      expect(screen.getByTestId('child-content')).toBeDefined();
      expect(screen.getByTestId('child-content').textContent).toBe('Hello OmniFeedback');
    });

    it('should render multiple children correctly', () => {
      render(
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
          <div data-testid="first-child">First</div>
          <div data-testid="second-child">Second</div>
        </FeedbackProvider>
      );

      expect(screen.getByTestId('first-child')).toBeDefined();
      expect(screen.getByTestId('second-child')).toBeDefined();
    });
  });

  // ==================== CONTEXT ACCESS ====================

  describe('useFeedbackContext throws without provider', () => {
    it('should throw an error when used outside FeedbackProvider', () => {
      // Suppress console.error for the expected error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useFeedbackContext());
      }).toThrow('useFeedbackContext must be used within a FeedbackProvider');

      consoleSpy.mockRestore();
    });

    it('should provide manager and config when used within provider', () => {
      const { result } = renderHook(() => useFeedbackContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.manager).toBeDefined();
      expect(result.current.config).toBeDefined();
      expect(result.current.config.defaultDuration).toBeGreaterThan(0);
    });
  });

  // ==================== useToast WITHIN PROVIDER ====================

  describe('useToast works within provider (show, dismiss)', () => {
    it('should show a toast and add it to the store', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Integration test toast' });
      });

      expect(id!).toBeTruthy();

      const store = useFeedbackStore.getState();
      const item = store.get(id!);
      expect(item).toBeDefined();
      expect(item?.type).toBe('toast');
      expect((item?.options as IToastOptions).message).toBe('Integration test toast');
    });

    it('should dismiss a toast and transition to exiting status', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Dismissable toast' });
      });

      // Wait for entering -> visible
      act(() => {
        vi.advanceTimersByTime(config.enterAnimationDuration);
      });

      act(() => {
        result.current.dismiss(id!);
      });

      const item = useFeedbackStore.getState().get(id!);
      expect(item?.status).toBe('exiting');
    });

    it('should show variant toasts (success, error, warning, info)', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      const ids: string[] = [];
      act(() => {
        ids.push(result.current.success('Success message'));
        ids.push(result.current.error('Error message'));
        ids.push(result.current.warning('Warning message'));
        ids.push(result.current.info('Info message'));
      });

      const store = useFeedbackStore.getState();

      const successToast = store.get(ids[0]!)?.options as IToastOptions;
      expect(successToast.variant).toBe('success');

      const errorToast = store.get(ids[1]!)?.options as IToastOptions;
      expect(errorToast.variant).toBe('error');

      const warningToast = store.get(ids[2]!)?.options as IToastOptions;
      expect(warningToast.variant).toBe('warning');

      const infoToast = store.get(ids[3]!)?.options as IToastOptions;
      expect(infoToast.variant).toBe('info');
    });

    it('should dismiss all toasts at once', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      act(() => {
        result.current.show({ message: 'Toast A' });
        result.current.show({ message: 'Toast B' });
        result.current.show({ message: 'Toast C' });
      });

      // Wait for entering -> visible
      act(() => {
        vi.advanceTimersByTime(config.enterAnimationDuration);
      });

      act(() => {
        result.current.dismissAll();
      });

      const toasts = useFeedbackStore.getState().getByType('toast');
      expect(toasts.every((t) => t.status === 'exiting')).toBe(true);
    });
  });

  // ==================== useModal WITHIN PROVIDER ====================

  describe('useModal works within provider (open, close)', () => {
    it('should open a modal and add it to the store', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({
          title: 'Test Modal',
          content: 'Modal content',
        });
      });

      expect(id!).toBeTruthy();

      const store = useFeedbackStore.getState();
      const item = store.get(id!);
      expect(item).toBeDefined();
      expect(item?.type).toBe('modal');
      expect((item?.options as IModalOptions).title).toBe('Test Modal');
    });

    it('should close a modal and transition to exiting status', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      let id: string;
      act(() => {
        id = result.current.open({
          title: 'Closable Modal',
          content: 'Content',
        });
      });

      // Wait for entering -> visible
      act(() => {
        vi.advanceTimersByTime(config.enterAnimationDuration);
      });

      act(() => {
        result.current.close(id!);
      });

      const item = useFeedbackStore.getState().get(id!);
      expect(item?.status).toBe('exiting');
    });

    it('should track open modals via isOpen and openModals', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      // Initially no modals open
      expect(result.current.isOpen).toBe(false);
      expect(result.current.openModals).toHaveLength(0);

      act(() => {
        result.current.open({
          title: 'Tracked Modal',
          content: 'Content',
        });
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.openModals).toHaveLength(1);
    });

    it('should close all modals via closeAll', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      act(() => {
        result.current.open({ title: 'Modal 1', content: 'Content 1' });
      });

      // Wait for entering -> visible
      act(() => {
        vi.advanceTimersByTime(config.enterAnimationDuration);
      });

      act(() => {
        result.current.closeAll();
      });

      const modals = useFeedbackStore.getState().getByType('modal');
      const activeModals = modals.filter((m) => m.status !== 'exiting' && m.status !== 'removed');
      expect(activeModals).toHaveLength(0);
    });
  });

  // ==================== useLoading WITHIN PROVIDER ====================

  describe('useLoading works within provider (show, hide)', () => {
    it('should show a loading indicator and add it to the store', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Loading data...' });
      });

      expect(id!).toBeTruthy();

      const store = useFeedbackStore.getState();
      const item = store.get(id!);
      expect(item).toBeDefined();
      expect(item?.type).toBe('loading');
    });

    it('should hide a loading indicator', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Loading...' });
      });

      // Wait for entering -> visible
      act(() => {
        vi.advanceTimersByTime(config.enterAnimationDuration);
      });

      act(() => {
        result.current.hide(id!);
      });

      const item = useFeedbackStore.getState().get(id!);
      expect(item?.status).toBe('exiting');
    });

    it('should track isLoading state correctly', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.show({ message: 'Processing...' });
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should wrap async function with loading indicator', async () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      const asyncFn = vi.fn().mockResolvedValue('done');

      let returnValue: string;
      await act(async () => {
        returnValue = await result.current.wrap(asyncFn, { message: 'Working...' });
      });

      expect(returnValue!).toBe('done');
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== useConfirm WITHIN PROVIDER ====================

  describe('useConfirm works within provider', () => {
    it('should show a confirm dialog and add it to the store', () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Are you sure?' });
      });

      const store = useFeedbackStore.getState();
      const confirms = store.getByType('confirm');
      expect(confirms).toHaveLength(1);
      expect((confirms[0]?.options as IConfirmOptions).message).toBe('Are you sure?');
    });

    it('should resolve with true when confirmed', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Confirm this action?' });
      });

      // Get confirm from store and trigger onConfirm
      const store = useFeedbackStore.getState();
      const confirm = store.getByType('confirm')[0];
      const options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onConfirm();
      });

      // Wait for exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const resolved = await promise!;
      expect(resolved).toBe(true);
    });

    it('should resolve with false when cancelled', async () => {
      const { result } = renderHook(() => useConfirm(), {
        wrapper: createWrapper(),
      });

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.show({ message: 'Cancel this action?' });
      });

      const store = useFeedbackStore.getState();
      const confirm = store.getByType('confirm')[0];
      const options = confirm?.options as IConfirmOptions;

      act(() => {
        options.onCancel?.();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const resolved = await promise!;
      expect(resolved).toBe(false);
    });
  });

  // ==================== useFeedback COMBINED HOOK ====================

  describe('useFeedback combined hook returns all hooks', () => {
    it('should return toast, modal, loading, confirm, and all other hooks', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      const feedback = result.current;

      // Verify all hook namespaces are present
      expect(feedback.toast).toBeDefined();
      expect(feedback.modal).toBeDefined();
      expect(feedback.loading).toBeDefined();
      expect(feedback.alert).toBeDefined();
      expect(feedback.progress).toBeDefined();
      expect(feedback.confirm).toBeDefined();
      expect(feedback.banner).toBeDefined();
      expect(feedback.drawer).toBeDefined();
      expect(feedback.popconfirm).toBeDefined();
      expect(feedback.skeleton).toBeDefined();
      expect(feedback.result).toBeDefined();
      expect(feedback.connection).toBeDefined();
      expect(feedback.prompt).toBeDefined();
      expect(feedback.sheet).toBeDefined();
    });

    it('should provide functional toast methods through combined hook', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      // Verify toast methods
      expect(typeof result.current.toast.show).toBe('function');
      expect(typeof result.current.toast.success).toBe('function');
      expect(typeof result.current.toast.error).toBe('function');
      expect(typeof result.current.toast.dismiss).toBe('function');
      expect(typeof result.current.toast.dismissAll).toBe('function');
    });

    it('should allow using multiple hooks from combined hook in same flow', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.toast.success('Toast from combined hook');
        result.current.loading.show({ message: 'Loading from combined hook' });
      });

      const store = useFeedbackStore.getState();
      const toasts = store.getByType('toast');
      const loadings = store.getByType('loading');

      expect(toasts).toHaveLength(1);
      expect(loadings).toHaveLength(1);
    });
  });
});
