/**
 * ShadcnPopconfirm - shadcn/ui adapter popconfirm component
 * Styled like shadcn Popover
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterPopconfirmProps, PopconfirmPlacement } from '../types';

/**
 * Calculate popconfirm position
 */
function calculatePosition(
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  placement: PopconfirmPlacement
): { top: number; left: number } {
  const offset = 8;

  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top - popoverRect.height - offset,
        left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
      };
    case 'top-start':
      return {
        top: triggerRect.top - popoverRect.height - offset,
        left: triggerRect.left,
      };
    case 'top-end':
      return {
        top: triggerRect.top - popoverRect.height - offset,
        left: triggerRect.right - popoverRect.width,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
      };
    case 'bottom-start':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left,
      };
    case 'bottom-end':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.right - popoverRect.width,
      };
    case 'left':
      return {
        top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
        left: triggerRect.left - popoverRect.width - offset,
      };
    case 'left-start':
      return {
        top: triggerRect.top,
        left: triggerRect.left - popoverRect.width - offset,
      };
    case 'left-end':
      return {
        top: triggerRect.bottom - popoverRect.height,
        left: triggerRect.left - popoverRect.width - offset,
      };
    case 'right':
      return {
        top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
        left: triggerRect.right + offset,
      };
    case 'right-start':
      return {
        top: triggerRect.top,
        left: triggerRect.right + offset,
      };
    case 'right-end':
      return {
        top: triggerRect.bottom - popoverRect.height,
        left: triggerRect.right + offset,
      };
    default:
      return { top: 0, left: 0 };
  }
}

/**
 * ShadcnPopconfirm component
 */
export const ShadcnPopconfirm = memo(
  forwardRef<HTMLDivElement, IAdapterPopconfirmProps>(function ShadcnPopconfirm(props, ref): JSX.Element {
    const {
      message,
      title,
      confirmText = 'Continue',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      icon,
      placement = 'top',
      triggerRef,
      onConfirm,
      onCancel,
      status,
      className,
      style,
      testId,
    } = props;

    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    // Calculate position
    useEffect((): (() => void) | undefined => {
      if (!isVisible || !triggerRef.current || !popoverRef.current) {return undefined;}

      const triggerElement = triggerRef.current;
      const popoverElement = popoverRef.current;

      const updatePosition = (): void => {
        const triggerRect = triggerElement.getBoundingClientRect();
        const popoverRect = popoverElement.getBoundingClientRect();
        const newPosition = calculatePosition(triggerRect, popoverRect, placement);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        newPosition.left = Math.max(8, Math.min(newPosition.left, viewportWidth - popoverRect.width - 8));
        newPosition.top = Math.max(8, Math.min(newPosition.top, viewportHeight - popoverRect.height - 8));

        setPosition(newPosition);
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return (): void => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isVisible, triggerRef, placement]);

    useEffect((): void => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

    useEffect((): (() => void) | undefined => {
      if (!isVisible) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onCancel]);

    const handleConfirm = useCallback(async (): Promise<void> => {
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }, [onConfirm]);

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        data-testid={testId}
        data-state={isVisible && !isExiting ? 'open' : 'closed'}
        className={cn(
          'fixed z-50',
          'transition-opacity duration-150',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{
          top: position.top,
          left: position.left,
          ...style,
        }}
      >
        <div
          ref={popoverRef}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
          className={cn(
            'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className
          )}
        >
          <div className="flex gap-3">
            {icon && <span className="flex-shrink-0 text-yellow-500">{icon}</span>}

            <div className="flex-1">
              {title && (
                <h3 className="font-medium leading-none mb-2">{title}</h3>
              )}
              <p className="text-sm text-muted-foreground mb-4">{message}</p>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className={cn(
                    'inline-flex h-8 items-center justify-center rounded-md px-3',
                    'border border-input bg-background text-sm font-medium',
                    'ring-offset-background transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'disabled:opacity-50'
                  )}
                >
                  {cancelText}
                </button>

                <button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={(): void => { void handleConfirm(); }}
                  disabled={loading}
                  className={cn(
                    'inline-flex h-8 items-center justify-center rounded-md px-3',
                    'text-sm font-medium ring-offset-background transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'disabled:opacity-50',
                    confirmVariant === 'danger'
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {loading ? '...' : confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })
);

ShadcnPopconfirm.displayName = 'ShadcnPopconfirm';
