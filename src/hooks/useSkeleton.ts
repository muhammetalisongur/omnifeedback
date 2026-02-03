/**
 * useSkeleton hook
 * Provides imperative control for skeleton loading states
 * Useful for async operations and data fetching
 */

import { useCallback, useContext } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { ISkeletonOptions, IFeedbackItem } from '../core/types';

/**
 * Skeleton item from the store
 */
export interface ISkeletonItem extends IFeedbackItem<'skeleton'> {
  options: ISkeletonOptions;
}

/**
 * Return type for useSkeleton hook
 */
export interface IUseSkeletonReturn {
  /** Show skeleton with ID */
  show: (id: string, options?: Partial<ISkeletonOptions>) => void;
  /** Hide skeleton by ID */
  hide: (id: string) => void;
  /** Hide all skeletons */
  hideAll: () => void;
  /** Check if skeleton is visible */
  isVisible: (id: string) => boolean;
  /** Wrap async function with skeleton */
  wrap: <T>(
    id: string,
    fn: () => Promise<T>,
    options?: Partial<ISkeletonOptions>
  ) => Promise<T>;
}

/**
 * useSkeleton hook
 * Provides imperative control for skeleton loading indicators
 *
 * @returns Skeleton management methods
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { show, hide, wrap, isVisible } = useSkeleton();
 *
 * // Basic usage
 * useEffect(() => {
 *   show('user-list');
 *   fetchUsers()
 *     .then(setUsers)
 *     .finally(() => hide('user-list'));
 * }, []);
 *
 * // Using wrap helper
 * const loadUsers = async () => {
 *   const users = await wrap('user-list', fetchUsers);
 *   setUsers(users);
 * };
 *
 * // Check visibility
 * if (isVisible('user-list')) {
 *   console.log('Loading users...');
 * }
 * ```
 */
export function useSkeleton(): IUseSkeletonReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useSkeleton must be used within FeedbackProvider');
  }

  const { manager } = context;

  /**
   * Show skeleton with specified ID
   */
  const show = useCallback(
    (id: string, options: Partial<ISkeletonOptions> = {}): void => {
      // Check if skeleton with this ID already exists
      const existing = manager.get(id);
      if (existing && existing.type === 'skeleton') {
        // Already showing, no need to add again
        return;
      }

      manager.add('skeleton', {
        id,
        ...options,
      });
    },
    [manager]
  );

  /**
   * Hide skeleton by ID
   */
  const hide = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  /**
   * Hide all skeletons
   */
  const hideAll = useCallback((): void => {
    manager.removeAll('skeleton');
  }, [manager]);

  /**
   * Check if skeleton is visible
   */
  const isVisible = useCallback(
    (id: string): boolean => {
      const state = useFeedbackStore.getState();
      return Array.from(state.items.values()).some(
        (item) =>
          item.type === 'skeleton' &&
          item.id === id &&
          item.status !== 'removed'
      );
    },
    []
  );

  /**
   * Wrap async function with skeleton
   * Shows skeleton before executing, hides after completion
   */
  const wrap = useCallback(
    async <T>(
      id: string,
      fn: () => Promise<T>,
      options?: Partial<ISkeletonOptions>
    ): Promise<T> => {
      show(id, options);
      try {
        return await fn();
      } finally {
        hide(id);
      }
    },
    [show, hide]
  );

  return {
    show,
    hide,
    hideAll,
    isVisible,
    wrap,
  };
}
