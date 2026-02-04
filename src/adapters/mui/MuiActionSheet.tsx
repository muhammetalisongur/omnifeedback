/**
 * MuiActionSheet - Material UI adapter action sheet component
 * Material Design bottom sheet with action list
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterActionSheetProps } from '../types';

/**
 * MuiActionSheet component
 * Renders a Material Design action sheet
 */
export const MuiActionSheet = memo(
  forwardRef<HTMLDivElement, IAdapterActionSheetProps>(function MuiActionSheet(props, ref) {
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
        aria-labelledby={title ? 'mui-action-sheet-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 z-[1200]',
          'transition-opacity duration-225',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50',
            'transition-opacity duration-225',
            isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
        />

        {/* Sheet - MUI Paper styling */}
        <div
          ref={sheetRef}
          className={cn(
            'absolute bottom-0 left-0 right-0 p-4',
            'transition-transform duration-225 ease-out',
            isVisible && !isExiting ? 'translate-y-0' : 'translate-y-full',
            className
          )}
        >
          {/* Actions container - MUI Paper */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl mb-3">
            {/* Header */}
            {(title ?? description) && (
              <div className="px-6 py-4 border-b dark:border-gray-700 text-center">
                {title && (
                  <h2
                    id="mui-action-sheet-title"
                    className="text-base font-medium text-gray-900 dark:text-gray-100"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Action items - MUI List styling */}
            <div className="py-2">
              {actions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => handleActionClick(action.key, action.disabled)}
                  disabled={action.disabled}
                  className={cn(
                    'w-full flex items-center gap-4 px-6 py-3',
                    'text-left',
                    'transition-colors duration-150',
                    action.destructive
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-gray-100',
                    action.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
                  )}
                >
                  {action.icon && (
                    <span className="w-6 h-6 flex-shrink-0">{action.icon}</span>
                  )}
                  <span className="flex-1 text-base">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cancel button - MUI Paper */}
          {showCancel && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={cn(
                'w-full px-6 py-4 rounded-xl',
                'bg-white dark:bg-gray-800 shadow-xl',
                'text-center text-base font-medium',
                'text-blue-600 dark:text-blue-400',
                'transition-colors duration-150',
                'hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600'
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

MuiActionSheet.displayName = 'MuiActionSheet';
