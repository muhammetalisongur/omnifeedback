/**
 * useModal hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useModal } from './useModal';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IModalOptions } from '../core/types';

// Wrapper component for renderHook
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider renderToasts={false} renderModals={false}>
        {children}
      </FeedbackProvider>
    );
  };
}

describe('useModal', () => {
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

  describe('open()', () => {
    it('should open modal and return id', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <p>Test</p> });
      });

      expect(id!).toBeDefined();
      expect(typeof id!).toBe('string');
    });

    it('should use provided id', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ id: 'my-modal', content: <p>Test</p> });
      });

      expect(id!).toBe('my-modal');
    });

    it('should add modal to store', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <p>Test</p> });
      });

      const store = useFeedbackStore.getState();
      const modal = store.get(id!);

      expect(modal).toBeDefined();
      expect(modal?.type).toBe('modal');
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <p>Test</p> });
      });

      const store = useFeedbackStore.getState();
      const modal = store.get(id!);
      const options = modal?.options as IModalOptions | undefined;

      expect(options?.size).toBe('md');
      expect(options?.closable).toBe(true);
      expect(options?.closeOnBackdropClick).toBe(true);
      expect(options?.closeOnEscape).toBe(true);
      expect(options?.preventScroll).toBe(true);
    });

    it('should call onOpen callback', () => {
      const onOpen = vi.fn();
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <p>Test</p>, onOpen });
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('close()', () => {
    it('should close specific modal', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <p>Test</p> });
      });

      act(() => {
        result.current.close(id!);
      });

      // Allow exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const store = useFeedbackStore.getState();
      const modal = store.get(id!);

      expect(modal).toBeUndefined();
    });

    it('should call onClose callback', () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <p>Test</p>, onClose });
      });

      act(() => {
        result.current.close(id!);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('closeAll()', () => {
    it('should close all modals', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ id: 'modal-1', content: <p>Modal 1</p> });
        result.current.open({ id: 'modal-2', content: <p>Modal 2</p> });
      });

      expect(result.current.openModals).toHaveLength(2);

      act(() => {
        result.current.closeAll();
      });

      // Allow exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.openModals).toHaveLength(0);
    });
  });

  describe('update()', () => {
    it('should update modal options', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({
          content: <p>Original</p>,
          title: 'Original Title',
        });
      });

      act(() => {
        result.current.update(id!, { title: 'Updated Title' });
      });

      const store = useFeedbackStore.getState();
      const modal = store.get(id!);
      const options = modal?.options as IModalOptions | undefined;

      expect(options?.title).toBe('Updated Title');
    });
  });

  describe('isOpen', () => {
    it('should return true when modals are open', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open({ content: <p>Test</p> });
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should return false when no modals are open', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <p>Test</p> });
      });

      act(() => {
        result.current.close(id!);
      });

      // Allow exit animation
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('openModals', () => {
    it('should return array of open modal IDs', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ id: 'modal-1', content: <p>Modal 1</p> });
        result.current.open({ id: 'modal-2', content: <p>Modal 2</p> });
      });

      expect(result.current.openModals).toContain('modal-1');
      expect(result.current.openModals).toContain('modal-2');
    });

    it('should return empty array when no modals', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      expect(result.current.openModals).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      // This should throw
      expect(() => {
        renderHook(() => useModal());
      }).toThrow('useFeedbackContext must be used within a FeedbackProvider');
    });
  });
});
