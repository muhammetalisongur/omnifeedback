/**
 * @vitest-environment jsdom
 */

/**
 * useResult hook unit tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useResult } from './useResult';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';

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

describe('useResult', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('success()', () => {
    it('should add success result to store', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.success({ title: 'Success!' });
      });

      const store = useFeedbackStore.getState();
      const results = Array.from(store.items.values()).filter(
        (item) => item.type === 'result'
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.options).toHaveProperty('status', 'success');
      expect(results[0]?.options).toHaveProperty('title', 'Success!');
    });

    it('should return result ID', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      let resultId: string = '';

      act(() => {
        resultId = result.current.success({ title: 'Test' });
      });

      expect(resultId).toBeTruthy();
      expect(typeof resultId).toBe('string');
    });
  });

  describe('error()', () => {
    it('should add error result to store', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.error({ title: 'Error!' });
      });

      const store = useFeedbackStore.getState();
      const results = Array.from(store.items.values()).filter(
        (item) => item.type === 'result'
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.options).toHaveProperty('status', 'error');
    });
  });

  describe('info()', () => {
    it('should add info result to store', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.info({ title: 'Info' });
      });

      const store = useFeedbackStore.getState();
      const results = Array.from(store.items.values()).filter(
        (item) => item.type === 'result'
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.options).toHaveProperty('status', 'info');
    });
  });

  describe('warning()', () => {
    it('should add warning result to store', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.warning({ title: 'Warning' });
      });

      const store = useFeedbackStore.getState();
      const results = Array.from(store.items.values()).filter(
        (item) => item.type === 'result'
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.options).toHaveProperty('status', 'warning');
    });
  });

  describe('show()', () => {
    it('should add result with specified status', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('404', { title: 'Not Found' });
      });

      const store = useFeedbackStore.getState();
      const results = Array.from(store.items.values()).filter(
        (item) => item.type === 'result'
      );

      expect(results).toHaveLength(1);
      expect(results[0]?.options).toHaveProperty('status', '404');
    });

    it('should add result with all options', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('success', {
          title: 'Payment Complete',
          description: 'Your order has been placed.',
          size: 'lg',
        });
      });

      const store = useFeedbackStore.getState();
      const resultItem = Array.from(store.items.values()).find(
        (item) => item.type === 'result'
      );

      expect(resultItem?.options).toHaveProperty('title', 'Payment Complete');
      expect(resultItem?.options).toHaveProperty('description', 'Your order has been placed.');
      expect(resultItem?.options).toHaveProperty('size', 'lg');
    });

    it('should use custom ID when provided', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('success', {
          title: 'Test',
          id: 'custom-result-id',
        });
      });

      const store = useFeedbackStore.getState();
      const resultItem = store.get('custom-result-id');

      expect(resultItem).toBeDefined();
      expect(resultItem?.type).toBe('result');
    });
  });

  describe('hide()', () => {
    it('should remove result from store', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      let resultId: string = '';

      act(() => {
        resultId = result.current.success({ title: 'Test' });
      });

      // Verify result exists
      expect(useFeedbackStore.getState().get(resultId)).toBeDefined();

      act(() => {
        result.current.hide(resultId);
      });

      // After hide, result should be in exiting or removed state
      const resultItem = useFeedbackStore.getState().get(resultId);
      expect(resultItem?.status === 'exiting' || resultItem === undefined).toBe(true);
    });
  });

  describe('hideAll()', () => {
    it('should remove all results from store', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.success({ title: 'Result 1' });
        result.current.error({ title: 'Result 2' });
        result.current.info({ title: 'Result 3' });
      });

      // Verify results exist
      const store = useFeedbackStore.getState();
      const resultsBefore = Array.from(store.items.values()).filter(
        (item) => item.type === 'result' && item.status !== 'removed'
      );
      expect(resultsBefore).toHaveLength(3);

      act(() => {
        result.current.hideAll();
      });

      // Check that all results are in exiting or removed state
      const resultsAfter = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'result' && item.status !== 'exiting' && item.status !== 'removed'
      );
      expect(resultsAfter).toHaveLength(0);
    });
  });

  describe('isVisible()', () => {
    it('should return true when result is visible', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      let resultId: string = '';

      act(() => {
        resultId = result.current.success({ title: 'Test' });
      });

      expect(result.current.isVisible(resultId)).toBe(true);
    });

    it('should return false when result is not visible', () => {
      const { result } = renderHook(() => useResult(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isVisible('nonexistent')).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useResult());
      }).toThrow('useResult must be used within FeedbackProvider');
    });
  });
});
