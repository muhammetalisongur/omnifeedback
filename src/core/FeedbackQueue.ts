/**
 * Priority-based queue for feedback items
 * Handles overflow strategies and priority ordering
 */

import type { IFeedbackItem, IQueueConfig } from './types';

/**
 * Internal queue entry with metadata
 */
interface IQueueEntry {
  item: IFeedbackItem;
  priority: number;
  timestamp: number;
}

/**
 * Priority map for feedback variants
 */
const VARIANT_PRIORITY: Record<string, number> = {
  error: 100,
  warning: 75,
  success: 50,
  info: 25,
  default: 0,
};

/**
 * Priority-based feedback queue
 * Manages feedback items with priority ordering and overflow handling
 *
 * @example
 * ```ts
 * const queue = new FeedbackQueue({ maxSize: 100, strategy: 'fifo' });
 * queue.enqueue(feedbackItem);
 * const ordered = queue.getOrdered();
 * ```
 */
export class FeedbackQueue {
  private entries = new Map<string, IQueueEntry>();
  private config: IQueueConfig;

  /**
   * Create a new FeedbackQueue
   *
   * @param config - Queue configuration
   */
  constructor(config: IQueueConfig) {
    this.config = config;
  }

  /**
   * Add item to queue
   *
   * @param item - Feedback item to enqueue
   * @returns True if successfully added, false if rejected
   */
  enqueue(item: IFeedbackItem): boolean {
    // Check if item already exists
    if (this.entries.has(item.id)) {
      return true;
    }

    // Check if at max capacity
    if (this.entries.size >= this.config.maxSize) {
      return this.handleOverflow(item);
    }

    const priority = this.calculatePriority(item);

    this.entries.set(item.id, {
      item,
      priority,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Remove item from queue
   *
   * @param id - Item ID to remove
   * @returns Removed item or undefined if not found
   */
  dequeue(id: string): IFeedbackItem | undefined {
    const entry = this.entries.get(id);
    if (entry) {
      this.entries.delete(id);
      return entry.item;
    }
    return undefined;
  }

  /**
   * Get all items sorted by priority (highest first) then timestamp (oldest first)
   *
   * @returns Ordered array of feedback items
   */
  getOrdered(): IFeedbackItem[] {
    return Array.from(this.entries.values())
      .sort((a, b) => {
        // Higher priority first
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        // Then by timestamp (older first)
        return a.timestamp - b.timestamp;
      })
      .map((entry) => entry.item);
  }

  /**
   * Get item by ID
   *
   * @param id - Item ID
   * @returns Feedback item or undefined
   */
  get(id: string): IFeedbackItem | undefined {
    return this.entries.get(id)?.item;
  }

  /**
   * Check if item exists in queue
   *
   * @param id - Item ID to check
   * @returns True if item exists
   */
  has(id: string): boolean {
    return this.entries.has(id);
  }

  /**
   * Get current queue size
   */
  get size(): number {
    return this.entries.size;
  }

  /**
   * Check if queue is empty
   */
  get isEmpty(): boolean {
    return this.entries.size === 0;
  }

  /**
   * Check if queue is at capacity
   */
  get isFull(): boolean {
    return this.entries.size >= this.config.maxSize;
  }

  /**
   * Clear all items from queue
   */
  clear(): void {
    this.entries.clear();
  }

  /**
   * Update queue configuration
   *
   * @param config - Partial configuration to merge
   */
  updateConfig(config: Partial<IQueueConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): IQueueConfig {
    return { ...this.config };
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Calculate priority for a feedback item
   */
  private calculatePriority(item: IFeedbackItem): number {
    // Get variant from options if available
    const options = item.options as { variant?: string };
    const variant = options.variant ?? 'default';
    const basePriority = VARIANT_PRIORITY[variant] ?? 0;

    // Add custom priority if specified
    const customPriority = item.options.priority ?? 0;

    return basePriority + customPriority;
  }

  /**
   * Handle queue overflow based on strategy
   */
  private handleOverflow(newItem: IFeedbackItem): boolean {
    switch (this.config.strategy) {
      case 'fifo':
        return this.handleFifoOverflow(newItem);

      case 'priority':
        return this.handlePriorityOverflow(newItem);

      case 'reject':
      default:
        return false;
    }
  }

  /**
   * FIFO overflow: remove oldest item
   */
  private handleFifoOverflow(newItem: IFeedbackItem): boolean {
    const sorted = Array.from(this.entries.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );

    const oldest = sorted[0];
    if (oldest) {
      this.entries.delete(oldest.item.id);
      return this.enqueue(newItem);
    }

    return false;
  }

  /**
   * Priority overflow: remove lowest priority item if new item has higher priority
   */
  private handlePriorityOverflow(newItem: IFeedbackItem): boolean {
    const newPriority = this.calculatePriority(newItem);

    const sorted = Array.from(this.entries.values()).sort(
      (a, b) => a.priority - b.priority
    );

    const lowest = sorted[0];

    if (lowest && newPriority > lowest.priority) {
      this.entries.delete(lowest.item.id);
      return this.enqueue(newItem);
    }

    return false;
  }
}
