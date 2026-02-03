/**
 * useToast hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useToast } from './useToast';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IToastOptions } from '../core/types';

// Wrapper component for renderHook
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider renderToasts={false}>
        {children}
      </FeedbackProvider>
    );
  };
}

describe('useToast', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useRealTimers();
  });

  describe('show()', () => {
    it('should add toast and return id', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test toast' });
      });

      expect(id!).toBeTruthy();
      expect(id!.startsWith('toast_')).toBe(true);

      const store = useFeedbackStore.getState();
      expect(store.get(id!)).toBeDefined();
    });

    it('should use provided id', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ id: 'custom-id', message: 'Test' });
      });

      expect(id!).toBe('custom-id');
    });
  });

  describe('success()', () => {
    it('should add success toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.success('Success message');
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.message).toBe('Success message');
      expect(options?.variant).toBe('success');
    });

    it('should merge additional options', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.success('Success', { duration: 10000 });
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.duration).toBe(10000);
    });
  });

  describe('error()', () => {
    it('should add error toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.error('Error message');
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.message).toBe('Error message');
      expect(options?.variant).toBe('error');
    });
  });

  describe('warning()', () => {
    it('should add warning toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.warning('Warning message');
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.message).toBe('Warning message');
      expect(options?.variant).toBe('warning');
    });
  });

  describe('info()', () => {
    it('should add info toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.info('Info message');
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.message).toBe('Info message');
      expect(options?.variant).toBe('info');
    });
  });

  describe('loading()', () => {
    it('should add loading toast with no auto-dismiss', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.loading('Loading...');
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.message).toBe('Loading...');
      expect(options?.duration).toBe(0);
      expect(options?.dismissible).toBe(false);
    });
  });

  describe('dismiss()', () => {
    it('should dismiss specific toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test' });
      });

      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      // Wait for entering -> visible
      act(() => {
        vi.advanceTimersByTime(config.enterAnimationDuration);
      });

      act(() => {
        result.current.dismiss(id!);
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);

      expect(toast?.status).toBe('exiting');
    });
  });

  describe('dismissAll()', () => {
    it('should dismiss all toasts', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Toast 1' });
        result.current.show({ message: 'Toast 2' });
        result.current.show({ message: 'Toast 3' });
      });

      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      // Wait for entering -> visible
      act(() => {
        vi.advanceTimersByTime(config.enterAnimationDuration);
      });

      act(() => {
        result.current.dismissAll();
      });

      const store = useFeedbackStore.getState();
      const toasts = store.getByType('toast');

      // All should be exiting
      expect(toasts.every((t) => t.status === 'exiting')).toBe(true);
    });
  });

  describe('update()', () => {
    it('should update toast options', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Original' });
      });

      act(() => {
        result.current.update(id!, { message: 'Updated' });
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.message).toBe('Updated');
    });

    it('should update variant', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test', variant: 'info' });
      });

      act(() => {
        result.current.update(id!, { variant: 'success' });
      });

      const store = useFeedbackStore.getState();
      const toast = store.get(id!);
      const options = toast?.options as IToastOptions | undefined;

      expect(options?.variant).toBe('success');
    });
  });

  describe('promise()', () => {
    it('should show loading toast then success on resolve', async () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      const promise = Promise.resolve({ data: 'result' });

      let promiseResult: { data: string };
      await act(async () => {
        promiseResult = await result.current.promise(promise, {
          loading: 'Loading...',
          success: 'Done!',
          error: 'Failed',
        });
      });

      expect(promiseResult!.data).toBe('result');

      const store = useFeedbackStore.getState();
      const toasts = store.getByType('toast');

      // Loading toast should be dismissed, success toast should exist
      const successToast = toasts.find((t) => t.options.message === 'Done!');
      expect(successToast).toBeDefined();
      expect(successToast?.options.variant).toBe('success');
    });

    it('should show loading toast then error on reject', async () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      const error = new Error('Something went wrong');
      const promise = Promise.reject(error);

      await act(async () => {
        try {
          await result.current.promise(promise, {
            loading: 'Loading...',
            success: 'Done!',
            error: 'Failed',
          });
        } catch {
          // Expected
        }
      });

      const store = useFeedbackStore.getState();
      const toasts = store.getByType('toast');

      // Error toast should exist
      const errorToast = toasts.find((t) => t.options.message === 'Failed');
      expect(errorToast).toBeDefined();
      expect(errorToast?.options.variant).toBe('error');
    });

    it('should use function for success message', async () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      const promise = Promise.resolve({ name: 'Test File' });

      await act(async () => {
        await result.current.promise(promise, {
          loading: 'Uploading...',
          success: (data) => `Uploaded: ${data.name}`,
          error: 'Failed',
        });
      });

      const store = useFeedbackStore.getState();
      const toasts = store.getByType('toast');

      const successToast = toasts.find((t) =>
        t.options.message === 'Uploaded: Test File'
      );
      expect(successToast).toBeDefined();
    });

    it('should use function for error message', async () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(),
      });

      const error = new Error('Network error');
      const promise = Promise.reject(error);

      await act(async () => {
        try {
          await result.current.promise(promise, {
            loading: 'Loading...',
            success: 'Done!',
            error: (err) => `Error: ${err.message}`,
          });
        } catch {
          // Expected
        }
      });

      const store = useFeedbackStore.getState();
      const toasts = store.getByType('toast');

      const errorToast = toasts.find((t) =>
        t.options.message === 'Error: Network error'
      );
      expect(errorToast).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useFeedbackContext must be used within a FeedbackProvider');
    });
  });
});
