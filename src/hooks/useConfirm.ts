/**
 * useConfirm hook
 * Provides promise-based API for confirmation dialogs
 */

import { useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import type { IConfirmOptions } from '../core/types';

/**
 * Options for showing a confirm dialog
 */
export interface IConfirmShowOptions {
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
  /** Custom icon */
  icon?: ReactNode;
}

/**
 * Return type for useConfirm hook
 */
export interface IUseConfirmReturn {
  /** Show confirm dialog and await response */
  show: (options: IConfirmShowOptions) => Promise<boolean>;
  /** Show danger confirm for destructive actions */
  danger: (message: string, options?: Partial<IConfirmShowOptions>) => Promise<boolean>;
  /** Close confirm dialog by ID without response */
  close: (id: string) => void;
}

/**
 * Default options for confirm dialogs
 */
const DEFAULT_OPTIONS: Partial<IConfirmShowOptions> = {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'primary',
};

/**
 * useConfirm hook
 * Provides promise-based API for confirmation dialogs
 *
 * @returns Confirm management methods
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { show, danger } = useConfirm();
 *
 * // Basic confirm
 * const handleAction = async () => {
 *   const confirmed = await show({
 *     message: 'Are you sure you want to proceed?',
 *   });
 *
 *   if (confirmed) {
 *     // User clicked confirm
 *   }
 * };
 *
 * // Danger confirm for destructive actions
 * const handleDelete = async () => {
 *   const confirmed = await danger(
 *     'This will permanently delete your data.',
 *     { title: 'Delete Account', confirmText: 'Delete' }
 *   );
 *
 *   if (confirmed) {
 *     await deleteAccount();
 *   }
 * };
 * ```
 */
export function useConfirm(): IUseConfirmReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useConfirm must be used within FeedbackProvider');
  }

  const { manager } = context;

  /**
   * Show confirm dialog and return Promise
   * Resolves to true if confirmed, false if cancelled.
   * Also resolves to false if the item is removed externally (e.g. via removeAll).
   */
  const show = useCallback(
    (options: IConfirmShowOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        let resolved = false;

        const safeResolve = (value: boolean): void => {
          if (resolved) {return;}
          resolved = true;
          unsubscribe();
          resolve(value);
        };

        const id = manager.add('confirm', {
          ...DEFAULT_OPTIONS,
          ...options,
          onConfirm: () => {
            safeResolve(true);
            manager.remove(id);
          },
          onCancel: () => {
            safeResolve(false);
            manager.remove(id);
          },
        } as IConfirmOptions);

        // Listen for external removal to prevent Promise leak
        const unsubscribe = manager.on('feedback:removed', (removedItem) => {
          if (removedItem.id === id) {
            safeResolve(false);
          }
        });
      });
    },
    [manager]
  );

  /**
   * Show danger confirm for destructive actions
   * Pre-configured with danger styling
   */
  const danger = useCallback(
    (
      message: string,
      options?: Partial<IConfirmShowOptions>
    ): Promise<boolean> => {
      return show({
        message,
        title: 'Are you sure?',
        confirmText: 'Delete',
        confirmVariant: 'danger',
        ...options,
      });
    },
    [show]
  );

  /**
   * Close confirm dialog by ID without triggering callbacks
   */
  const close = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  return {
    show,
    danger,
    close,
  };
}
