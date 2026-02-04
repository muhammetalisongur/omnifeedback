/**
 * HeadlessActionSheet - Headless adapter action sheet component
 * Pure Tailwind CSS implementation for iOS-style action lists
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterActionSheetProps } from '../types';

/**
 * HeadlessActionSheet component
 * Renders an iOS-style action sheet
 */
export const HeadlessActionSheet = memo(
  forwardRef<HTMLDivElement, IAdapterActionSheetProps>(function HeadlessActionSheet(props, ref) {
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
    useEffect(() => {
      if (!isVisible) return undefined;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onSelect(null);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onSelect]);

    const handleBackdropClick = useCallback(() => {
      onSelect(null);
    }, [onSelect]);

    const handleActionClick = useCallback(
      (key: string, disabled?: boolean) => {
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
          'fixed inset-0 z-50',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50',
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
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-2">
            {/* Header */}
            {(title ?? description) && (
              <div className="px-4 py-3 border-b dark:border-gray-700 text-center">
                {title && (
                  <h2
                    id="action-sheet-title"
                    className="text-sm font-semibold text-gray-500 dark:text-gray-400"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
                )}
              </div>
            )}

            {/* Action items */}
            {actions.map((action, index) => (
              <button
                key={action.key}
                type="button"
                onClick={() => handleActionClick(action.key, action.disabled)}
                disabled={action.disabled}
                className={cn(
                  'w-full flex items-center justify-center gap-3 px-4 py-3',
                  'text-center text-lg',
                  'transition-colors',
                  index > 0 && 'border-t dark:border-gray-700',
                  action.destructive
                    ? 'text-red-600 dark:text-red-500'
                    : 'text-blue-600 dark:text-blue-400',
                  action.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700'
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
              onClick={() => onSelect(null)}
              className={cn(
                'w-full px-4 py-3 rounded-xl',
                'bg-white dark:bg-gray-800',
                'text-center text-lg font-semibold',
                'text-blue-600 dark:text-blue-400',
                'transition-colors',
                'hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700'
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

HeadlessActionSheet.displayName = 'HeadlessActionSheet';
