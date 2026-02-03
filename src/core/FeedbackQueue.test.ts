/**
 * FeedbackQueue unit tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { FeedbackQueue } from './FeedbackQueue';
import type { IFeedbackItem, IQueueConfig } from './types';

/**
 * Helper to create a mock feedback item
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

describe('FeedbackQueue', () => {
  let queue: FeedbackQueue;
  const defaultConfig: IQueueConfig = {
    maxSize: 5,
    strategy: 'reject',
  };

  beforeEach(() => {
    queue = new FeedbackQueue(defaultConfig);
  });

  describe('enqueue()', () => {
    it('should add item to queue', () => {
      const item = createMockItem('test-1');
      const result = queue.enqueue(item);

      expect(result).toBe(true);
      expect(queue.size).toBe(1);
      expect(queue.has('test-1')).toBe(true);
    });

    it('should allow adding same item twice (idempotent)', () => {
      const item = createMockItem('test-1');
      queue.enqueue(item);
      const result = queue.enqueue(item);

      expect(result).toBe(true);
      expect(queue.size).toBe(1);
    });

    it('should reject when at max capacity with reject strategy', () => {
      // Fill queue to max
      for (let i = 0; i < 5; i++) {
        queue.enqueue(createMockItem(`item-${String(i)}`));
      }

      const result = queue.enqueue(createMockItem('overflow'));

      expect(result).toBe(false);
      expect(queue.size).toBe(5);
      expect(queue.has('overflow')).toBe(false);
    });
  });

  describe('dequeue()', () => {
    it('should remove and return item', () => {
      const item = createMockItem('test-1');
      queue.enqueue(item);

      const removed = queue.dequeue('test-1');

      expect(removed).toEqual(item);
      expect(queue.size).toBe(0);
      expect(queue.has('test-1')).toBe(false);
    });

    it('should return undefined for non-existent item', () => {
      const result = queue.dequeue('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getOrdered()', () => {
    it('should return items sorted by priority (highest first)', () => {
      queue.enqueue(createMockItem('low', { variant: 'info' }));
      queue.enqueue(createMockItem('high', { variant: 'error' }));
      queue.enqueue(createMockItem('medium', { variant: 'warning' }));

      const ordered = queue.getOrdered();

      expect(ordered[0]?.id).toBe('high');
      expect(ordered[1]?.id).toBe('medium');
      expect(ordered[2]?.id).toBe('low');
    });

    it('should sort by timestamp when priority is equal', async () => {
      const item1 = createMockItem('first', { variant: 'info' });
      queue.enqueue(item1);

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const item2 = createMockItem('second', { variant: 'info' });
      queue.enqueue(item2);

      const ordered = queue.getOrdered();

      expect(ordered[0]?.id).toBe('first');
      expect(ordered[1]?.id).toBe('second');
    });

    it('should include custom priority in calculation', () => {
      queue.enqueue(createMockItem('low', { variant: 'info', priority: 0 }));
      queue.enqueue(createMockItem('high', { variant: 'info', priority: 200 }));

      const ordered = queue.getOrdered();

      expect(ordered[0]?.id).toBe('high');
      expect(ordered[1]?.id).toBe('low');
    });
  });

  describe('get()', () => {
    it('should return item by id', () => {
      const item = createMockItem('test-1');
      queue.enqueue(item);

      expect(queue.get('test-1')).toEqual(item);
    });

    it('should return undefined for non-existent item', () => {
      expect(queue.get('non-existent')).toBeUndefined();
    });
  });

  describe('has()', () => {
    it('should return true for existing item', () => {
      queue.enqueue(createMockItem('test-1'));
      expect(queue.has('test-1')).toBe(true);
    });

    it('should return false for non-existent item', () => {
      expect(queue.has('non-existent')).toBe(false);
    });
  });

  describe('size', () => {
    it('should return correct size', () => {
      expect(queue.size).toBe(0);

      queue.enqueue(createMockItem('test-1'));
      expect(queue.size).toBe(1);

      queue.enqueue(createMockItem('test-2'));
      expect(queue.size).toBe(2);

      queue.dequeue('test-1');
      expect(queue.size).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('should return true when empty', () => {
      expect(queue.isEmpty).toBe(true);
    });

    it('should return false when not empty', () => {
      queue.enqueue(createMockItem('test-1'));
      expect(queue.isEmpty).toBe(false);
    });
  });

  describe('isFull', () => {
    it('should return true when at capacity', () => {
      for (let i = 0; i < 5; i++) {
        queue.enqueue(createMockItem(`item-${String(i)}`));
      }
      expect(queue.isFull).toBe(true);
    });

    it('should return false when not at capacity', () => {
      queue.enqueue(createMockItem('test-1'));
      expect(queue.isFull).toBe(false);
    });
  });

  describe('clear()', () => {
    it('should remove all items', () => {
      queue.enqueue(createMockItem('test-1'));
      queue.enqueue(createMockItem('test-2'));

      queue.clear();

      expect(queue.size).toBe(0);
      expect(queue.isEmpty).toBe(true);
    });
  });

  describe('FIFO overflow strategy', () => {
    it('should remove oldest item when at capacity', () => {
      const fifoQueue = new FeedbackQueue({ maxSize: 3, strategy: 'fifo' });

      fifoQueue.enqueue(createMockItem('first'));
      fifoQueue.enqueue(createMockItem('second'));
      fifoQueue.enqueue(createMockItem('third'));

      const result = fifoQueue.enqueue(createMockItem('fourth'));

      expect(result).toBe(true);
      expect(fifoQueue.has('first')).toBe(false);
      expect(fifoQueue.has('fourth')).toBe(true);
      expect(fifoQueue.size).toBe(3);
    });
  });

  describe('Priority overflow strategy', () => {
    it('should replace lowest priority item when new item has higher priority', () => {
      const priorityQueue = new FeedbackQueue({ maxSize: 3, strategy: 'priority' });

      priorityQueue.enqueue(createMockItem('low', { variant: 'info' }));
      priorityQueue.enqueue(createMockItem('medium', { variant: 'warning' }));
      priorityQueue.enqueue(createMockItem('high', { variant: 'error' }));

      // New item with higher priority than lowest
      const result = priorityQueue.enqueue(createMockItem('new-high', { variant: 'error' }));

      expect(result).toBe(true);
      expect(priorityQueue.has('low')).toBe(false);
      expect(priorityQueue.has('new-high')).toBe(true);
    });

    it('should reject new item when it has lower priority than all existing', () => {
      const priorityQueue = new FeedbackQueue({ maxSize: 3, strategy: 'priority' });

      priorityQueue.enqueue(createMockItem('high1', { variant: 'error' }));
      priorityQueue.enqueue(createMockItem('high2', { variant: 'error' }));
      priorityQueue.enqueue(createMockItem('high3', { variant: 'error' }));

      const result = priorityQueue.enqueue(createMockItem('low', { variant: 'info' }));

      expect(result).toBe(false);
      expect(priorityQueue.has('low')).toBe(false);
    });
  });

  describe('updateConfig()', () => {
    it('should update queue configuration', () => {
      queue.updateConfig({ maxSize: 10 });

      const config = queue.getConfig();
      expect(config.maxSize).toBe(10);
    });
  });

  describe('getConfig()', () => {
    it('should return copy of configuration', () => {
      const config = queue.getConfig();

      expect(config.maxSize).toBe(5);
      expect(config.strategy).toBe('reject');

      // Modifying returned config should not affect queue
      config.maxSize = 100;
      expect(queue.getConfig().maxSize).toBe(5);
    });
  });
});
