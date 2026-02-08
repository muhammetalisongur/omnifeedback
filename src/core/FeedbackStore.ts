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

