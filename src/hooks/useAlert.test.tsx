/**
 * useAlert hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useAlert } from './useAlert';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IAlertOptions } from '../core/types';

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

describe('useAlert', () => {
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
    it('should show alert and return id', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test alert' });
      });

      expect(id!).toBeDefined();
      expect(typeof id!).toBe('string');
    });

    it('should add alert to store', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test alert' });
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);

      expect(alert).toBeDefined();
      expect(alert?.type).toBe('alert');
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test alert' });
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.dismissible).toBe(true);
      expect(options?.duration).toBe(0);
      expect(options?.bordered).toBe(true);
      expect(options?.filled).toBe(false);
      expect(options?.hideIcon).toBe(false);
      expect(options?.variant).toBe('default');
    });

    it('should apply custom options', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({
          message: 'Test alert',
          title: 'Title',
          variant: 'success',
          dismissible: false,
          bordered: false,
          filled: true,
        });
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.message).toBe('Test alert');
      expect(options?.title).toBe('Title');
      expect(options?.variant).toBe('success');
      expect(options?.dismissible).toBe(false);
      expect(options?.bordered).toBe(false);
      expect(options?.filled).toBe(true);
    });
  });

  describe('Variant shortcuts', () => {
    it('should show success alert', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.success('Success message');
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.message).toBe('Success message');
      expect(options?.variant).toBe('success');
    });

    it('should show error alert', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.error('Error message');
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.message).toBe('Error message');
      expect(options?.variant).toBe('error');
    });

    it('should show warning alert', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.warning('Warning message');
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.message).toBe('Warning message');
      expect(options?.variant).toBe('warning');
    });

    it('should show info alert', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.info('Info message');
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.message).toBe('Info message');
      expect(options?.variant).toBe('info');
    });

    it('should allow custom options with variant shortcuts', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.success('Success', { title: 'Custom Title' });
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.title).toBe('Custom Title');
      expect(options?.variant).toBe('success');
    });
  });

  describe('dismiss()', () => {
    it('should dismiss specific alert', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test alert' });
      });

      act(() => {
        result.current.dismiss(id!);
      });

      // Allow exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const store = useFeedbackStore.getState();
      expect(store.get(id!)).toBeUndefined();
    });

    it('should call onDismiss callback', () => {
      const onDismiss = vi.fn();
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test alert', onDismiss });
      });

      act(() => {
        result.current.dismiss(id!);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should only dismiss specified alert', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id1: string;
      let id2: string;
      act(() => {
        id1 = result.current.show({ message: 'Alert 1' });
        id2 = result.current.show({ message: 'Alert 2' });
      });

      act(() => {
        result.current.dismiss(id1!);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const store = useFeedbackStore.getState();
      expect(store.get(id1!)).toBeUndefined();
      expect(store.get(id2!)).toBeDefined();
    });
  });

  describe('dismissAll()', () => {
    it('should dismiss all alerts', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Alert 1' });
        result.current.show({ message: 'Alert 2' });
        result.current.show({ message: 'Alert 3' });
      });

      expect(result.current.alerts).toHaveLength(3);

      act(() => {
        result.current.dismissAll();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.alerts).toHaveLength(0);
    });
  });

  describe('update()', () => {
    it('should update alert message', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Original message' });
      });

      act(() => {
        result.current.update(id!, { message: 'Updated message' });
      });

      const store = useFeedbackStore.getState();
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.message).toBe('Updated message');
    });

    it('should update alert variant', () => {
      const { result } = renderHook(() => useAlert(), {
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
      const alert = store.get(id!);
      const options = alert?.options as IAlertOptions | undefined;

      expect(options?.variant).toBe('success');
    });
  });

  describe('alerts', () => {
    it('should return array of active alerts', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Alert 1' });
        result.current.show({ message: 'Alert 2' });
      });

      expect(result.current.alerts).toHaveLength(2);
    });

    it('should return empty array when no alerts', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      expect(result.current.alerts).toEqual([]);
    });

    it('should update when alerts change', () => {
      const { result } = renderHook(() => useAlert(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Alert 1' });
      });

      expect(result.current.alerts).toHaveLength(1);

      let id2: string;
      act(() => {
        id2 = result.current.show({ message: 'Alert 2' });
      });

      expect(result.current.alerts).toHaveLength(2);

      act(() => {
        result.current.dismiss(id2!);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.alerts).toHaveLength(1);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useAlert());
      }).toThrow('useAlert must be used within FeedbackProvider');
    });
  });
});
