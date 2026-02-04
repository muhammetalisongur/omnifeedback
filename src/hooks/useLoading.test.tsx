/**
 * @vitest-environment jsdom
 */

/**
 * useLoading hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useLoading } from './useLoading';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { ILoadingOptions } from '../core/types';

/**
 * Wrapper component for renderHook
 */
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider renderToasts={false} renderModals={false} renderLoadings={false}>
        {children}
      </FeedbackProvider>
    );
  };
}

describe('useLoading', () => {
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
    it('should show loading indicator and return id', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show();
      });

      expect(id!).toBeDefined();
      expect(typeof id!).toBe('string');
    });

    it('should use provided id', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ id: 'my-loading' });
      });

      expect(id!).toBe('my-loading');
    });

    it('should add loading to store', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show();
      });

      const store = useFeedbackStore.getState();
      const loading = store.get(id!);

      expect(loading).toBeDefined();
      expect(loading?.type).toBe('loading');
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show();
      });

      const store = useFeedbackStore.getState();
      const loading = store.get(id!);
      const options = loading?.options as ILoadingOptions | undefined;

      expect(options?.spinner).toBe('default');
      expect(options?.overlay).toBe(false);
      expect(options?.overlayOpacity).toBe(0.5);
      expect(options?.blur).toBe(false);
      expect(options?.blurAmount).toBe('4px');
      expect(options?.cancellable).toBe(false);
      expect(options?.size).toBe('md');
      expect(options?.variant).toBe('primary');
    });

    it('should apply custom options', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({
          message: 'Loading...',
          spinner: 'dots',
          overlay: true,
          size: 'lg',
        });
      });

      const store = useFeedbackStore.getState();
      const loading = store.get(id!);
      const options = loading?.options as ILoadingOptions | undefined;

      expect(options?.message).toBe('Loading...');
      expect(options?.spinner).toBe('dots');
      expect(options?.overlay).toBe(true);
      expect(options?.size).toBe('lg');
    });
  });

  describe('hide()', () => {
    it('should hide specific loading', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show();
      });

      act(() => {
        result.current.hide(id!);
      });

      // Allow exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const store = useFeedbackStore.getState();
      const loading = store.get(id!);

      expect(loading).toBeUndefined();
    });

    it('should only hide specified loading', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id1: string;
      let id2: string;
      act(() => {
        id1 = result.current.show({ id: 'loading-1' });
        id2 = result.current.show({ id: 'loading-2' });
      });

      act(() => {
        result.current.hide(id1!);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const store = useFeedbackStore.getState();
      expect(store.get(id1!)).toBeUndefined();
      expect(store.get(id2!)).toBeDefined();
    });
  });

  describe('hideAll()', () => {
    it('should hide all loadings', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ id: 'loading-1' });
        result.current.show({ id: 'loading-2' });
        result.current.show({ id: 'loading-3' });
      });

      expect(result.current.activeLoadings).toHaveLength(3);

      act(() => {
        result.current.hideAll();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.activeLoadings).toHaveLength(0);
    });
  });

  describe('update()', () => {
    it('should update loading options', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Step 1' });
      });

      act(() => {
        result.current.update(id!, { message: 'Step 2' });
      });

      const store = useFeedbackStore.getState();
      const loading = store.get(id!);
      const options = loading?.options as ILoadingOptions | undefined;

      expect(options?.message).toBe('Step 2');
    });

    it('should update spinner type', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ spinner: 'default' });
      });

      act(() => {
        result.current.update(id!, { spinner: 'dots' });
      });

      const store = useFeedbackStore.getState();
      const loading = store.get(id!);
      const options = loading?.options as ILoadingOptions | undefined;

      expect(options?.spinner).toBe('dots');
    });
  });

  describe('wrap()', () => {
    it('should show loading before async function executes', async () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let storeHadLoadingDuringExecution = false;
      const asyncFn = async (): Promise<string> => {
        // Check store directly since React state may not have updated yet
        const store = useFeedbackStore.getState();
        const loadings = store.getAll().filter((item) => item.type === 'loading');
        storeHadLoadingDuringExecution = loadings.length > 0;
        await Promise.resolve();
        return 'result';
      };

      await act(async () => {
        await result.current.wrap(asyncFn);
      });

      expect(storeHadLoadingDuringExecution).toBe(true);
    });

    it('should hide loading after async function completes', async () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      const asyncFn = async (): Promise<string> => {
        await Promise.resolve();
        return 'result';
      };

      await act(async () => {
        await result.current.wrap(asyncFn);
      });

      // Allow exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should return the function result', async () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      const asyncFn = async (): Promise<{ data: string }> => {
        await Promise.resolve();
        return { data: 'test' };
      };

      let fnResult: { data: string } | undefined;
      await act(async () => {
        fnResult = await result.current.wrap(asyncFn);
      });

      expect(fnResult).toEqual({ data: 'test' });
    });

    it('should hide loading even if function throws', async () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      const asyncFn = async (): Promise<never> => {
        await Promise.resolve();
        throw new Error('Test error');
      };

      await expect(
        act(async () => {
          await result.current.wrap(asyncFn);
        })
      ).rejects.toThrow('Test error');

      // Allow exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should apply options to loading', async () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let loadingOptions: ILoadingOptions | undefined;
      const asyncFn = async (): Promise<string> => {
        // Check store directly since React state may not have updated yet
        const store = useFeedbackStore.getState();
        const loadings = store.getAll().filter((item) => item.type === 'loading');
        const firstLoading = loadings[0];
        if (firstLoading) {
          loadingOptions = firstLoading.options as ILoadingOptions;
        }
        await Promise.resolve();
        return 'result';
      };

      await act(async () => {
        await result.current.wrap(asyncFn, {
          message: 'Processing...',
          spinner: 'ring',
        });
      });

      // Loading should have been created with the correct options
      expect(loadingOptions).toBeDefined();
      expect(loadingOptions?.message).toBe('Processing...');
      expect(loadingOptions?.spinner).toBe('ring');
    });
  });

  describe('isLoading', () => {
    it('should return true when loadings are active', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.show();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should return false when no loadings are active', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show();
      });

      act(() => {
        result.current.hide(id!);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('activeLoadings', () => {
    it('should return array of active loading IDs', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ id: 'loading-1' });
        result.current.show({ id: 'loading-2' });
      });

      expect(result.current.activeLoadings).toContain('loading-1');
      expect(result.current.activeLoadings).toContain('loading-2');
    });

    it('should return empty array when no loadings', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      expect(result.current.activeLoadings).toEqual([]);
    });

    it('should update when loadings change', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ id: 'loading-1' });
      });

      expect(result.current.activeLoadings).toHaveLength(1);

      act(() => {
        result.current.show({ id: 'loading-2' });
      });

      expect(result.current.activeLoadings).toHaveLength(2);

      act(() => {
        result.current.hide('loading-1');
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.activeLoadings).toHaveLength(1);
      expect(result.current.activeLoadings).toContain('loading-2');
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      // Note: In happy-dom the error message differs from jsdom
      // The important thing is that it throws when used outside provider
      expect(() => {
        renderHook(() => useLoading());
      }).toThrow();
    });
  });

  describe('Multiple loadings', () => {
    it('should handle multiple concurrent loadings', () => {
      const { result } = renderHook(() => useLoading(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ id: 'a', message: 'Loading A' });
        result.current.show({ id: 'b', message: 'Loading B' });
        result.current.show({ id: 'c', message: 'Loading C' });
      });

      expect(result.current.activeLoadings).toHaveLength(3);
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.hide('b');
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.activeLoadings).toHaveLength(2);
      expect(result.current.activeLoadings).not.toContain('b');
    });
  });
});
