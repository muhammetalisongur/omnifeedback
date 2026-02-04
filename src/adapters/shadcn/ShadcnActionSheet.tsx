/**
 * ShadcnActionSheet - shadcn/ui adapter action sheet component
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterActionSheetProps } from '../types';

/**
 * ShadcnActionSheet component
 */
export const ShadcnActionSheet = memo(
  forwardRef<HTMLDivElement, IAdapterActionSheetProps>(function ShadcnActionSheet(props, ref): JSX.Element {
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

    useEffect((): (() => void) | undefined => {
      if (!isVisible) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onSelect(null);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => document.removeEventListener('keydown', handleKeyDown);
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
        data-state={isVisible && !isExiting ? 'open' : 'closed'}
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
            'fixed inset-0 bg-black/80',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
          onClick={handleBackdropClick}
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 p-2',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            className
          )}
        >
          {/* Actions container */}
          <div className="overflow-hidden rounded-lg border bg-background">
            {/* Header */}
            {(title ?? description) && (
              <div className="flex flex-col space-y-1.5 p-4 text-center">
                {title && (
                  <h2
                    id="action-sheet-title"
                    className="text-sm font-semibold text-muted-foreground"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
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
                  'text-center text-sm font-medium',
                  'transition-colors',
                  index > 0 && 'border-t',
                  action.destructive ? 'text-destructive' : 'text-primary',
                  action.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-accent active:bg-accent/80'
                )}
              >
                {action.icon && <span className="h-5 w-5">{action.icon}</span>}
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
                'mt-2 w-full px-4 py-3 rounded-lg',
                'border bg-background',
                'text-center text-sm font-semibold text-primary',
                'transition-colors',
                'hover:bg-accent active:bg-accent/80'
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

ShadcnActionSheet.displayName = 'ShadcnActionSheet';
