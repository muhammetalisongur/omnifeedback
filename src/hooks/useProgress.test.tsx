/**
 * @vitest-environment jsdom
 */

/**
 * useProgress hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useProgress } from './useProgress';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IProgressOptions } from '../core/types';

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

describe('useProgress', () => {
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
    it('should show progress indicator and return id', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 0 });
      });

      expect(id!).toBeDefined();
      expect(typeof id!).toBe('string');
    });

    it('should add indicator to store', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50 });
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);

      expect(indicator).toBeDefined();
      expect(indicator?.type).toBe('progress');
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50 });
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.max).toBe(100);
      expect(options?.indeterminate).toBe(false);
      expect(options?.size).toBe('md');
      expect(options?.type).toBe('linear');
      expect(options?.animated).toBe(false);
      expect(options?.striped).toBe(false);
      expect(options?.showPercentage).toBe(false);
      expect(options?.variant).toBe('info');
    });

    it('should apply custom options', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({
          value: 50,
          label: 'Loading...',
          type: 'circular',
          showPercentage: true,
          variant: 'success',
        });
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.value).toBe(50);
      expect(options?.label).toBe('Loading...');
      expect(options?.type).toBe('circular');
      expect(options?.showPercentage).toBe(true);
      expect(options?.variant).toBe('success');
    });
  });

  describe('update()', () => {
    it('should update progress value', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 0 });
      });

      act(() => {
        result.current.update(id!, 50);
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.value).toBe(50);
    });

    it('should update other options alongside value', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 0, label: 'Step 1' });
      });

      act(() => {
        result.current.update(id!, 50, { label: 'Step 2' });
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.value).toBe(50);
      expect(options?.label).toBe('Step 2');
    });

    it('should call onComplete when reaching max', () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 0, onComplete });
      });

      act(() => {
        result.current.update(id!, 100);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('complete()', () => {
    it('should set value to max', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50 });
      });

      act(() => {
        result.current.complete(id!);
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.value).toBe(100);
    });

    it('should call onComplete callback', () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50, onComplete });
      });

      act(() => {
        result.current.complete(id!);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should remove indicator after delay', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50 });
      });

      act(() => {
        result.current.complete(id!);
      });

      // Before delay - should still exist
      expect(useFeedbackStore.getState().get(id!)).toBeDefined();

      // After complete delay (500ms) + exit animation delay (200ms)
      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(useFeedbackStore.getState().get(id!)).toBeUndefined();
    });

    it('should disable indeterminate mode', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 0, indeterminate: true });
      });

      act(() => {
        result.current.complete(id!);
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.indeterminate).toBe(false);
    });
  });

  describe('remove()', () => {
    it('should remove indicator', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50 });
      });

      act(() => {
        result.current.remove(id!);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const store = useFeedbackStore.getState();
      expect(store.get(id!)).toBeUndefined();
    });
  });

  describe('removeAll()', () => {
    it('should remove all indicators', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ value: 25 });
        result.current.show({ value: 50 });
        result.current.show({ value: 75 });
      });

      expect(result.current.indicators).toHaveLength(3);

      act(() => {
        result.current.removeAll();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.indicators).toHaveLength(0);
    });
  });

  describe('setIndeterminate()', () => {
    it('should enable indeterminate mode', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50 });
      });

      act(() => {
        result.current.setIndeterminate(id!, true);
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.indeterminate).toBe(true);
    });

    it('should disable indeterminate mode', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ value: 50, indeterminate: true });
      });

      act(() => {
        result.current.setIndeterminate(id!, false);
      });

      const store = useFeedbackStore.getState();
      const indicator = store.get(id!);
      const options = indicator?.options as IProgressOptions | undefined;

      expect(options?.indeterminate).toBe(false);
    });
  });

  describe('indicators', () => {
    it('should return array of active indicators', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ value: 25 });
        result.current.show({ value: 50 });
      });

      expect(result.current.indicators).toHaveLength(2);
    });

    it('should return empty array when no indicators', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      expect(result.current.indicators).toEqual([]);
    });

    it('should update when indicators change', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ value: 25 });
      });

      expect(result.current.indicators).toHaveLength(1);

      let id2: string;
      act(() => {
        id2 = result.current.show({ value: 50 });
      });

      expect(result.current.indicators).toHaveLength(2);

      act(() => {
        result.current.remove(id2!);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.indicators).toHaveLength(1);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useProgress());
      }).toThrow('useProgress must be used within FeedbackProvider');
    });
  });
});
