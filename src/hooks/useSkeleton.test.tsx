/**
 * @vitest-environment jsdom
 */

/**
 * useSkeleton hook unit tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useSkeleton } from './useSkeleton';
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

describe('useSkeleton', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('show()', () => {
    it('should add skeleton to store', () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('test-skeleton');
      });

      const store = useFeedbackStore.getState();
      const skeletons = Array.from(store.items.values()).filter(
        (item) => item.type === 'skeleton'
      );

      expect(skeletons).toHaveLength(1);
      expect(skeletons[0]?.id).toBe('test-skeleton');
    });

    it('should not add duplicate skeleton with same ID', () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('test-skeleton');
      });

      act(() => {
        result.current.show('test-skeleton');
      });

      const store = useFeedbackStore.getState();
      const skeletons = Array.from(store.items.values()).filter(
        (item) => item.type === 'skeleton'
      );

      expect(skeletons).toHaveLength(1);
    });

    it('should add skeleton with custom options', () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('test-skeleton', {
          animation: 'wave',
          baseColor: '#f0f0f0',
        });
      });

      const store = useFeedbackStore.getState();
      const skeleton = store.get('test-skeleton');

      expect(skeleton?.options).toHaveProperty('animation', 'wave');
      expect(skeleton?.options).toHaveProperty('baseColor', '#f0f0f0');
    });
  });

  describe('hide()', () => {
    it('should remove skeleton from store', () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('test-skeleton');
      });

      // Verify skeleton exists
      expect(useFeedbackStore.getState().get('test-skeleton')).toBeDefined();

      act(() => {
        result.current.hide('test-skeleton');
      });

      // Wait for removal animation (skeleton uses manager.remove which has animation delay)
      // For skeletons, we check that it's in exiting/removed state
      const skeleton = useFeedbackStore.getState().get('test-skeleton');
      expect(skeleton?.status === 'exiting' || skeleton === undefined).toBe(true);
    });
  });

  describe('hideAll()', () => {
    it('should remove all skeletons from store', () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('skeleton-1');
        result.current.show('skeleton-2');
        result.current.show('skeleton-3');
      });

      // Verify skeletons exist
      const store = useFeedbackStore.getState();
      const skeletonsBefore = Array.from(store.items.values()).filter(
        (item) => item.type === 'skeleton' && item.status !== 'removed'
      );
      expect(skeletonsBefore).toHaveLength(3);

      act(() => {
        result.current.hideAll();
      });

      // Check that all skeletons are in exiting or removed state
      const skeletonsAfter = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'skeleton' && item.status !== 'exiting' && item.status !== 'removed'
      );
      expect(skeletonsAfter).toHaveLength(0);
    });
  });

  describe('isVisible()', () => {
    it('should return true when skeleton is visible', () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show('test-skeleton');
      });

      expect(result.current.isVisible('test-skeleton')).toBe(true);
    });

    it('should return false when skeleton is not visible', () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isVisible('nonexistent')).toBe(false);
    });
  });

  describe('wrap()', () => {
    it('should show skeleton before async function', async () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      let skeletonVisibleDuringExecution = false;

      await act(async () => {
        await result.current.wrap('async-skeleton', async () => {
          skeletonVisibleDuringExecution = result.current.isVisible('async-skeleton');
          return 'result';
        });
      });

      expect(skeletonVisibleDuringExecution).toBe(true);
    });

    it('should hide skeleton after async function completes', async () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.wrap('async-skeleton', async () => {
          return 'result';
        });
      });

      // After wrap completes, skeleton should be hidden (exiting or removed)
      const skeleton = useFeedbackStore.getState().get('async-skeleton');
      expect(skeleton?.status === 'exiting' || skeleton === undefined).toBe(true);
    });

    it('should return the result of the async function', async () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      let returnValue: string = '';

      await act(async () => {
        returnValue = await result.current.wrap('async-skeleton', async () => {
          return 'expected-result';
        });
      });

      expect(returnValue).toBe('expected-result');
    });

    it('should hide skeleton even if async function throws', async () => {
      const { result } = renderHook(() => useSkeleton(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.wrap('async-skeleton', async () => {
            throw new Error('Test error');
          });
        } catch {
          // Expected error
        }
      });

      // After wrap completes (even with error), skeleton should be hidden
      const skeleton = useFeedbackStore.getState().get('async-skeleton');
      expect(skeleton?.status === 'exiting' || skeleton === undefined).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useSkeleton());
      }).toThrow('useSkeleton must be used within FeedbackProvider');
    });
  });
});
