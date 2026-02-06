/**
 * FeedbackStore unit tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useFeedbackStore,
  useToasts,
  useModals,
  useLoadings,
  useAlerts,
  useProgresses,
  useConfirms,
  useVisibleItems,
  useItemCount,
  useItem,
  useHasType,
  useToastsByPosition,
} from './FeedbackStore';
import type { IFeedbackItem, FeedbackType } from './types';

/**
 * Helper to create a mock feedback item
 */
function createMockItem(
  id: string,
  type: FeedbackType = 'toast',
  status: 'pending' | 'visible' | 'exiting' | 'removed' = 'visible',
  options: Record<string, unknown> = {}
): IFeedbackItem {
  return {
    id,
    type,
    status,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    options: {
      message: `Test message ${id}`,
      ...options,
    },
  } as IFeedbackItem;
}

describe('FeedbackStore', () => {
  beforeEach(() => {
    // Clear store before each test
    useFeedbackStore.getState().clear();
  });

  describe('add()', () => {
    it('should add item to store', () => {
      const item = createMockItem('test-1');
      useFeedbackStore.getState().add(item);

      expect(useFeedbackStore.getState().get('test-1')).toEqual(item);
    });

    it('should not affect other items', () => {
      const item1 = createMockItem('test-1');
      const item2 = createMockItem('test-2');

      useFeedbackStore.getState().add(item1);
      useFeedbackStore.getState().add(item2);

      expect(useFeedbackStore.getState().get('test-1')).toEqual(item1);
      expect(useFeedbackStore.getState().get('test-2')).toEqual(item2);
    });
  });

  describe('remove()', () => {
    it('should remove item from store', () => {
      const item = createMockItem('test-1');
      useFeedbackStore.getState().add(item);
      useFeedbackStore.getState().remove('test-1');

      expect(useFeedbackStore.getState().get('test-1')).toBeUndefined();
    });

    it('should not affect other items', () => {
      const item1 = createMockItem('test-1');
      const item2 = createMockItem('test-2');

      useFeedbackStore.getState().add(item1);
      useFeedbackStore.getState().add(item2);
      useFeedbackStore.getState().remove('test-1');

      expect(useFeedbackStore.getState().get('test-1')).toBeUndefined();
      expect(useFeedbackStore.getState().get('test-2')).toEqual(item2);
    });

    it('should handle non-existent item gracefully', () => {
      expect(() => {
        useFeedbackStore.getState().remove('non-existent');
      }).not.toThrow();
    });
  });

  describe('update()', () => {
    it('should update item properties', () => {
      const item = createMockItem('test-1');
      useFeedbackStore.getState().add(item);

      useFeedbackStore.getState().update('test-1', { status: 'exiting' });

      const updated = useFeedbackStore.getState().get('test-1');
      expect(updated?.status).toBe('exiting');
    });

    it('should update updatedAt timestamp', () => {
      const item = createMockItem('test-1');
      const originalUpdatedAt = item.updatedAt;
      useFeedbackStore.getState().add(item);

      // Small delay to ensure different timestamp
      useFeedbackStore.getState().update('test-1', { status: 'exiting' });

      const updated = useFeedbackStore.getState().get('test-1');
      expect(updated?.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
    });

    it('should not create item if it does not exist', () => {
      useFeedbackStore.getState().update('non-existent', { status: 'exiting' });

      expect(useFeedbackStore.getState().get('non-existent')).toBeUndefined();
    });

    it('should preserve other properties', () => {
      const item = createMockItem('test-1');
      useFeedbackStore.getState().add(item);

      useFeedbackStore.getState().update('test-1', { status: 'exiting' });

      const updated = useFeedbackStore.getState().get('test-1');
      expect(updated?.id).toBe('test-1');
      expect(updated?.type).toBe('toast');
      expect(updated?.createdAt).toBe(item.createdAt);
    });
  });

  describe('clear()', () => {
    it('should remove all items', () => {
      useFeedbackStore.getState().add(createMockItem('test-1'));
      useFeedbackStore.getState().add(createMockItem('test-2'));
      useFeedbackStore.getState().add(createMockItem('test-3'));

      useFeedbackStore.getState().clear();

      expect(useFeedbackStore.getState().getAll()).toHaveLength(0);
    });
  });

  describe('get()', () => {
    it('should return item by id', () => {
      const item = createMockItem('test-1');
      useFeedbackStore.getState().add(item);

      expect(useFeedbackStore.getState().get('test-1')).toEqual(item);
    });

    it('should return undefined for non-existent item', () => {
      expect(useFeedbackStore.getState().get('non-existent')).toBeUndefined();
    });
  });

  describe('getAll()', () => {
    it('should return all items', () => {
      useFeedbackStore.getState().add(createMockItem('test-1'));
      useFeedbackStore.getState().add(createMockItem('test-2'));
      useFeedbackStore.getState().add(createMockItem('test-3'));

      const all = useFeedbackStore.getState().getAll();

      expect(all).toHaveLength(3);
    });

    it('should return empty array when no items', () => {
      expect(useFeedbackStore.getState().getAll()).toEqual([]);
    });
  });

  describe('getByType()', () => {
    it('should return items filtered by type', () => {
      useFeedbackStore.getState().add(createMockItem('toast-1', 'toast'));
      useFeedbackStore.getState().add(createMockItem('toast-2', 'toast'));
      useFeedbackStore.getState().add(createMockItem('modal-1', 'modal'));
      useFeedbackStore.getState().add(createMockItem('loading-1', 'loading'));

      const toasts = useFeedbackStore.getState().getByType('toast');
      const modals = useFeedbackStore.getState().getByType('modal');

      expect(toasts).toHaveLength(2);
      expect(modals).toHaveLength(1);
    });

    it('should return empty array when no items of type', () => {
      useFeedbackStore.getState().add(createMockItem('toast-1', 'toast'));

      const modals = useFeedbackStore.getState().getByType('modal');

      expect(modals).toEqual([]);
    });
  });

  describe('getByStatus()', () => {
    it('should return items filtered by status', () => {
      useFeedbackStore.getState().add(createMockItem('pending-1', 'toast', 'pending'));
      useFeedbackStore.getState().add(createMockItem('visible-1', 'toast', 'visible'));
      useFeedbackStore.getState().add(createMockItem('visible-2', 'toast', 'visible'));
      useFeedbackStore.getState().add(createMockItem('exiting-1', 'toast', 'exiting'));

      const visible = useFeedbackStore.getState().getByStatus('visible');
      const pending = useFeedbackStore.getState().getByStatus('pending');

      expect(visible).toHaveLength(2);
      expect(pending).toHaveLength(1);
    });
  });

  describe('Store immutability', () => {
    it('should create new Map on each update', () => {
      const item = createMockItem('test-1');
      useFeedbackStore.getState().add(item);

      const mapBefore = useFeedbackStore.getState().items;

      useFeedbackStore.getState().add(createMockItem('test-2'));

      const mapAfter = useFeedbackStore.getState().items;

      expect(mapBefore).not.toBe(mapAfter);
    });
  });
});

// ==================== SELECTOR HOOKS ====================

describe('FeedbackStore Selector Hooks', () => {
  beforeEach(() => {
    useFeedbackStore.getState().clear();
  });

  describe('useToasts', () => {
    it('should return only toast items', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
        useFeedbackStore.getState().add(createMockItem('t2', 'toast'));
        useFeedbackStore.getState().add(createMockItem('m1', 'modal'));
      });

      const { result } = renderHook(() => useToasts());
      expect(result.current).toHaveLength(2);
      expect(result.current.map((item) => item.id).sort()).toEqual(['t1', 't2']);
    });

    it('should return empty array when no toasts exist', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('m1', 'modal'));
      });

      const { result } = renderHook(() => useToasts());
      expect(result.current).toEqual([]);
    });
  });

  describe('useModals', () => {
    it('should return only modal items', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('m1', 'modal'));
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
      });

      const { result } = renderHook(() => useModals());
      expect(result.current).toHaveLength(1);
      expect(result.current[0]?.id).toBe('m1');
    });
  });

  describe('useLoadings', () => {
    it('should return only loading items', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('l1', 'loading'));
        useFeedbackStore.getState().add(createMockItem('l2', 'loading'));
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
      });

      const { result } = renderHook(() => useLoadings());
      expect(result.current).toHaveLength(2);
      expect(result.current.map((item) => item.id).sort()).toEqual(['l1', 'l2']);
    });
  });

  describe('useAlerts', () => {
    it('should return only alert items', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('a1', 'alert'));
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
      });

      const { result } = renderHook(() => useAlerts());
      expect(result.current).toHaveLength(1);
      expect(result.current[0]?.id).toBe('a1');
    });
  });

  describe('useProgresses', () => {
    it('should return only progress items', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('p1', 'progress'));
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
      });

      const { result } = renderHook(() => useProgresses());
      expect(result.current).toHaveLength(1);
      expect(result.current[0]?.id).toBe('p1');
    });
  });

  describe('useConfirms', () => {
    it('should return only confirm items', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('c1', 'confirm'));
        useFeedbackStore.getState().add(createMockItem('c2', 'confirm'));
        useFeedbackStore.getState().add(createMockItem('m1', 'modal'));
      });

      const { result } = renderHook(() => useConfirms());
      expect(result.current).toHaveLength(2);
      expect(result.current.map((item) => item.id).sort()).toEqual(['c1', 'c2']);
    });
  });

  describe('useVisibleItems', () => {
    it('should exclude exiting and removed items', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('v1', 'toast', 'visible'));
        useFeedbackStore.getState().add(createMockItem('v2', 'modal', 'pending'));
        useFeedbackStore.getState().add(createMockItem('e1', 'toast', 'exiting'));
        useFeedbackStore.getState().add(createMockItem('r1', 'toast', 'removed'));
      });

      const { result } = renderHook(() => useVisibleItems());
      expect(result.current).toHaveLength(2);
      expect(result.current.map((item) => item.id).sort()).toEqual(['v1', 'v2']);
    });

    it('should return empty array when all items are exiting or removed', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('e1', 'toast', 'exiting'));
        useFeedbackStore.getState().add(createMockItem('r1', 'toast', 'removed'));
      });

      const { result } = renderHook(() => useVisibleItems());
      expect(result.current).toEqual([]);
    });
  });

  describe('useItemCount', () => {
    it('should return total item count', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('i1', 'toast'));
        useFeedbackStore.getState().add(createMockItem('i2', 'modal'));
        useFeedbackStore.getState().add(createMockItem('i3', 'loading'));
      });

      const { result } = renderHook(() => useItemCount());
      expect(result.current).toBe(3);
    });

    it('should return 0 when store is empty', () => {
      const { result } = renderHook(() => useItemCount());
      expect(result.current).toBe(0);
    });
  });

  describe('useItem', () => {
    it('should return specific item by id', () => {
      const item = createMockItem('target', 'modal');
      act(() => {
        useFeedbackStore.getState().add(item);
        useFeedbackStore.getState().add(createMockItem('other', 'toast'));
      });

      const { result } = renderHook(() => useItem('target'));
      expect(result.current).toEqual(item);
    });

    it('should return undefined for non-existent id', () => {
      const { result } = renderHook(() => useItem('non-existent'));
      expect(result.current).toBeUndefined();
    });
  });

  describe('useHasType', () => {
    it('should return true when type exists in store', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
      });

      const { result } = renderHook(() => useHasType('toast'));
      expect(result.current).toBe(true);
    });

    it('should return false when type does not exist', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
      });

      const { result } = renderHook(() => useHasType('modal'));
      expect(result.current).toBe(false);
    });
  });

  describe('useToastsByPosition', () => {
    it('should group toasts by position', () => {
      act(() => {
        useFeedbackStore.getState().add(
          createMockItem('t1', 'toast', 'visible', { position: 'top-right' })
        );
        useFeedbackStore.getState().add(
          createMockItem('t2', 'toast', 'visible', { position: 'top-right' })
        );
        useFeedbackStore.getState().add(
          createMockItem('t3', 'toast', 'visible', { position: 'bottom-left' })
        );
      });

      const { result } = renderHook(() => useToastsByPosition());
      expect(result.current).toBeInstanceOf(Map);
      expect(result.current.get('top-right')).toHaveLength(2);
      expect(result.current.get('bottom-left')).toHaveLength(1);
    });

    it('should use top-right as default position', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('t1', 'toast'));
      });

      const { result } = renderHook(() => useToastsByPosition());
      expect(result.current.get('top-right')).toHaveLength(1);
    });

    it('should return empty map when no toasts exist', () => {
      act(() => {
        useFeedbackStore.getState().add(createMockItem('m1', 'modal'));
      });

      const { result } = renderHook(() => useToastsByPosition());
      expect(result.current.size).toBe(0);
    });
  });
});
