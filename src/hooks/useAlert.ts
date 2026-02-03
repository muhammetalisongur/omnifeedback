/**
 * useAlert hook
 * Provides methods to show, dismiss, and manage inline alerts
 */

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type {
  IAlertOptions,
  IFeedbackItem,
  FeedbackVariant,
} from '../core/types';

/**
 * Alert item from the store
 */
export interface IAlertItem extends IFeedbackItem<'alert'> {
  options: IAlertOptions;
}

/**
 * Return type for useAlert hook
 */
export interface IUseAlertReturn {
  /** Show alert with full options */
  show: (options: IAlertOptions) => string;
  /** Show success alert */
  success: (message: string, options?: Partial<IAlertOptions>) => string;
  /** Show error alert */
  error: (message: string, options?: Partial<IAlertOptions>) => string;
  /** Show warning alert */
  warning: (message: string, options?: Partial<IAlertOptions>) => string;
  /** Show info alert */
  info: (message: string, options?: Partial<IAlertOptions>) => string;
  /** Dismiss specific alert */
  dismiss: (id: string) => void;
  /** Dismiss all alerts */
  dismissAll: () => void;
  /** Update alert content */
  update: (id: string, options: Partial<IAlertOptions>) => void;
  /** Get all active alerts */
  alerts: IAlertItem[];
}

/**
 * Default options for alerts
 */
const DEFAULT_OPTIONS: Partial<IAlertOptions> = {
  dismissible: true,
  duration: 0,
  bordered: true,
  filled: false,
  hideIcon: false,
  variant: 'default',
};

/**
 * useAlert hook
 * Provides methods to manage inline alerts
 *
 * @returns Alert management methods and state
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { success, error, warning, info, dismiss, alerts } = useAlert();
 *
 * // Show success alert
 * const id = success('Your changes have been saved.');
 *
 * // Show error with title
 * error('Failed to save.', { title: 'Error' });
 *
 * // Show with actions
 * const alertId = show({
 *   message: 'Are you sure?',
 *   variant: 'warning',
 *   actions: [
 *     { label: 'Cancel', onClick: () => dismiss(alertId) },
 *     { label: 'Confirm', onClick: handleConfirm, variant: 'primary' },
 *   ],
 * });
 *
 * // Render alerts
 * return <AlertContainer />;
 * ```
 */
export function useAlert(): IUseAlertReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useAlert must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get alerts from store
  const alerts = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IAlertItem =>
        item.type === 'alert' && item.status !== 'removed'
    )
  );

  // Show alert with full options
  const show = useCallback(
    (options: IAlertOptions): string => {
      return manager.add('alert', {
        ...DEFAULT_OPTIONS,
        ...options,
      } as IAlertOptions);
    },
    [manager]
  );

  // Create variant-specific show function
  const createVariantShow = useCallback(
    (variant: FeedbackVariant) =>
      (message: string, options?: Partial<IAlertOptions>): string => {
        return show({
          message,
          variant,
          ...options,
        } as IAlertOptions);
      },
    [show]
  );

  // Variant shortcuts
  const success = useMemo(
    () => createVariantShow('success'),
    [createVariantShow]
  );

  const error = useMemo(
    () => createVariantShow('error'),
    [createVariantShow]
  );

  const warning = useMemo(
    () => createVariantShow('warning'),
    [createVariantShow]
  );

  const info = useMemo(
    () => createVariantShow('info'),
    [createVariantShow]
  );

  // Dismiss specific alert
  const dismiss = useCallback(
    (id: string): void => {
      const alert = manager.get(id);
      if (alert) {
        const options = alert.options as IAlertOptions;
        options.onDismiss?.();
        manager.remove(id);
      }
    },
    [manager]
  );

  // Dismiss all alerts
  const dismissAll = useCallback((): void => {
    manager.removeAll('alert');
  }, [manager]);

  // Update alert
  const update = useCallback(
    (id: string, options: Partial<IAlertOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  return {
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
    update,
    alerts,
  };
}
