/**
 * ActionSheetContent - iOS-style action sheet content
 * Displays a list of action buttons in a bottom sheet
 */

import { memo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

/**
 * Action item configuration
 */
export interface IActionItem {
  /** Unique key for the action */
  key: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Destructive action (red color) */
  destructive?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Props for ActionSheetContent
 */
export interface IActionSheetContentProps {
  /** Title for the action sheet */
  title?: string;
  /** Description text */
  description?: string;
  /** List of actions */
  actions: IActionItem[];
  /** Callback when action is selected */
  onSelect: (key: string) => void;
  /** Show cancel button */
  showCancel?: boolean;
  /** Cancel button text */
  cancelText?: string;
  /** Callback when cancel is pressed */
  onCancel?: () => void;
  /** Test ID for testing */
  testId?: string;
}

/**
 * ActionSheetContent component
 * Renders iOS-style action buttons for use in Sheet
 *
 * @example
 * ```tsx
 * <ActionSheetContent
 *   title="Photo Options"
 *   actions={[
 *     { key: 'camera', label: 'Take Photo', icon: <CameraIcon /> },
 *     { key: 'gallery', label: 'Choose from Gallery', icon: <GalleryIcon /> },
 *     { key: 'delete', label: 'Delete Photo', destructive: true },
 *   ]}
 *   onSelect={(key) => handleAction(key)}
 *   showCancel
 *   onCancel={() => closeSheet()}
 * />
 * ```
 */
export const ActionSheetContent = memo(function ActionSheetContent(
  props: IActionSheetContentProps
) {
  const {
    title,
    description,
    actions,
    onSelect,
    showCancel = true,
    cancelText = 'Cancel',
    onCancel,
    testId,
  } = props;

  /**
   * Handle action click
   */
  const handleActionClick = useCallback(
    (key: string, disabled?: boolean) => {
      if (disabled) return;
      onSelect(key);
    },
    [onSelect]
  );

  /**
   * Handle cancel click
   */
  const handleCancelClick = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  return (
    <div
      className="flex flex-col gap-2 p-4 pb-safe"
      data-testid={testId}
    >
      {/* Header */}
      {(title || description) && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-2">
          {title && (
            <h3
              className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center"
              data-testid={testId ? `${testId}-title` : undefined}
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1"
              data-testid={testId ? `${testId}-description` : undefined}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div
        className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700"
        data-testid={testId ? `${testId}-actions` : undefined}
      >
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            disabled={action.disabled}
            onClick={() => handleActionClick(action.key, action.disabled)}
            data-testid={testId ? `${testId}-action-${action.key}` : undefined}
            className={cn(
              'w-full px-4 py-3.5 flex items-center justify-center gap-3',
              'text-base font-medium',
              'transition-colors',
              'active:bg-gray-100 dark:active:bg-gray-700',
              action.destructive
                ? 'text-red-600 dark:text-red-500'
                : 'text-blue-600 dark:text-blue-400',
              action.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {action.icon && (
              <span className="w-5 h-5 flex-shrink-0">{action.icon}</span>
            )}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Cancel Button */}
      {showCancel && (
        <button
          type="button"
          onClick={handleCancelClick}
          data-testid={testId ? `${testId}-cancel` : undefined}
          className={cn(
            'w-full px-4 py-3.5',
            'bg-gray-50 dark:bg-gray-800 rounded-xl',
            'text-base font-semibold',
            'text-blue-600 dark:text-blue-400',
            'transition-colors',
            'active:bg-gray-100 dark:active:bg-gray-700'
          )}
        >
          {cancelText}
        </button>
      )}
    </div>
  );
});

ActionSheetContent.displayName = 'ActionSheetContent';

/**
 * Props for SheetConfirmContent
 */
export interface ISheetConfirmContentProps {
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
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Test ID for testing */
  testId?: string;
}

/**
 * SheetConfirmContent component
 * Confirmation dialog content for use in Sheet
 *
 * @example
 * ```tsx
 * <SheetConfirmContent
 *   title="Sign Out?"
 *   description="You will need to sign in again."
 *   confirmText="Sign Out"
 *   destructive
 *   onConfirm={() => signOut()}
 *   onCancel={() => closeSheet()}
 * />
 * ```
 */
export const SheetConfirmContent = memo(function SheetConfirmContent(
  props: ISheetConfirmContentProps
) {
  const {
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive = false,
    onConfirm,
    onCancel,
    testId,
  } = props;

  return (
    <div
      className="flex flex-col gap-2 p-4 pb-safe"
      data-testid={testId}
    >
      {/* Header */}
      <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h3
          className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center"
          data-testid={testId ? `${testId}-title` : undefined}
        >
          {title}
        </h3>
        {description && (
          <p
            className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1"
            data-testid={testId ? `${testId}-description` : undefined}
          >
            {description}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
        <button
          type="button"
          onClick={onConfirm}
          data-testid={testId ? `${testId}-confirm` : undefined}
          className={cn(
            'w-full px-4 py-3.5',
            'text-base font-semibold',
            'transition-colors',
            'active:bg-gray-100 dark:active:bg-gray-700',
            destructive
              ? 'text-red-600 dark:text-red-500'
              : 'text-blue-600 dark:text-blue-400'
          )}
        >
          {confirmText}
        </button>
      </div>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        data-testid={testId ? `${testId}-cancel` : undefined}
        className={cn(
          'w-full px-4 py-3.5',
          'bg-gray-50 dark:bg-gray-800 rounded-xl',
          'text-base font-semibold',
          'text-blue-600 dark:text-blue-400',
          'transition-colors',
          'active:bg-gray-100 dark:active:bg-gray-700'
        )}
      >
        {cancelText}
      </button>
    </div>
  );
});

SheetConfirmContent.displayName = 'SheetConfirmContent';
