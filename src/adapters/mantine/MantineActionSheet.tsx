/**
 * MantineActionSheet - Mantine adapter action sheet component
 * Styled with Mantine color variables for iOS-style action lists
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterActionSheetProps } from '../types';

/**
 * MantineActionSheet component
 * Renders an iOS-style action sheet
 */
export const MantineActionSheet = memo(
  forwardRef<HTMLDivElement, IAdapterActionSheetProps>(function MantineActionSheet(props, ref) {
    const {
      title,
      description,
      actions,
      showCancel = true,
      cancelText = 'Cancel',
      onSelect,
      status,
      className,
      style,
      testId,
    } = props;

    const sheetRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useFocusTrap(sheetRef, { enabled: isVisible });
    useScrollLock(isVisible);

    // Handle escape key
    useEffect((): (() => void) | undefined => {
      if (!isVisible) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onSelect(null);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => { document.removeEventListener('keydown', handleKeyDown); };
    }, [isVisible, onSelect]);

    const handleBackdropClick = useCallback((): void => {
      onSelect(null);
    }, [onSelect]);

    const handleActionClick = useCallback(
      (key: string, disabled?: boolean): void => {
        if (!disabled) {
          onSelect(key);
        }
      },
      [onSelect]
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'action-sheet-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 z-[var(--mantine-z-index-modal)]',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-[var(--mantine-color-dark-9)]/50',
            'transition-opacity duration-300',
            isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          className={cn(
            'absolute bottom-0 left-0 right-0 p-2',
            'transition-transform duration-300 ease-out',
            isVisible && !isExiting ? 'translate-y-0' : 'translate-y-full',
            className
          )}
        >
          {/* Actions container */}
          <div className="bg-white dark:bg-[var(--mantine-color-dark-6)] rounded-lg overflow-hidden mb-2">
            {/* Header */}
            {(title ?? description) && (
              <div className="px-4 py-3 border-b border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)] text-center">
                {title && (
                  <h2
                    id="action-sheet-title"
                    className="text-sm font-semibold text-[var(--mantine-color-gray-5)] dark:text-[var(--mantine-color-gray-4)] font-[var(--mantine-font-family)]"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-[var(--mantine-color-gray-4)] dark:text-[var(--mantine-color-gray-5)] mt-1 font-[var(--mantine-font-family)]">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Action items */}
            {actions.map((action, index) => (
              <button
                key={action.key}
                type="button"
                onClick={(): void => { handleActionClick(action.key, action.disabled); }}
                disabled={action.disabled}
                className={cn(
                  'w-full flex items-center justify-center gap-3 px-4 py-3',
                  'text-center text-lg',
                  'transition-colors',
                  'font-[var(--mantine-font-family)]',
                  index > 0 &&
                    'border-t border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)]',
                  action.destructive
                    ? 'text-[var(--mantine-color-red-6)] dark:text-[var(--mantine-color-red-5)]'
                    : 'text-[var(--mantine-color-blue-6)] dark:text-[var(--mantine-color-blue-4)]',
                  action.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[var(--mantine-color-gray-0)] dark:hover:bg-[var(--mantine-color-dark-5)] active:bg-[var(--mantine-color-gray-1)] dark:active:bg-[var(--mantine-color-dark-4)]'
                )}
              >
                {action.icon && <span className="w-5 h-5">{action.icon}</span>}
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Cancel button */}
          {showCancel && (
            <button
              type="button"
              onClick={(): void => { onSelect(null); }}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'bg-white dark:bg-[var(--mantine-color-dark-6)]',
                'text-center text-lg font-semibold',
                'text-[var(--mantine-color-blue-6)] dark:text-[var(--mantine-color-blue-4)]',
                'transition-colors',
                'font-[var(--mantine-font-family)]',
                'hover:bg-[var(--mantine-color-gray-0)] dark:hover:bg-[var(--mantine-color-dark-5)] active:bg-[var(--mantine-color-gray-1)] dark:active:bg-[var(--mantine-color-dark-4)]'
              )}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    );
  })
);

MantineActionSheet.displayName = 'MantineActionSheet';
