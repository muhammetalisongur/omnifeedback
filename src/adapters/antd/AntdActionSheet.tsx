/**
 * AntdActionSheet - Ant Design adapter action sheet component
 * Implements an iOS-style action sheet for mobile interactions
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterActionSheetProps } from '../types';

/**
 * AntdActionSheet component
 * Renders an action sheet with Ant Design styling
 */
export const AntdActionSheet = memo(
  forwardRef<HTMLDivElement, IAdapterActionSheetProps>(function AntdActionSheet(props, ref) {
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
        aria-labelledby={title ? 'antd-action-sheet-title' : undefined}
        data-testid={testId}
        className={cn(
          'of-antd-action-sheet-wrapper',
          'fixed inset-0 z-[1000]',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'of-antd-action-sheet-mask',
            'absolute inset-0 bg-black/45',
            'transition-opacity duration-300',
            isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          className={cn(
            'of-antd-action-sheet',
            'absolute bottom-0 left-0 right-0 p-2',
            'transition-transform duration-300 ease-out',
            isVisible && !isExiting ? 'translate-y-0' : 'translate-y-full',
            className
          )}
        >
          {/* Actions container */}
          <div className="of-antd-action-sheet-content bg-white rounded-xl overflow-hidden mb-2">
            {/* Header */}
            {(title ?? description) && (
              <div className="of-antd-action-sheet-header px-4 py-3 border-b border-gray-100 text-center bg-gray-50">
                {title && (
                  <h3
                    id="antd-action-sheet-title"
                    className="of-antd-action-sheet-title text-sm font-medium text-gray-500"
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="of-antd-action-sheet-message text-xs text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Action items */}
            <div className="of-antd-action-sheet-button-list">
              {actions.map((action, index) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={(): void => { handleActionClick(action.key, action.disabled); }}
                  disabled={action.disabled}
                  className={cn(
                    'of-antd-action-sheet-button',
                    'w-full flex items-center justify-center gap-3 px-4 py-3',
                    'text-center text-base',
                    'transition-colors',
                    index > 0 && 'border-t border-gray-100',
                    action.destructive
                      ? 'text-red-500'
                      : 'text-blue-500',
                    action.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-gray-50 active:bg-gray-100'
                  )}
                >
                  {action.icon && (
                    <span className="of-antd-action-sheet-button-icon w-5 h-5">
                      {action.icon}
                    </span>
                  )}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cancel button */}
          {showCancel && (
            <button
              type="button"
              onClick={(): void => { onSelect(null); }}
              className={cn(
                'of-antd-action-sheet-cancel',
                'w-full px-4 py-3 rounded-xl',
                'bg-white',
                'text-center text-base font-medium',
                'text-blue-500',
                'transition-colors',
                'hover:bg-gray-50 active:bg-gray-100'
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

AntdActionSheet.displayName = 'AntdActionSheet';
