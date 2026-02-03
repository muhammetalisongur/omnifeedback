/**
 * Zustand-based state store for feedback items
 * Provides reactive state management with selector support
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  IFeedbackItem,
  IFeedbackStoreState,
  FeedbackType,
  FeedbackStatus,
} from './types';

/**
 * Create the feedback store with Zustand
 * Uses subscribeWithSelector middleware for fine-grained subscriptions
 */
export const useFeedbackStore = create<IFeedbackStoreState>()(
  subscribeWithSelector((set, get) => ({
    items: new Map(),

    add: (item: IFeedbackItem): void => {
      set((state) => {
        const newItems = new Map(state.items);
        newItems.set(item.id, item);
        return { items: newItems };
      });
    },

    remove: (id: string): void => {
      set((state) => {
        const newItems = new Map(state.items);
        newItems.delete(id);
        return { items: newItems };
      });
    },

    update: (id: string, updates: Partial<IFeedbackItem>): void => {
      set((state) => {
        const item = state.items.get(id);
        if (!item) {
          return state;
        }

        const newItems = new Map(state.items);
        newItems.set(id, {
          ...item,
          ...updates,
          updatedAt: Date.now(),
        });
        return { items: newItems };
      });
    },

    clear: (): void => {
      set({ items: new Map() });
    },

    get: (id: string): IFeedbackItem | undefined => {
      return get().items.get(id);
    },

    getAll: (): IFeedbackItem[] => {
      return Array.from(get().items.values());
    },

    getByType: <T extends FeedbackType>(type: T): IFeedbackItem<T>[] => {
      return Array.from(get().items.values()).filter(
        (item): item is IFeedbackItem<T> => item.type === type
      );
    },

    getByStatus: (status: FeedbackStatus): IFeedbackItem[] => {
      return Array.from(get().items.values()).filter(
        (item) => item.status === status
      );
    },
  }))
);

// ==================== SELECTOR HOOKS ====================

/**
 * Select all toast items from the store
 */
export const useToasts = (): IFeedbackItem<'toast'>[] =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'toast'> => item.type === 'toast'
    )
  );

/**
 * Select all modal items from the store
 */
export const useModals = (): IFeedbackItem<'modal'>[] =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'modal'> => item.type === 'modal'
    )
  );

/**
 * Select all loading items from the store
 */
export const useLoadings = (): IFeedbackItem<'loading'>[] =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'loading'> => item.type === 'loading'
    )
  );

/**
 * Select all alert items from the store
 */
export const useAlerts = (): IFeedbackItem<'alert'>[] =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'alert'> => item.type === 'alert'
    )
  );

/**
 * Select all progress items from the store
 */
export const useProgresses = (): IFeedbackItem<'progress'>[] =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'progress'> => item.type === 'progress'
    )
  );

/**
 * Select all confirm items from the store
 */
export const useConfirms = (): IFeedbackItem<'confirm'>[] =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'confirm'> => item.type === 'confirm'
    )
  );

/**
 * Select visible items (not exiting or removed)
 */
export const useVisibleItems = (): IFeedbackItem[] =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.status !== 'exiting' && item.status !== 'removed'
    )
  );

/**
 * Select item count
 */
export const useItemCount = (): number =>
  useFeedbackStore((state) => state.items.size);

/**
 * Select item by ID
 */
export const useItem = (id: string): IFeedbackItem | undefined =>
  useFeedbackStore((state) => state.items.get(id));

/**
 * Check if any items exist for a type
 */
export const useHasType = (type: FeedbackType): boolean =>
  useFeedbackStore((state) =>
    Array.from(state.items.values()).some((item) => item.type === type)
  );

/**
 * Get items grouped by position (for toasts)
 */
export const useToastsByPosition = (): Map<string, IFeedbackItem<'toast'>[]> =>
  useFeedbackStore((state) => {
    const toasts = Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'toast'> => item.type === 'toast'
    );

    const grouped = new Map<string, IFeedbackItem<'toast'>[]>();

    for (const toast of toasts) {
      const position = toast.options.position ?? 'top-right';
      const existing = grouped.get(position) ?? [];
      grouped.set(position, [...existing, toast]);
    }

    return grouped;
  });
