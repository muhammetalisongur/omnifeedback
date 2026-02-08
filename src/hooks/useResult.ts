/**
 * useResult hook
 * Provides imperative control for result page displays
 * Useful for showing operation outcomes programmatically
 */

import { useCallback, useContext } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IResultOptions, IResultActionOptions, ResultStatus, IFeedbackItem } from '../core/types';

/**
 * Result item from the store
 */
export interface IResultItem extends IFeedbackItem<'result'> {
  options: IResultOptions;
}

/**
 * Options for showing a result (without status)
 */
export interface IResultShowOptions {
  /** Main title text */
  title: string;
  /** Description text */
  description?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Primary action button */
  primaryAction?: IResultActionOptions;
  /** Secondary action button */
  secondaryAction?: IResultActionOptions;
  /** Extra content */
  extra?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom ID */
  id?: string;
}

/**
 * Return type for useResult hook
 */
export interface IUseResultReturn {
  /** Show success result */
  success: (options: IResultShowOptions) => string;
  /** Show error result */
  error: (options: IResultShowOptions) => string;
  /** Show info result */
  info: (options: IResultShowOptions) => string;
  /** Show warning result */
  warning: (options: IResultShowOptions) => string;
  /** Show generic result with any status */
  show: (status: ResultStatus, options: IResultShowOptions) => string;
  /** Hide result by ID */
  hide: (id: string) => void;
  /** Hide all results */
  hideAll: () => void;
  /** Check if result is visible */
  isVisible: (id: string) => boolean;
}

/**
 * useResult hook
 * Provides imperative control for displaying result pages
 *
 * @returns Result management methods
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { success, error } = useResult();
 *
 * // Show success result
 * const handlePayment = async () => {
 *   try {
 *     await processPayment();
 *     success({
 *       title: 'Payment Successful!',
 *       description: 'Your order has been placed.',
 *       primaryAction: {
 *         label: 'View Order',
 *         onClick: () => navigate('/orders'),
 *       },
 *     });
 *   } catch (err) {
 *     error({
 *       title: 'Payment Failed',
 *       description: err.message,
 *       primaryAction: {
 *         label: 'Try Again',
 *         onClick: handlePayment,
 *       },
 *     });
 *   }
 * };
 * ```
 */
export function useResult(): IUseResultReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useResult must be used within FeedbackProvider');
  }

  const { manager } = context;

  /**
   * Show result with specified status
   */
  const show = useCallback(
    (status: ResultStatus, options: IResultShowOptions): string => {
      const { id, ...rest } = options;
      return manager.add('result', {
        status,
        ...rest,
        ...(id !== undefined && { id }),
      });
    },
    [manager]
  );

  /**
   * Show success result
   */
  const success = useCallback(
    (options: IResultShowOptions): string => {
      return show('success', options);
    },
    [show]
  );

  /**
   * Show error result
   */
  const error = useCallback(
    (options: IResultShowOptions): string => {
      return show('error', options);
    },
    [show]
  );

  /**
   * Show info result
   */
  const info = useCallback(
    (options: IResultShowOptions): string => {
      return show('info', options);
    },
    [show]
  );

  /**
   * Show warning result
   */
  const warning = useCallback(
    (options: IResultShowOptions): string => {
      return show('warning', options);
    },
    [show]
  );

  /**
   * Hide result by ID
   */
  const hide = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  /**
   * Hide all results
   */
  const hideAll = useCallback((): void => {
    manager.removeAll('result');
  }, [manager]);

  /**
   * Check if result is visible
   */
  const isVisible = useCallback((id: string): boolean => {
    const state = useFeedbackStore.getState();
    return Array.from(state.items.values()).some(
      (item) =>
        item.type === 'result' &&
        item.id === id &&
        item.status !== 'removed'
    );
  }, []);

  return {
    success,
    error,
    info,
    warning,
    show,
    hide,
    hideAll,
    isVisible,
  };
}
