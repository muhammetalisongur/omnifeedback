/**
 * useLoading hook - Provides loading indicator functionality
 * Convenient wrapper around FeedbackManager for loading operations
 * Includes wrap() helper for async functions
 */

import { useCallback, useMemo } from 'react';
import { useFeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { ILoadingOptions, IFeedbackItem } from '../core/types';

/**
 * useLoading return type
 */
export interface IUseLoadingReturn {
  /** Show loading indicator */
  show: (options?: ILoadingOptions) => string;
  /** Hide specific loading indicator */
  hide: (id: string) => void;
  /** Hide all loading indicators */
  hideAll: () => void;
  /** Update loading options */
  update: (id: string, options: Partial<ILoadingOptions>) => void;
  /** Wrap async function with loading indicator */
  wrap: <T>(fn: () => Promise<T>, options?: ILoadingOptions) => Promise<T>;
  /** Check if any loading is active */
  isLoading: boolean;
  /** Get active loading IDs */
  activeLoadings: string[];
}

/**
 * Default loading options
 */
const DEFAULT_LOADING_OPTIONS: Partial<ILoadingOptions> = {
  spinner: 'default',
  overlay: false,
  overlayOpacity: 0.5,
  blur: false,
  blurAmount: '4px',
  cancellable: false,
  size: 'md',
  variant: 'primary',
};

/**
 * useLoading hook
 *
 * Provides methods to show, hide, and manage loading indicators.
 * Includes a convenient wrap() helper for async operations.
 * Must be used within FeedbackProvider.
 *
 * @returns Loading methods and state
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const loading = useLoading();
 *
 *   // Manual show/hide
 *   const handleManual = async () => {
 *     const id = loading.show({ message: 'Processing...' });
 *     try {
 *       await doSomething();
 *     } finally {
 *       loading.hide(id);
 *     }
 *   };
 *
 *   // Using wrap() helper
 *   const handleWrap = async () => {
 *     const result = await loading.wrap(
 *       () => fetchData(),
 *       { message: 'Loading...' }
 *     );
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleManual}>Manual</button>
 *       <button onClick={handleWrap}>Wrapped</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLoading(): IUseLoadingReturn {
  const { manager } = useFeedbackContext();

  // Get active loadings from store
  const loadings = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'loading'> =>
        item.type === 'loading' && item.status !== 'removed'
    )
  );

  // Get array of active loading IDs
  const activeLoadings = useMemo(() => loadings.map((l) => l.id), [loadings]);

  // Check if any loading is active
  const isLoading = activeLoadings.length > 0;

  /**
   * Show loading indicator
   */
  const show = useCallback(
    (options: ILoadingOptions = {}): string => {
      const mergedOptions = {
        ...DEFAULT_LOADING_OPTIONS,
        ...options,
      };

      return manager.add('loading', mergedOptions as ILoadingOptions);
    },
    [manager]
  );

  /**
   * Hide specific loading indicator
   */
  const hide = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  /**
   * Hide all loading indicators
   */
  const hideAll = useCallback((): void => {
    manager.removeAll('loading');
  }, [manager]);

  /**
   * Update loading options
   */
  const update = useCallback(
    (id: string, options: Partial<ILoadingOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  /**
   * Wrap async function with loading indicator
   *
   * Automatically shows loading before execution and hides it after,
   * regardless of success or failure. Ensures cleanup via try/finally.
   *
   * @param fn - Async function to execute
   * @param options - Loading options
   * @returns Promise with the function result
   *
   * @example
   * ```tsx
   * const data = await loading.wrap(
   *   () => fetchUserData(userId),
   *   { message: 'Loading user...' }
   * );
   * ```
   */
  const wrap = useCallback(
    async <T>(fn: () => Promise<T>, options: ILoadingOptions = {}): Promise<T> => {
      const id = show(options);
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
    update,
    wrap,
    isLoading,
    activeLoadings,
  };
}
