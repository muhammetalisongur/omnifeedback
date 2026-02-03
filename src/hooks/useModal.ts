/**
 * useModal hook - Provides modal dialog functionality
 * Convenient wrapper around FeedbackManager for modal operations
 */

import { useCallback, useMemo } from 'react';
import { useFeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IModalOptions, IFeedbackItem } from '../core/types';

/**
 * useModal return type
 */
export interface IUseModalReturn {
  /** Open modal with full options */
  open: (options: IModalOptions) => string;
  /** Close specific modal by ID */
  close: (id: string) => void;
  /** Close all open modals */
  closeAll: () => void;
  /** Update existing modal options */
  update: (id: string, options: Partial<IModalOptions>) => void;
  /** Check if any modal is open */
  isOpen: boolean;
  /** Array of currently open modal IDs */
  openModals: string[];
}

/**
 * Default modal options
 */
const DEFAULT_MODAL_OPTIONS: Partial<IModalOptions> = {
  size: 'md',
  closable: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
  preventScroll: true,
  returnFocus: true,
  centered: false,
  scrollBehavior: 'inside',
};

/**
 * useModal hook
 *
 * Provides methods to open, close, and manage modal dialogs.
 * Must be used within FeedbackProvider.
 *
 * @returns Modal methods and state
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const modal = useModal();
 *
 *   const handleOpenModal = () => {
 *     const id = modal.open({
 *       title: 'Confirmation',
 *       content: <p>Are you sure?</p>,
 *       footer: (
 *         <div className="flex gap-2 justify-end">
 *           <button onClick={() => modal.close(id)}>Cancel</button>
 *           <button onClick={() => handleConfirm(id)}>Confirm</button>
 *         </div>
 *       ),
 *     });
 *   };
 *
 *   return <button onClick={handleOpenModal}>Open Modal</button>;
 * }
 * ```
 */
export function useModal(): IUseModalReturn {
  const { manager } = useFeedbackContext();

  // Get open modals from store
  const modals = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'modal'> =>
        item.type === 'modal' && item.status !== 'removed'
    )
  );

  // Get array of open modal IDs
  const openModals = useMemo(() => modals.map((m) => m.id), [modals]);

  // Check if any modal is open
  const isOpen = openModals.length > 0;

  /**
   * Open modal with options
   */
  const open = useCallback(
    (options: IModalOptions): string => {
      const mergedOptions = {
        ...DEFAULT_MODAL_OPTIONS,
        ...options,
      };

      const id = manager.add('modal', mergedOptions);

      // Call onOpen callback
      options.onOpen?.();

      return id;
    },
    [manager]
  );

  /**
   * Close specific modal by ID
   */
  const close = useCallback(
    (id: string): void => {
      const modal = manager.get(id);

      if (modal && modal.type === 'modal') {
        // Call onClose callback before removing
        const options = modal.options as IModalOptions;
        options.onClose?.();

        manager.remove(id);
      }
    },
    [manager]
  );

  /**
   * Close all open modals
   */
  const closeAll = useCallback((): void => {
    // Close each modal to trigger onClose callbacks
    openModals.forEach((id) => close(id));
  }, [openModals, close]);

  /**
   * Update existing modal options
   */
  const update = useCallback(
    (id: string, options: Partial<IModalOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  return {
    open,
    close,
    closeAll,
    update,
    isOpen,
    openModals,
  };
}
