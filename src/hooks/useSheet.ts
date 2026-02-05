/**
 * useSheet hook - Imperative API for bottom sheets
 * Provides methods for showing sheets, action sheets, and confirm sheets
 */

import { useCallback, useMemo, createElement } from 'react';
import type { ReactNode } from 'react';
import { useFeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { ISheetOptions, IBaseFeedbackOptions } from '../core/types';
import {
  ActionSheetContent,
  SheetConfirmContent,
} from '../components/Sheet/ActionSheetContent';
import type { IActionItem } from '../components/Sheet/ActionSheetContent';

/**
 * Options for showing a sheet
 */
export interface ISheetShowOptions extends Omit<ISheetOptions, 'content'> {
  /** Sheet content (required) */
  content: ReactNode;
}

/**
 * Options for action sheet
 */
export interface IActionSheetOptions extends IBaseFeedbackOptions {
  /** Title for the action sheet */
  title?: string;
  /** Description text */
  description?: string;
  /** List of actions */
  actions: IActionItem[];
  /** Show cancel button */
  showCancel?: boolean;
  /** Cancel button text */
  cancelText?: string;
}

/**
 * Options for confirm sheet
 */
export interface ISheetConfirmOptions extends IBaseFeedbackOptions {
  /** Confirmation title */
  title: string;
  /** Description text */
  description?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Destructive action */
  destructive?: boolean;
}

/**
 * Sheet item for tracking
 */
export interface ISheetItem {
  /** Sheet ID */
  id: string;
  /** Sheet options */
  options: ISheetShowOptions;
}

/**
 * Return type for useSheet hook
 */
export interface IUseSheetReturn {
  /**
   * Open a sheet with custom content
   * @param options Sheet options
   * @returns Sheet ID
   */
  open: (options: ISheetShowOptions) => string;

  /**
   * Show an iOS-style action sheet
   * @param options Action sheet options
   * @returns Promise resolving to selected action key or null if cancelled
   */
  showActions: (options: IActionSheetOptions) => Promise<string | null>;

  /**
   * Show a confirmation sheet
   * @param options Confirm sheet options
   * @returns Promise resolving to true if confirmed, false if cancelled
   */
  confirm: (options: ISheetConfirmOptions) => Promise<boolean>;

  /**
   * Close a specific sheet
   * @param id Sheet ID to close
   */
  close: (id: string) => void;

  /**
   * Close all sheets
   */
  closeAll: () => void;

  /**
   * Check if any sheet is open
   */
  isOpen: boolean;
}

/**
 * Hook for managing bottom sheets
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const sheet = useSheet();
 *
 *   // Open custom content sheet
 *   const handleOpenSheet = () => {
 *     sheet.open({
 *       title: 'Settings',
 *       content: <SettingsPanel />,
 *       snapPoints: [50, 90],
 *     });
 *   };
 *
 *   // Show action sheet
 *   const handleShowActions = async () => {
 *     const action = await sheet.showActions({
 *       title: 'Choose Photo',
 *       actions: [
 *         { key: 'camera', label: 'Take Photo' },
 *         { key: 'gallery', label: 'Choose from Gallery' },
 *       ],
 *     });
 *
 *     if (action === 'camera') openCamera();
 *     if (action === 'gallery') openGallery();
 *   };
 *
 *   // Show confirm sheet
 *   const handleConfirm = async () => {
 *     const confirmed = await sheet.confirm({
 *       title: 'Sign Out?',
 *       description: 'You will need to sign in again.',
 *       destructive: true,
 *     });
 *
 *     if (confirmed) signOut();
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleOpenSheet}>Open Sheet</button>
 *       <button onClick={handleShowActions}>Show Actions</button>
 *       <button onClick={handleConfirm}>Confirm</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSheet(): IUseSheetReturn {
  const { manager } = useFeedbackContext();
  const items = useFeedbackStore((state) => state.items);

  // Check if any sheet is open
  const isOpen = useMemo(() => {
    return Array.from(items.values()).some(
      (item) =>
        item.type === 'sheet' &&
        item.status !== 'removed' &&
        item.status !== 'exiting'
    );
  }, [items]);

  /**
   * Open a sheet with custom content
   */
  const open = useCallback(
    (options: ISheetShowOptions): string => {
      const id = manager.add('sheet', {
        snapPoints: [50, 90],
        defaultSnapPoint: 0,
        closeOnBackdropClick: true,
        showHandle: true,
        ...options,
      } as ISheetOptions);

      return id;
    },
    [manager]
  );

  /**
   * Close a specific sheet
   */
  const close = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  /**
   * Close all sheets
   */
  const closeAll = useCallback((): void => {
    manager.removeAll('sheet');
  }, [manager]);

  /**
   * Show an iOS-style action sheet
   */
  const showActions = useCallback(
    (options: IActionSheetOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        const { title, description, actions, showCancel, cancelText, ...rest } =
          options;

        const idRef = { current: '' };

        const handleSelect = (key: string): void => {
          manager.remove(idRef.current);
          resolve(key);
        };

        const handleCancel = (): void => {
          manager.remove(idRef.current);
          resolve(null);
        };

        const content = createElement(ActionSheetContent, {
          actions,
          showCancel: showCancel ?? true,
          onSelect: handleSelect,
          onCancel: handleCancel,
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(cancelText !== undefined && { cancelText }),
        });

        idRef.current = manager.add('sheet', {
          content,
          snapPoints: [30 + actions.length * 8],
          defaultSnapPoint: 0,
          closeOnBackdropClick: true,
          showHandle: true,
          onClose: handleCancel,
          ...rest,
        } as ISheetOptions);
      });
    },
    [manager]
  );

  /**
   * Show a confirmation sheet
   */
  const confirm = useCallback(
    (options: ISheetConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        const { title, description, confirmText, cancelText, destructive, ...rest } =
          options;

        const idRef = { current: '' };

        const handleConfirm = (): void => {
          manager.remove(idRef.current);
          resolve(true);
        };

        const handleCancel = (): void => {
          manager.remove(idRef.current);
          resolve(false);
        };

        const content = createElement(SheetConfirmContent, {
          title,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
          ...(description !== undefined && { description }),
          ...(confirmText !== undefined && { confirmText }),
          ...(cancelText !== undefined && { cancelText }),
          ...(destructive !== undefined && { destructive }),
        });

        idRef.current = manager.add('sheet', {
          content,
          snapPoints: [25],
          defaultSnapPoint: 0,
          closeOnBackdropClick: true,
          showHandle: true,
          onClose: handleCancel,
          ...rest,
        } as ISheetOptions);
      });
    },
    [manager]
  );

  return {
    open,
    showActions,
    confirm,
    close,
    closeAll,
    isOpen,
  };
}
