/**
 * useProgress hook
 * Provides methods to show, update, and manage progress indicators
 */

import { useCallback, useContext } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IProgressOptions, IFeedbackItem } from '../core/types';

/**
 * Progress item from the store
 */
export interface IProgressItem extends IFeedbackItem<'progress'> {
  options: IProgressOptions;
}

/**
 * Return type for useProgress hook
 */
export interface IUseProgressReturn {
  /** Show progress indicator with options */
  show: (options: IProgressOptions) => string;
  /** Update progress value and optionally other options */
  update: (id: string, value: number, options?: Partial<IProgressOptions>) => void;
  /** Mark progress as complete (sets to 100% then removes) */
  complete: (id: string) => void;
  /** Remove progress indicator */
  remove: (id: string) => void;
  /** Remove all progress indicators */
  removeAll: () => void;
  /** Toggle indeterminate mode */
  setIndeterminate: (id: string, indeterminate: boolean) => void;
  /** Get all active progress indicators */
  indicators: IProgressItem[];
}

/**
 * Default options for progress indicators
 */
const DEFAULT_OPTIONS: Partial<IProgressOptions> = {
  max: 100,
  indeterminate: false,
  size: 'md',
  type: 'linear',
  animated: false,
  striped: false,
  showPercentage: false,
  variant: 'info',
};

/**
 * useProgress hook
 * Provides methods to manage progress indicators
 *
 * @returns Progress management methods and state
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { show, update, complete, remove, indicators } = useProgress();
 *
 * // Show progress and update it
 * const id = show({ value: 0, label: 'Uploading...' });
 * for (let i = 0; i <= 100; i += 10) {
 *   await delay(200);
 *   update(id, i);
 * }
 * complete(id);
 *
 * // Indeterminate mode
 * const loadingId = show({ value: 0, indeterminate: true, label: 'Loading...' });
 *
 * // Circular progress
 * show({ value: 75, type: 'circular', showPercentage: true });
 *
 * // Render indicators
 * return <ProgressContainer />;
 * ```
 */
export function useProgress(): IUseProgressReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useProgress must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get progress indicators from store
  const indicators = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IProgressItem =>
        item.type === 'progress' && item.status !== 'removed'
    )
  );

  // Show progress indicator
  const show = useCallback(
    (options: IProgressOptions): string => {
      return manager.add('progress', {
        ...DEFAULT_OPTIONS,
        ...options,
      } as IProgressOptions);
    },
    [manager]
  );

  // Update progress value
  const update = useCallback(
    (id: string, value: number, options?: Partial<IProgressOptions>): void => {
      const indicator = manager.get(id);
      if (indicator) {
        const currentOptions = indicator.options as IProgressOptions;
        const max = options?.max ?? currentOptions.max ?? 100;

        manager.update(id, {
          value,
          ...options,
        });

        // Check if complete
        if (value >= max && currentOptions.onComplete) {
          currentOptions.onComplete();
        }
      }
    },
    [manager]
  );

  // Complete progress (set to 100% and remove after delay)
  const complete = useCallback(
    (id: string): void => {
      const indicator = manager.get(id);
      if (indicator) {
        const options = indicator.options as IProgressOptions;
        const max = options.max ?? 100;

        // Set to max value
        manager.update(id, { value: max, indeterminate: false });

        // Call onComplete callback
        options.onComplete?.();

        // Remove after a short delay
        setTimeout(() => {
          manager.remove(id);
        }, 500);
      }
    },
    [manager]
  );

  // Remove progress indicator
  const remove = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  // Remove all progress indicators
  const removeAll = useCallback((): void => {
    manager.removeAll('progress');
  }, [manager]);

  // Toggle indeterminate mode
  const setIndeterminate = useCallback(
    (id: string, indeterminate: boolean): void => {
      manager.update(id, { indeterminate });
    },
    [manager]
  );

  return {
    show,
    update,
    complete,
    remove,
    removeAll,
    setIndeterminate,
    indicators,
  };
}
