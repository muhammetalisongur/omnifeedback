# Design: Core Architecture

## Overview
Design the core feedback management system that is completely UI-agnostic. This layer handles state management, queuing, events, and coordination between all feedback types.

## Goals
- UI-library agnostic core logic
- Centralized state management
- Event-driven architecture
- Priority-based queuing
- Memory efficient
- Type-safe throughout

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER APPLICATION                             │
├─────────────────────────────────────────────────────────────────┤
│                         HOOKS LAYER                              │
│  useFeedback  │  useToast  │  useModal  │  useLoading  │ ...    │
├─────────────────────────────────────────────────────────────────┤
│                      PROVIDER LAYER                              │
│                    FeedbackProvider                              │
│            (React Context + Adapter Integration)                 │
├─────────────────────────────────────────────────────────────────┤
│                       CORE LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  FeedbackManager │  │  FeedbackStore   │  │   EventBus    │  │
│  │  (Coordinator)   │  │  (Zustand)       │  │   (Pub/Sub)   │  │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘  │
│           │                     │                     │          │
│           └─────────────────────┴─────────────────────┘          │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │  FeedbackQueue    │                        │
│                    │  (Priority Queue) │                        │
│                    └───────────────────┘                        │
├─────────────────────────────────────────────────────────────────┤
│                      ADAPTER LAYER                               │
│  shadcn  │  mantine  │  chakra  │  mui  │  antd  │  headless   │
└─────────────────────────────────────────────────────────────────┘
```

## Core Types

### src/core/types.ts

```typescript
// ==================== FEEDBACK TYPES ====================

export type FeedbackType =
  | 'toast'
  | 'modal'
  | 'loading'
  | 'alert'
  | 'progress'
  | 'confirm'
  | 'banner'
  | 'drawer'
  | 'popconfirm'
  | 'skeleton'
  | 'empty'
  | 'result'
  | 'connection'
  | 'prompt'
  | 'sheet';

export type FeedbackVariant = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'default';

export type FeedbackStatus = 
  | 'pending'    // Waiting to be shown
  | 'entering'   // Enter animation
  | 'visible'    // Fully visible
  | 'exiting'    // Exit animation
  | 'removed';   // Removed from DOM

export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// ==================== BASE OPTIONS ====================

export interface IBaseFeedbackOptions {
  /** Unique ID - auto-generated if not provided */
  id?: string;
  /** Priority level (higher = more important) */
  priority?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes */
  data?: Record<string, string>;
  /** Test ID for testing */
  testId?: string;
}

// ==================== TOAST OPTIONS ====================

export interface IToastOptions extends IBaseFeedbackOptions {
  /** Toast message (required) */
  message: string;
  /** Optional title */
  title?: string;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Duration in ms (0 = infinite) */
  duration?: number;
  /** Screen position */
  position?: ToastPosition;
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Callback when shown */
  onShow?: () => void;
}

// ==================== MODAL OPTIONS ====================

export interface IModalOptions extends IBaseFeedbackOptions {
  /** Modal title */
  title?: React.ReactNode;
  /** Modal content (required) */
  content: React.ReactNode;
  /** Modal size */
  size?: ModalSize;
  /** Show close button */
  closable?: boolean;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on ESC key */
  closeOnEscape?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Custom header */
  header?: React.ReactNode;
  /** Callback when closed */
  onClose?: () => void;
  /** Callback when opened */
  onOpen?: () => void;
  /** Prevent body scroll when open */
  preventScroll?: boolean;
}

// ==================== LOADING OPTIONS ====================

export interface ILoadingOptions extends IBaseFeedbackOptions {
  /** Loading message */
  message?: string;
  /** Spinner type */
  spinner?: 'default' | 'dots' | 'bars' | 'ring' | 'pulse';
  /** Full screen overlay */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Blur background */
  blur?: boolean;
  /** Can be cancelled */
  cancellable?: boolean;
  /** Cancel callback */
  onCancel?: () => void;
}

// ==================== ALERT OPTIONS ====================

export interface IAlertOptions extends IBaseFeedbackOptions {
  /** Alert message (required) */
  message: string;
  /** Alert title */
  title?: string;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Auto dismiss duration (0 = never) */
  duration?: number;
  /** Action buttons */
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

// ==================== PROGRESS OPTIONS ====================

export interface IProgressOptions extends IBaseFeedbackOptions {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Progress label */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Indeterminate mode */
  indeterminate?: boolean;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Callback when complete */
  onComplete?: () => void;
}

// ==================== CONFIRM OPTIONS ====================

export interface IConfirmOptions extends IBaseFeedbackOptions {
  /** Confirm message (required) */
  message: string;
  /** Dialog title */
  title?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button style */
  confirmVariant?: 'primary' | 'danger';
  /** Loading state on confirm */
  confirmLoading?: boolean;
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
}

// ==================== FEEDBACK ITEM ====================

export interface IFeedbackItem<T extends FeedbackType = FeedbackType> {
  /** Unique identifier */
  id: string;
  /** Feedback type */
  type: T;
  /** Current status */
  status: FeedbackStatus;
  /** Creation timestamp */
  createdAt: number;
  /** Update timestamp */
  updatedAt: number;
  /** Type-specific options */
  options: FeedbackOptionsMap[T];
}

export interface FeedbackOptionsMap {
  toast: IToastOptions;
  modal: IModalOptions;
  loading: ILoadingOptions;
  alert: IAlertOptions;
  progress: IProgressOptions;
  confirm: IConfirmOptions;
  banner: IBannerOptions;
  drawer: IDrawerOptions;
  popconfirm: IPopconfirmOptions;
  skeleton: ISkeletonOptions;
  empty: IBaseFeedbackOptions;
  result: IResultOptions;
  connection: IConnectionStatusOptions;
  prompt: IPromptOptions;
  sheet: ISheetOptions;
}

// ==================== CONFIGURATION ====================

export interface IFeedbackConfig {
  /** Default toast duration (ms) */
  defaultDuration: number;
  /** Exit animation duration (ms) */
  exitAnimationDuration: number;
  /** Enter animation duration (ms) */
  enterAnimationDuration: number;
  /** Max visible items per type */
  maxVisible: Partial<Record<FeedbackType, number>>;
  /** Default toast position */
  defaultPosition: ToastPosition;
  /** Enable animations */
  enableAnimations: boolean;
  /** RTL support */
  rtl: boolean;
  /** Queue config */
  queue: IQueueConfig;
}

export interface IQueueConfig {
  /** Maximum queue size */
  maxSize: number;
  /** Overflow strategy */
  strategy: 'fifo' | 'priority' | 'reject';
}

// ==================== EVENTS ====================

export interface IFeedbackEvents {
  'feedback:added': IFeedbackItem;
  'feedback:updated': { id: string; updates: Partial<IFeedbackItem> };
  'feedback:statusChanged': { id: string; from: FeedbackStatus; to: FeedbackStatus };
  'feedback:removed': IFeedbackItem;
  'feedback:cleared': { type?: FeedbackType };
  'queue:overflow': { rejected: IFeedbackItem };
}

// ==================== MANAGER INTERFACE ====================

export interface IFeedbackManager {
  /** Add feedback item */
  add<T extends FeedbackType>(type: T, options: FeedbackOptionsMap[T]): string;
  
  /** Remove feedback item */
  remove(id: string): void;
  
  /** Remove all items (optionally by type) */
  removeAll(type?: FeedbackType): void;
  
  /** Update feedback item */
  update<T extends FeedbackType>(id: string, updates: Partial<FeedbackOptionsMap[T]>): void;
  
  /** Update item status */
  updateStatus(id: string, status: FeedbackStatus): void;
  
  /** Get item by ID */
  get(id: string): IFeedbackItem | undefined;
  
  /** Get all items */
  getAll(): IFeedbackItem[];
  
  /** Get items by type */
  getByType<T extends FeedbackType>(type: T): IFeedbackItem<T>[];
  
  /** Subscribe to events */
  on<E extends keyof IFeedbackEvents>(
    event: E, 
    handler: (payload: IFeedbackEvents[E]) => void
  ): () => void;
  
  /** Destroy manager */
  destroy(): void;
}
```

## FeedbackManager

### src/core/FeedbackManager.ts

```typescript
import { FeedbackStore, useFeedbackStore } from './FeedbackStore';
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
} from './types';

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
  },
  defaultPosition: 'top-right',
  enableAnimations: true,
  rtl: false,
  queue: {
    maxSize: 100,
    strategy: 'fifo',
  },
};

export class FeedbackManager implements IFeedbackManager {
  private static instance: FeedbackManager | null = null;
  
  private config: IFeedbackConfig;
  private queue: FeedbackQueue;
  private eventBus: EventBus<IFeedbackEvents>;
  private timers: Map<string, NodeJS.Timeout> = new Map();

  private constructor(config: Partial<IFeedbackConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.queue = new FeedbackQueue(this.config.queue);
    this.eventBus = new EventBus();
    
    this.setupEventListeners();
  }

  /** Get singleton instance */
  static getInstance(config?: Partial<IFeedbackConfig>): FeedbackManager {
    if (!FeedbackManager.instance) {
      FeedbackManager.instance = new FeedbackManager(config);
    }
    return FeedbackManager.instance;
  }

  /** Reset instance (for testing) */
  static resetInstance(): void {
    if (FeedbackManager.instance) {
      FeedbackManager.instance.destroy();
      FeedbackManager.instance = null;
    }
  }

  /** Add new feedback item */
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
      const duration = (options as IToastOptions).duration ?? this.config.defaultDuration;
      if (duration > 0) {
        this.scheduleRemoval(id, duration + this.config.enterAnimationDuration);
      }
    }

    // Enforce max visible
    this.enforceMaxVisible(type);

    return id;
  }

  /** Remove feedback item */
  remove(id: string): void {
    const item = useFeedbackStore.getState().get(id);
    if (!item || item.status === 'exiting' || item.status === 'removed') {
      return;
    }

    // Clear any pending timers
    this.clearTimer(id);

    // Start exit animation
    this.updateStatus(id, 'exiting');

    // Remove after animation
    setTimeout(() => {
      this.updateStatus(id, 'removed');
      useFeedbackStore.getState().remove(id);
      this.queue.dequeue(id);
      this.eventBus.emit('feedback:removed', item);
    }, this.config.exitAnimationDuration);
  }

  /** Remove all items */
  removeAll(type?: FeedbackType): void {
    const items = type
      ? useFeedbackStore.getState().getByType(type)
      : useFeedbackStore.getState().getAll();

    items.forEach(item => this.remove(item.id));
    
    this.eventBus.emit('feedback:cleared', { type });
  }

  /** Update feedback item */
  update<T extends FeedbackType>(
    id: string, 
    updates: Partial<FeedbackOptionsMap[T]>
  ): void {
    const item = useFeedbackStore.getState().get(id);
    if (!item) return;

    useFeedbackStore.getState().update(id, { options: { ...item.options, ...updates } });
    
    this.eventBus.emit('feedback:updated', { id, updates: { options: updates } });
  }

  /** Update item status */
  updateStatus(id: string, status: FeedbackStatus): void {
    const item = useFeedbackStore.getState().get(id);
    if (!item) return;

    const from = item.status;
    useFeedbackStore.getState().update(id, { status, updatedAt: Date.now() });
    
    this.eventBus.emit('feedback:statusChanged', { id, from, to: status });
  }

  /** Get item by ID */
  get(id: string): IFeedbackItem | undefined {
    return useFeedbackStore.getState().get(id);
  }

  /** Get all items */
  getAll(): IFeedbackItem[] {
    return useFeedbackStore.getState().getAll();
  }

  /** Get items by type */
  getByType<T extends FeedbackType>(type: T): IFeedbackItem<T>[] {
    return useFeedbackStore.getState().getByType(type) as IFeedbackItem<T>[];
  }

  /** Subscribe to events */
  on<E extends keyof IFeedbackEvents>(
    event: E,
    handler: (payload: IFeedbackEvents[E]) => void
  ): () => void {
    return this.eventBus.on(event, handler);
  }

  /** Get configuration */
  getConfig(): IFeedbackConfig {
    return { ...this.config };
  }

  /** Destroy manager */
  destroy(): void {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();

    // Clear store
    useFeedbackStore.getState().clear();

    // Clear queue
    this.queue.clear();

    // Remove all listeners
    this.eventBus.removeAllListeners();
  }

  // ==================== PRIVATE METHODS ====================

  private setupEventListeners(): void {
    // Log events in development
    if (process.env.NODE_ENV === 'development') {
      this.eventBus.on('feedback:added', (item) => {
        console.debug('[OmniFeedback] Added:', item.type, item.id);
      });
      
      this.eventBus.on('feedback:removed', (item) => {
        console.debug('[OmniFeedback] Removed:', item.type, item.id);
      });
    }
  }

  private scheduleStatusChange(id: string, status: FeedbackStatus, delay: number): void {
    if (delay === 0) {
      this.updateStatus(id, status);
      return;
    }

    const timer = setTimeout(() => {
      this.updateStatus(id, status);
    }, delay);

    // Store timer with unique key
    this.timers.set(`${id}:${status}`, timer);
  }

  private scheduleRemoval(id: string, delay: number): void {
    const timer = setTimeout(() => {
      this.remove(id);
    }, delay);

    this.timers.set(`${id}:removal`, timer);
  }

  private clearTimer(id: string): void {
    // Clear all timers for this ID
    this.timers.forEach((timer, key) => {
      if (key.startsWith(id)) {
        clearTimeout(timer);
        this.timers.delete(key);
      }
    });
  }

  private enforceMaxVisible(type: FeedbackType): void {
    const maxVisible = this.config.maxVisible[type] ?? Infinity;
    const items = this.getByType(type).filter(
      item => item.status !== 'exiting' && item.status !== 'removed'
    );

    if (items.length > maxVisible) {
      // Remove oldest items
      const toRemove = items.slice(0, items.length - maxVisible);
      toRemove.forEach(item => this.remove(item.id));
    }
  }
}

// Export singleton getter
export const getFeedbackManager = FeedbackManager.getInstance;
```

## FeedbackStore

### src/core/FeedbackStore.ts

```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { IFeedbackItem, FeedbackType } from './types';

interface FeedbackState {
  items: Map<string, IFeedbackItem>;

  // Actions
  add: (item: IFeedbackItem) => void;
  remove: (id: string) => void;
  update: (id: string, updates: Partial<IFeedbackItem>) => void;
  clear: () => void;

  // Selectors
  get: (id: string) => IFeedbackItem | undefined;
  getAll: () => IFeedbackItem[];
  getByType: (type: FeedbackType) => IFeedbackItem[];
  getByStatus: (status: string) => IFeedbackItem[];
}

export const useFeedbackStore = create<FeedbackState>()(
  subscribeWithSelector((set, get) => ({
    items: new Map(),

    add: (item) => {
      set((state) => {
        const newItems = new Map(state.items);
        newItems.set(item.id, item);
        return { items: newItems };
      });
    },

    remove: (id) => {
      set((state) => {
        const newItems = new Map(state.items);
        newItems.delete(id);
        return { items: newItems };
      });
    },

    update: (id, updates) => {
      set((state) => {
        const item = state.items.get(id);
        if (!item) return state;

        const newItems = new Map(state.items);
        newItems.set(id, { ...item, ...updates, updatedAt: Date.now() });
        return { items: newItems };
      });
    },

    clear: () => {
      set({ items: new Map() });
    },

    get: (id) => {
      return get().items.get(id);
    },

    getAll: () => {
      return Array.from(get().items.values());
    },

    getByType: (type) => {
      return Array.from(get().items.values()).filter(
        (item) => item.type === type
      );
    },

    getByStatus: (status) => {
      return Array.from(get().items.values()).filter(
        (item) => item.status === status
      );
    },
  }))
);

// Selector hooks for performance
export const useToasts = () => 
  useFeedbackStore((state) => 
    Array.from(state.items.values()).filter((item) => item.type === 'toast')
  );

export const useModals = () =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter((item) => item.type === 'modal')
  );

export const useLoadings = () =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter((item) => item.type === 'loading')
  );
```

## FeedbackQueue

### src/core/FeedbackQueue.ts

```typescript
import type { IFeedbackItem, IQueueConfig } from './types';

interface QueueEntry {
  item: IFeedbackItem;
  priority: number;
  timestamp: number;
}

export class FeedbackQueue {
  private entries: Map<string, QueueEntry> = new Map();
  private config: IQueueConfig;

  constructor(config: IQueueConfig) {
    this.config = config;
  }

  /** Add item to queue */
  enqueue(item: IFeedbackItem): boolean {
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

  /** Remove item from queue */
  dequeue(id: string): IFeedbackItem | undefined {
    const entry = this.entries.get(id);
    if (entry) {
      this.entries.delete(id);
      return entry.item;
    }
    return undefined;
  }

  /** Get items sorted by priority */
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

  /** Check if item exists */
  has(id: string): boolean {
    return this.entries.has(id);
  }

  /** Get queue size */
  get size(): number {
    return this.entries.size;
  }

  /** Clear queue */
  clear(): void {
    this.entries.clear();
  }

  // ==================== PRIVATE METHODS ====================

  private calculatePriority(item: IFeedbackItem): number {
    // Base priority by variant
    const variantPriority: Record<string, number> = {
      error: 100,
      warning: 75,
      success: 50,
      info: 25,
      default: 0,
    };

    const variant = (item.options as { variant?: string }).variant ?? 'default';
    const basePriority = variantPriority[variant] ?? 0;
    const customPriority = item.options.priority ?? 0;

    return basePriority + customPriority;
  }

  private handleOverflow(newItem: IFeedbackItem): boolean {
    switch (this.config.strategy) {
      case 'fifo': {
        // Remove oldest item
        const oldest = this.getOrdered().pop();
        if (oldest) {
          this.entries.delete(oldest.id);
          return this.enqueue(newItem);
        }
        return false;
      }

      case 'priority': {
        // Remove lowest priority item
        const sorted = Array.from(this.entries.values()).sort(
          (a, b) => a.priority - b.priority
        );
        const lowest = sorted[0];
        
        if (lowest && this.calculatePriority(newItem) > lowest.priority) {
          this.entries.delete(lowest.item.id);
          return this.enqueue(newItem);
        }
        return false;
      }

      case 'reject':
      default:
        return false;
    }
  }
}
```

## EventBus

### src/core/EventBus.ts

```typescript
type EventHandler<T = unknown> = (payload: T) => void;

export class EventBus<Events extends Record<string, unknown>> {
  private handlers: Map<keyof Events, Set<EventHandler>> = new Map();

  /** Subscribe to event */
  on<E extends keyof Events>(
    event: E,
    handler: EventHandler<Events[E]>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    const eventHandlers = this.handlers.get(event)!;
    eventHandlers.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      eventHandlers.delete(handler as EventHandler);
    };
  }

  /** Subscribe to event (one time) */
  once<E extends keyof Events>(
    event: E,
    handler: EventHandler<Events[E]>
  ): () => void {
    const wrapper = (payload: Events[E]) => {
      this.off(event, wrapper);
      handler(payload);
    };

    return this.on(event, wrapper);
  }

  /** Unsubscribe from event */
  off<E extends keyof Events>(
    event: E,
    handler: EventHandler<Events[E]>
  ): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler as EventHandler);
    }
  }

  /** Emit event */
  emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event handler for "${String(event)}":`, error);
        }
      });
    }
  }

  /** Remove all listeners */
  removeAllListeners(): void {
    this.handlers.clear();
  }

  /** Get listener count for event */
  listenerCount<E extends keyof Events>(event: E): number {
    return this.handlers.get(event)?.size ?? 0;
  }
}
```

## Utility Functions

### src/utils/generateId.ts

```typescript
let counter = 0;

/**
 * Generate unique ID for feedback items
 */
export function generateId(prefix: string = 'fb'): string {
  counter += 1;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${random}_${counter}`;
}
```

## Testing Checklist

### Unit Tests
- [ ] FeedbackManager singleton works correctly
- [ ] add() creates item with correct structure
- [ ] remove() triggers exit animation then removes
- [ ] removeAll() removes all items (or by type)
- [ ] update() updates item options
- [ ] updateStatus() updates item status
- [ ] get()/getAll()/getByType() return correct items
- [ ] Auto-dismiss works for toast/alert
- [ ] Max visible enforced correctly
- [ ] Timers cleaned up on remove

### FeedbackStore Tests
- [ ] add() adds to Map
- [ ] remove() removes from Map
- [ ] update() merges updates
- [ ] clear() empties Map
- [ ] Selectors return filtered items
- [ ] Zustand subscriptions work

### FeedbackQueue Tests
- [ ] enqueue() adds items
- [ ] dequeue() removes items
- [ ] Priority ordering works
- [ ] FIFO overflow strategy works
- [ ] Priority overflow strategy works
- [ ] Reject overflow strategy works

### EventBus Tests
- [ ] on() subscribes to events
- [ ] off() unsubscribes
- [ ] once() fires only once
- [ ] emit() calls all handlers
- [ ] Error in handler doesn't break others
- [ ] removeAllListeners() clears all

## Implementation Checklist

- [ ] Create src/core/types.ts with all types
- [ ] Create src/core/FeedbackManager.ts
- [ ] Create src/core/FeedbackStore.ts with Zustand
- [ ] Create src/core/FeedbackQueue.ts
- [ ] Create src/core/EventBus.ts
- [ ] Create src/utils/generateId.ts
- [ ] Create src/core/index.ts with exports
- [ ] Write unit tests for all modules
- [ ] Verify TypeScript strict mode passes
- [ ] Verify no `any` types used
- [ ] Test coverage >= 90%

## Common Pitfalls

### 1. Memory Leaks with Timers
❌ **Don't:** Forget to clear timers
✅ **Do:** Track all timers and clear on destroy/remove

### 2. Race Conditions
❌ **Don't:** Assume synchronous state updates
✅ **Do:** Use Zustand's getState() for immediate reads

### 3. Event Handler Errors
❌ **Don't:** Let one handler break others
✅ **Do:** Wrap handlers in try/catch

### 4. Stale Closures
❌ **Don't:** Reference stale state in callbacks
✅ **Do:** Use refs or getState() for current values

## Notes

- Core layer must be completely UI-agnostic
- No React dependencies in core (except Zustand store)
- Types must be comprehensive and exported
- Events enable loose coupling between layers
- Queue enables future features like rate limiting
