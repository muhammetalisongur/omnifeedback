/**
 * FeedbackManager - Singleton coordinator for all feedback operations
 * Orchestrates store, queue, and events
 */

import { useFeedbackStore } from './FeedbackStore';
import { FeedbackQueue } from './FeedbackQueue';
import { EventBus } from './EventBus';
import { generateId } from '../utils/generateId';
import type {
  IFeedbackManager,
  IFeedbackItem,
  IFeedbackConfig,
  IFeedbackEvents,
  FeedbackType,
  FeedbackOptionsMap,
  FeedbackStatus,
  IToastOptions,
  IAlertOptions,
} from './types';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: IFeedbackConfig = {
  defaultDuration: 5000,
  exitAnimationDuration: 200,
  enterAnimationDuration: 200,
  maxVisible: {
    toast: 5,
    modal: 1,
    loading: 3,
    alert: 5,
    progress: 3,
    confirm: 1,
    banner: 1,
    drawer: 1,
    popconfirm: 1,
    prompt: 1,
    sheet: 1,
  },
  defaultPosition: 'top-right',
  enableAnimations: true,
  rtl: false,
  queue: {
    maxSize: 100,
    strategy: 'fifo',
  },
};

/**
 * FeedbackManager class - singleton pattern
 * Coordinates all feedback operations across the system
 *
 * @example
 * ```ts
 * const manager = FeedbackManager.getInstance();
 * const id = manager.add('toast', { message: 'Hello!' });
 * manager.remove(id);
 * ```
 */
export class FeedbackManager implements IFeedbackManager {
  private static instance: FeedbackManager | null = null;

  private config: IFeedbackConfig;
  private queue: FeedbackQueue;
  private eventBus: EventBus<IFeedbackEvents>;
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Private constructor - use getInstance()
   */
  private constructor(config: Partial<IFeedbackConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.queue = new FeedbackQueue(this.config.queue);
    this.eventBus = new EventBus();
  }

  /**
   * Get singleton instance
   *
   * @param config - Optional configuration (only used on first call)
   * @returns FeedbackManager instance
   */
  static getInstance(config?: Partial<IFeedbackConfig>): FeedbackManager {
    if (!FeedbackManager.instance) {
      FeedbackManager.instance = new FeedbackManager(config);
    }
    return FeedbackManager.instance;
  }

  /**
   * Reset singleton instance (for testing)
   */
  static resetInstance(): void {
    if (FeedbackManager.instance) {
      FeedbackManager.instance.destroy();
      FeedbackManager.instance = null;
    }
  }

  /**
   * Check if instance exists
   */
  static hasInstance(): boolean {
    return FeedbackManager.instance !== null;
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Add a new feedback item
   *
   * @param type - Feedback type
   * @param options - Type-specific options
   * @returns Generated or provided ID
   */
  add<T extends FeedbackType>(type: T, options: FeedbackOptionsMap[T]): string {
    const id = options.id ?? generateId(type);
    const now = Date.now();

    const item: IFeedbackItem<T> = {
      id,
      type,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      options,
    };

    // Add to queue
    const added = this.queue.enqueue(item);

    if (!added) {
      this.eventBus.emit('queue:overflow', { rejected: item });
      return id;
    }

    // Add to store
    useFeedbackStore.getState().add(item);

    // Emit event
    this.eventBus.emit('feedback:added', item);

    // Start enter animation
    this.scheduleStatusChange(id, 'entering', 0);
    this.scheduleStatusChange(id, 'visible', this.config.enterAnimationDuration);

    // Schedule auto-dismiss for toast/alert
    if (type === 'toast' || type === 'alert') {
      const duration = this.getDuration(options as IToastOptions | IAlertOptions);
      if (duration > 0) {
        this.scheduleRemoval(id, duration + this.config.enterAnimationDuration);
      }
    }

    // Enforce max visible
    this.enforceMaxVisible(type);

    return id;
  }

  /**
   * Remove a feedback item (with exit animation)
   *
   * @param id - Item ID to remove
   */
  remove(id: string): void {
    const item = useFeedbackStore.getState().get(id);
    if (!item || item.status === 'exiting' || item.status === 'removed') {
      return;
    }

    // Clear any pending timers
    this.clearTimers(id);

    // Start exit animation
    this.updateStatus(id, 'exiting');

    // Remove after animation
    const timer = setTimeout(() => {
      this.finalizeRemoval(id, item);
    }, this.config.exitAnimationDuration);

    this.timers.set(`${id}:removal:final`, timer);
  }

  /**
   * Remove all items (optionally by type)
   *
   * @param type - Optional type filter
   */
  removeAll(type?: FeedbackType): void {
    const items = type
      ? useFeedbackStore.getState().getByType(type)
      : useFeedbackStore.getState().getAll();

    for (const item of items) {
      this.remove(item.id);
    }

    this.eventBus.emit('feedback:cleared', { type });
  }

  /**
   * Update feedback item options
   *
   * @param id - Item ID
   * @param updates - Partial options to merge
   */
  update<T extends FeedbackType>(
    id: string,
    updates: Partial<FeedbackOptionsMap[T]>
  ): void {
    const item = useFeedbackStore.getState().get(id);
    if (!item) {
      return;
    }

    const newOptions = { ...item.options, ...updates };
    useFeedbackStore.getState().update(id, { options: newOptions });

    this.eventBus.emit('feedback:updated', {
      id,
      updates: { options: newOptions },
    });
  }

  /**
   * Update item status
   *
   * @param id - Item ID
   * @param status - New status
   */
  updateStatus(id: string, status: FeedbackStatus): void {
    const item = useFeedbackStore.getState().get(id);
    if (!item) {
      return;
    }

    const from = item.status;
    useFeedbackStore.getState().update(id, { status, updatedAt: Date.now() });

    this.eventBus.emit('feedback:statusChanged', { id, from, to: status });
  }

  /**
   * Get item by ID
   *
   * @param id - Item ID
   * @returns Feedback item or undefined
   */
  get(id: string): IFeedbackItem | undefined {
    return useFeedbackStore.getState().get(id);
  }

  /**
   * Get all items
   *
   * @returns Array of all feedback items
   */
  getAll(): IFeedbackItem[] {
    return useFeedbackStore.getState().getAll();
  }

  /**
   * Get items by type
   *
   * @param type - Feedback type
   * @returns Array of items matching type
   */
  getByType<T extends FeedbackType>(type: T): IFeedbackItem<T>[] {
    return useFeedbackStore.getState().getByType(type);
  }

  /**
   * Subscribe to feedback events
   *
   * @param event - Event name
   * @param handler - Event handler
   * @returns Unsubscribe function
   */
  on<E extends keyof IFeedbackEvents>(
    event: E,
    handler: (payload: IFeedbackEvents[E]) => void
  ): () => void {
    return this.eventBus.on(event, handler);
  }

  /**
   * Subscribe to event once
   *
   * @param event - Event name
   * @param handler - Event handler
   * @returns Unsubscribe function
   */
  once<E extends keyof IFeedbackEvents>(
    event: E,
    handler: (payload: IFeedbackEvents[E]) => void
  ): () => void {
    return this.eventBus.once(event, handler);
  }

  /**
   * Get current configuration
   *
   * @returns Copy of current config
   */
  getConfig(): IFeedbackConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   *
   * @param updates - Partial config to merge
   */
  updateConfig(updates: Partial<IFeedbackConfig>): void {
    this.config = { ...this.config, ...updates };

    if (updates.queue) {
      this.queue.updateConfig(updates.queue);
    }
  }

  /**
   * Destroy manager and clean up resources
   */
  destroy(): void {
    // Clear all timers
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();

    // Clear store
    useFeedbackStore.getState().clear();

    // Clear queue
    this.queue.clear();

    // Remove all listeners
    this.eventBus.removeAllListeners();
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Get duration from options with fallback to default
   */
  private getDuration(options: IToastOptions | IAlertOptions): number {
    return options.duration ?? this.config.defaultDuration;
  }

  /**
   * Schedule a status change
   */
  private scheduleStatusChange(
    id: string,
    status: FeedbackStatus,
    delay: number
  ): void {
    if (delay === 0) {
      this.updateStatus(id, status);
      return;
    }

    const timer = setTimeout(() => {
      this.updateStatus(id, status);
      this.timers.delete(`${id}:${status}`);
    }, delay);

    this.timers.set(`${id}:${status}`, timer);
  }

  /**
   * Schedule item removal
   */
  private scheduleRemoval(id: string, delay: number): void {
    const timer = setTimeout(() => {
      this.remove(id);
      this.timers.delete(`${id}:removal`);
    }, delay);

    this.timers.set(`${id}:removal`, timer);
  }

  /**
   * Clear all timers for an item
   */
  private clearTimers(id: string): void {
    const keysToDelete: string[] = [];

    this.timers.forEach((timer, key) => {
      if (key.startsWith(id)) {
        clearTimeout(timer);
        keysToDelete.push(key);
      }
    });

    for (const key of keysToDelete) {
      this.timers.delete(key);
    }
  }

  /**
   * Finalize removal after exit animation
   */
  private finalizeRemoval(id: string, item: IFeedbackItem): void {
    this.updateStatus(id, 'removed');
    useFeedbackStore.getState().remove(id);
    this.queue.dequeue(id);
    this.eventBus.emit('feedback:removed', item);
    this.timers.delete(`${id}:removal:final`);
  }

  /**
   * Enforce max visible items per type
   */
  private enforceMaxVisible(type: FeedbackType): void {
    const maxVisible = this.config.maxVisible[type] ?? Infinity;

    const items = this.getByType(type).filter(
      (item) => item.status !== 'exiting' && item.status !== 'removed'
    );

    if (items.length > maxVisible) {
      // Sort by creation time and remove oldest
      const sorted = items.sort((a, b) => a.createdAt - b.createdAt);
      const toRemove = sorted.slice(0, items.length - maxVisible);

      for (const item of toRemove) {
        this.remove(item.id);
      }
    }
  }
}

/**
 * Get singleton FeedbackManager instance
 */
export const getFeedbackManager = (): FeedbackManager => FeedbackManager.getInstance();
