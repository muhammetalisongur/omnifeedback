/**
 * Integration tests: Queue Overflow
 *
 * Validates FeedbackQueue + FeedbackManager overflow behavior.
 * Tests FIFO, Priority, and Reject overflow strategies,
 * verifying that queue limits are respected and EventBus
 * emits queue:overflow events appropriately.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FeedbackManager } from '@core/FeedbackManager';
import { FeedbackQueue } from '@core/FeedbackQueue';
import { useFeedbackStore } from '@core/FeedbackStore';
import type { IFeedbackItem, IQueueConfig } from '@core/types';

/**
 * Helper to create a mock feedback item for direct queue testing
 */
function createMockItem(
  id: string,
  options: { variant?: string; priority?: number } = {}
): IFeedbackItem {
  return {
    id,
    type: 'toast',
    status: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    options: {
      message: `Test message ${id}`,
      variant: options.variant ?? 'default',
      priority: options.priority,
    },
  } as IFeedbackItem;
}

describe('Integration: Queue Overflow', () => {
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

  // ==================== OVERFLOW TRIGGERING ====================

  describe('Adding items beyond maxSize triggers overflow handling', () => {
    it('should trigger overflow when queue reaches maxSize', () => {
      const queue = new FeedbackQueue({ maxSize: 3, strategy: 'reject' });

      // Fill the queue
      queue.enqueue(createMockItem('item-1'));
      queue.enqueue(createMockItem('item-2'));
      queue.enqueue(createMockItem('item-3'));

      expect(queue.isFull).toBe(true);
      expect(queue.size).toBe(3);

      // Attempt to add one more
      const result = queue.enqueue(createMockItem('overflow-item'));

      // With reject strategy, item should be rejected
      expect(result).toBe(false);
      expect(queue.size).toBe(3);
      expect(queue.has('overflow-item')).toBe(false);
    });

    it('should handle overflow correctly through FeedbackManager', () => {
      // Create manager with very small queue
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 3, strategy: 'reject' },
      });

      const overflowHandler = vi.fn();
      manager.on('queue:overflow', overflowHandler);

      // Fill the queue via manager
      manager.add('toast', { message: 'Toast 1' });
      manager.add('toast', { message: 'Toast 2' });
      manager.add('toast', { message: 'Toast 3' });

      // This should trigger overflow
      manager.add('toast', { message: 'Overflow toast' });

      expect(overflowHandler).toHaveBeenCalledTimes(1);
      expect(overflowHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          rejected: expect.objectContaining({
            type: 'toast',
          }),
        })
      );
    });
  });

  // ==================== FIFO STRATEGY ====================

  describe('FIFO strategy removes oldest item', () => {
    it('should remove the oldest item and add the new one', () => {
      const queue = new FeedbackQueue({ maxSize: 3, strategy: 'fifo' });

      queue.enqueue(createMockItem('oldest'));
      queue.enqueue(createMockItem('middle'));
      queue.enqueue(createMockItem('newest'));

      expect(queue.size).toBe(3);

      // Adding a 4th item should remove 'oldest'
      const result = queue.enqueue(createMockItem('new-item'));

      expect(result).toBe(true);
      expect(queue.size).toBe(3);
      expect(queue.has('oldest')).toBe(false);
      expect(queue.has('new-item')).toBe(true);
      expect(queue.has('middle')).toBe(true);
      expect(queue.has('newest')).toBe(true);
    });

    it('should consistently remove the oldest item across multiple overflows', () => {
      const queue = new FeedbackQueue({ maxSize: 2, strategy: 'fifo' });

      queue.enqueue(createMockItem('item-a'));
      queue.enqueue(createMockItem('item-b'));

      // First overflow: removes item-a
      queue.enqueue(createMockItem('item-c'));
      expect(queue.has('item-a')).toBe(false);
      expect(queue.has('item-b')).toBe(true);
      expect(queue.has('item-c')).toBe(true);

      // Second overflow: removes item-b
      queue.enqueue(createMockItem('item-d'));
      expect(queue.has('item-b')).toBe(false);
      expect(queue.has('item-c')).toBe(true);
      expect(queue.has('item-d')).toBe(true);
    });

    it('should work through FeedbackManager with FIFO strategy', () => {
      FeedbackManager.resetInstance();
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 3, strategy: 'fifo' },
      });

      const id1 = manager.add('toast', { message: 'First toast' });
      const id2 = manager.add('toast', { message: 'Second toast' });
      const id3 = manager.add('toast', { message: 'Third toast' });

      // All three should be in the store
      expect(useFeedbackStore.getState().get(id1)).toBeDefined();
      expect(useFeedbackStore.getState().get(id2)).toBeDefined();
      expect(useFeedbackStore.getState().get(id3)).toBeDefined();

      // Adding a 4th toast: FIFO removes oldest from queue,
      // but the item may still be in the store (store and queue are separate)
      const id4 = manager.add('toast', { message: 'Fourth toast' });
      expect(useFeedbackStore.getState().get(id4)).toBeDefined();
    });
  });

  // ==================== PRIORITY STRATEGY ====================

  describe('Priority strategy removes lowest priority', () => {
    it('should remove the lowest priority item when a higher priority item overflows', () => {
      const queue = new FeedbackQueue({ maxSize: 3, strategy: 'priority' });

      queue.enqueue(createMockItem('low', { variant: 'info' }));       // priority: 25
      queue.enqueue(createMockItem('medium', { variant: 'warning' })); // priority: 75
      queue.enqueue(createMockItem('high', { variant: 'error' }));     // priority: 100

      // Add a new error-priority item - should remove the lowest (info)
      const result = queue.enqueue(createMockItem('new-high', { variant: 'error' }));

      expect(result).toBe(true);
      expect(queue.has('low')).toBe(false);     // Lowest priority removed
      expect(queue.has('medium')).toBe(true);
      expect(queue.has('high')).toBe(true);
      expect(queue.has('new-high')).toBe(true);
    });

    it('should reject new item when it has lower priority than all existing items', () => {
      const queue = new FeedbackQueue({ maxSize: 3, strategy: 'priority' });

      queue.enqueue(createMockItem('error-1', { variant: 'error' }));  // priority: 100
      queue.enqueue(createMockItem('error-2', { variant: 'error' }));  // priority: 100
      queue.enqueue(createMockItem('error-3', { variant: 'error' }));  // priority: 100

      // Try to add a low-priority item
      const result = queue.enqueue(createMockItem('info-low', { variant: 'info' })); // priority: 25

      expect(result).toBe(false);
      expect(queue.has('info-low')).toBe(false);
      expect(queue.size).toBe(3);
    });

    it('should consider custom priority in addition to variant priority', () => {
      const queue = new FeedbackQueue({ maxSize: 3, strategy: 'priority' });

      queue.enqueue(createMockItem('base-info', { variant: 'info' }));            // 25 + 0 = 25
      queue.enqueue(createMockItem('boosted-info', { variant: 'info', priority: 100 })); // 25 + 100 = 125
      queue.enqueue(createMockItem('warning', { variant: 'warning' }));           // 75 + 0 = 75

      // Add item with priority higher than base-info but lower than boosted-info
      const result = queue.enqueue(createMockItem('new-warning', { variant: 'warning' })); // 75

      expect(result).toBe(true);
      expect(queue.has('base-info')).toBe(false); // Lowest (25) removed
      expect(queue.has('boosted-info')).toBe(true);
      expect(queue.has('warning')).toBe(true);
      expect(queue.has('new-warning')).toBe(true);
    });

    it('should reject when new item has equal priority to lowest', () => {
      const queue = new FeedbackQueue({ maxSize: 2, strategy: 'priority' });

      queue.enqueue(createMockItem('item-a', { variant: 'warning' })); // priority: 75
      queue.enqueue(createMockItem('item-b', { variant: 'warning' })); // priority: 75

      // New item with same priority should be rejected
      // (priority overflow requires strictly higher priority)
      const result = queue.enqueue(createMockItem('item-c', { variant: 'warning' })); // priority: 75

      expect(result).toBe(false);
      expect(queue.has('item-c')).toBe(false);
    });
  });

  // ==================== REJECT STRATEGY ====================

  describe('Reject strategy rejects new item', () => {
    it('should reject the new item and keep existing items unchanged', () => {
      const queue = new FeedbackQueue({ maxSize: 3, strategy: 'reject' });

      queue.enqueue(createMockItem('item-1'));
      queue.enqueue(createMockItem('item-2'));
      queue.enqueue(createMockItem('item-3'));

      const result = queue.enqueue(createMockItem('rejected-item'));

      expect(result).toBe(false);
      expect(queue.size).toBe(3);
      expect(queue.has('rejected-item')).toBe(false);
      expect(queue.has('item-1')).toBe(true);
      expect(queue.has('item-2')).toBe(true);
      expect(queue.has('item-3')).toBe(true);
    });

    it('should reject regardless of priority level', () => {
      const queue = new FeedbackQueue({ maxSize: 2, strategy: 'reject' });

      queue.enqueue(createMockItem('low-1', { variant: 'info' }));
      queue.enqueue(createMockItem('low-2', { variant: 'info' }));

      // Even a high-priority item should be rejected
      const result = queue.enqueue(createMockItem('high-priority', { variant: 'error' }));

      expect(result).toBe(false);
      expect(queue.has('high-priority')).toBe(false);
    });

    it('should allow adding items after space is freed', () => {
      const queue = new FeedbackQueue({ maxSize: 2, strategy: 'reject' });

      queue.enqueue(createMockItem('item-1'));
      queue.enqueue(createMockItem('item-2'));

      // Rejected due to full
      expect(queue.enqueue(createMockItem('rejected'))).toBe(false);

      // Free up space
      queue.dequeue('item-1');

      // Now should succeed
      const result = queue.enqueue(createMockItem('new-item'));
      expect(result).toBe(true);
      expect(queue.has('new-item')).toBe(true);
    });
  });

  // ==================== EVENTBUS OVERFLOW EVENT ====================

  describe('EventBus emits queue:overflow event', () => {
    it('should emit queue:overflow when reject strategy rejects an item', () => {
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 2, strategy: 'reject' },
      });

      const overflowHandler = vi.fn();
      manager.on('queue:overflow', overflowHandler);

      manager.add('toast', { message: 'Item 1' });
      manager.add('toast', { message: 'Item 2' });

      // This should trigger overflow
      manager.add('toast', { message: 'Overflow item' });

      expect(overflowHandler).toHaveBeenCalledTimes(1);
    });

    it('should include the rejected item in the overflow event payload', () => {
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 1, strategy: 'reject' },
      });

      const overflowHandler = vi.fn();
      manager.on('queue:overflow', overflowHandler);

      manager.add('toast', { message: 'Existing item' });
      manager.add('toast', { message: 'Rejected overflow item' });

      expect(overflowHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          rejected: expect.objectContaining({
            type: 'toast',
            options: expect.objectContaining({
              message: 'Rejected overflow item',
            }),
          }),
        })
      );
    });

    it('should NOT emit queue:overflow when FIFO strategy handles overflow', () => {
      FeedbackManager.resetInstance();
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 2, strategy: 'fifo' },
      });

      const overflowHandler = vi.fn();
      manager.on('queue:overflow', overflowHandler);

      manager.add('toast', { message: 'Item 1' });
      manager.add('toast', { message: 'Item 2' });
      manager.add('toast', { message: 'Item 3 - triggers FIFO' });

      // FIFO handles overflow by removing oldest, so enqueue returns true
      // and the manager does NOT emit queue:overflow
      expect(overflowHandler).not.toHaveBeenCalled();
    });

    it('should NOT emit queue:overflow when priority strategy successfully replaces', () => {
      FeedbackManager.resetInstance();
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 2, strategy: 'priority' },
      });

      const overflowHandler = vi.fn();
      manager.on('queue:overflow', overflowHandler);

      manager.add('toast', { message: 'Low priority', variant: 'info' });
      manager.add('toast', { message: 'Medium priority', variant: 'warning' });

      // Add higher priority - should replace lowest, no overflow event
      manager.add('toast', { message: 'High priority', variant: 'error' });

      expect(overflowHandler).not.toHaveBeenCalled();
    });

    it('should emit queue:overflow when priority strategy rejects (new item has lower priority)', () => {
      FeedbackManager.resetInstance();
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 2, strategy: 'priority' },
      });

      const overflowHandler = vi.fn();
      manager.on('queue:overflow', overflowHandler);

      manager.add('toast', { message: 'High 1', variant: 'error' });
      manager.add('toast', { message: 'High 2', variant: 'error' });

      // Lower priority item should be rejected
      manager.add('toast', { message: 'Low item', variant: 'info' });

      expect(overflowHandler).toHaveBeenCalledTimes(1);
      expect(overflowHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          rejected: expect.objectContaining({
            options: expect.objectContaining({
              message: 'Low item',
            }),
          }),
        })
      );
    });

    it('should emit multiple overflow events for multiple rejected items', () => {
      const manager = FeedbackManager.getInstance({
        queue: { maxSize: 1, strategy: 'reject' },
      });

      const overflowHandler = vi.fn();
      manager.on('queue:overflow', overflowHandler);

      manager.add('toast', { message: 'Only item' });
      manager.add('toast', { message: 'Rejected 1' });
      manager.add('toast', { message: 'Rejected 2' });
      manager.add('toast', { message: 'Rejected 3' });

      expect(overflowHandler).toHaveBeenCalledTimes(3);
    });
  });

  // ==================== QUEUE CONFIG UPDATES ====================

  describe('Queue configuration updates', () => {
    it('should allow increasing maxSize to accommodate more items', () => {
      const queue = new FeedbackQueue({ maxSize: 2, strategy: 'reject' });

      queue.enqueue(createMockItem('item-1'));
      queue.enqueue(createMockItem('item-2'));

      // Initially full
      expect(queue.isFull).toBe(true);

      // Increase max size
      queue.updateConfig({ maxSize: 5 });

      // Now can add more
      const result = queue.enqueue(createMockItem('item-3'));
      expect(result).toBe(true);
      expect(queue.size).toBe(3);
    });

    it('should allow changing strategy dynamically', () => {
      const queue = new FeedbackQueue({ maxSize: 2, strategy: 'reject' });

      queue.enqueue(createMockItem('item-1'));
      queue.enqueue(createMockItem('item-2'));

      // Reject strategy: new item is rejected
      expect(queue.enqueue(createMockItem('rejected'))).toBe(false);

      // Switch to FIFO
      queue.updateConfig({ strategy: 'fifo' });

      // Now should succeed with FIFO
      const result = queue.enqueue(createMockItem('fifo-item'));
      expect(result).toBe(true);
      expect(queue.has('item-1')).toBe(false); // Oldest removed
      expect(queue.has('fifo-item')).toBe(true);
    });
  });
});
