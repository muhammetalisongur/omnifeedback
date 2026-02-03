/**
 * usePopconfirm hook
 * Provides methods to show popover-based confirmation dialogs
 * Promise-based API for easy async/await usage
 */

import { useCallback, useContext, useRef, type RefObject } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IPopconfirmOptions, IFeedbackItem } from '../core/types';

/**
 * Popconfirm item from the store
 */
export interface IPopconfirmItem extends IFeedbackItem<'popconfirm'> {
  options: IPopconfirmOptions;
}

/**
 * Options for show method (target is required separately)
 */
export interface IPopconfirmShowOptions extends Omit<IPopconfirmOptions, 'target' | 'onConfirm' | 'onCancel'> {
  /** Target element to attach to */
  target: HTMLElement | RefObject<HTMLElement>;
}

/**
 * Return type for usePopconfirm hook
 */
export interface IUsePopconfirmReturn {
  /** Show popconfirm and await response */
  show: (options: IPopconfirmShowOptions) => Promise<boolean>;
  /** Show danger popconfirm */
  danger: (
    target: HTMLElement | RefObject<HTMLElement>,
    message: string,
    options?: Partial<Omit<IPopconfirmShowOptions, 'target' | 'message'>>
  ) => Promise<boolean>;
  /** Close popconfirm without response (resolves false) */
  close: () => void;
  /** Check if popconfirm is open */
  isOpen: boolean;
}

/**
 * Default options for popconfirm
 */
const DEFAULT_OPTIONS: Partial<IPopconfirmOptions> = {
  confirmText: 'Yes',
  cancelText: 'No',
  confirmVariant: 'primary',
  placement: 'top',
  showArrow: true,
  offset: 8,
  closeOnClickOutside: true,
};

/**
 * usePopconfirm hook
 * Provides popover-based confirmation dialogs for inline actions
 *
 * @returns Popconfirm management methods and state
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { show, danger, close, isOpen } = usePopconfirm();
 *
 * // Basic usage with event target
 * const handleDelete = async (e: React.MouseEvent) => {
 *   const confirmed = await show({
 *     target: e.currentTarget as HTMLElement,
 *     message: 'Delete this item?',
 *   });
 *
 *   if (confirmed) {
 *     await deleteItem();
 *   }
 * };
 *
 * // Danger variant (red confirm button)
 * const handlePermanentDelete = async (e: React.MouseEvent) => {
 *   const confirmed = await danger(
 *     e.currentTarget as HTMLElement,
 *     'This action cannot be undone!',
 *     { title: 'Warning' }
 *   );
 *
 *   if (confirmed) {
 *     await permanentDelete();
 *   }
 * };
 *
 * // With ref
 * const buttonRef = useRef<HTMLButtonElement>(null);
 *
 * const handleWithRef = async () => {
 *   const confirmed = await show({
 *     target: buttonRef,
 *     message: 'Confirm action?',
 *     placement: 'bottom',
 *   });
 * };
 * ```
 */
export function usePopconfirm(): IUsePopconfirmReturn {
  const context = useContext(FeedbackContext);
  const currentIdRef = useRef<string | null>(null);

  if (!context) {
    throw new Error('usePopconfirm must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get current popconfirm from store
  const popconfirm = useFeedbackStore((state) => {
    const items = Array.from(state.items.values()).filter(
      (item): item is IPopconfirmItem =>
        item.type === 'popconfirm' && item.status !== 'removed'
    );
    return items[0] ?? null;
  });

  const isOpen = popconfirm !== null;

  /**
   * Show popconfirm and return promise
   */
  const show = useCallback(
    (options: IPopconfirmShowOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        // Close any existing popconfirm immediately (no animation)
        // Use store directly for instant removal when replacing
        if (currentIdRef.current) {
          useFeedbackStore.getState().remove(currentIdRef.current);
          currentIdRef.current = null;
        }

        const mergedOptions: IPopconfirmOptions = {
          ...DEFAULT_OPTIONS,
          ...options,
          onConfirm: () => {
            manager.remove(id);
            currentIdRef.current = null;
            resolve(true);
          },
          onCancel: () => {
            manager.remove(id);
            currentIdRef.current = null;
            resolve(false);
          },
        };

        const id = manager.add('popconfirm', mergedOptions);
        currentIdRef.current = id;
      });
    },
    [manager]
  );

  /**
   * Show danger popconfirm (red confirm button)
   */
  const danger = useCallback(
    (
      target: HTMLElement | RefObject<HTMLElement>,
      message: string,
      options?: Partial<Omit<IPopconfirmShowOptions, 'target' | 'message'>>
    ): Promise<boolean> => {
      return show({
        target,
        message,
        confirmVariant: 'danger',
        confirmText: 'Delete',
        ...options,
      });
    },
    [show]
  );

  /**
   * Close popconfirm programmatically (resolves false)
   */
  const close = useCallback((): void => {
    if (currentIdRef.current) {
      const item = manager.get(currentIdRef.current);
      if (item) {
        const options = item.options as IPopconfirmOptions;
        options.onCancel?.();
      }
      manager.remove(currentIdRef.current);
      currentIdRef.current = null;
    }
  }, [manager]);

  return {
    show,
    danger,
    close,
    isOpen,
  };
}
