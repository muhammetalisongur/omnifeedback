/**
 * MantinePopconfirm - Mantine adapter popconfirm component
 * Styled with Mantine color variables and positioning
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterPopconfirmProps, PopconfirmPlacement } from '../types';

/**
 * Calculate popconfirm position relative to trigger
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
 * MantinePopconfirm component
 * Renders a positioned confirmation popover
 */
export const MantinePopconfirm = memo(
  forwardRef<HTMLDivElement, IAdapterPopconfirmProps>(function MantinePopconfirm(props, ref) {
    const {
      message,
      title,
      confirmText = 'Confirm',
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
    useEffect(() => {
      if (!isVisible || !triggerRef.current || !popoverRef.current) return;

      const updatePosition = () => {
        const triggerRect = triggerRef.current!.getBoundingClientRect();
        const popoverRect = popoverRef.current!.getBoundingClientRect();
        const newPosition = calculatePosition(triggerRect, popoverRect, placement);

        // Keep within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        newPosition.left = Math.max(
          8,
          Math.min(newPosition.left, viewportWidth - popoverRect.width - 8)
        );
        newPosition.top = Math.max(
          8,
          Math.min(newPosition.top, viewportHeight - popoverRect.height - 8)
        );

        setPosition(newPosition);
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isVisible, triggerRef, placement]);

    // Focus confirm button
    useEffect(() => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

    // Handle escape key
    useEffect(() => {
      if (!isVisible) return undefined;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onCancel]);

    const handleConfirm = useCallback(async () => {
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
        aria-labelledby={title ? 'popconfirm-title' : undefined}
        aria-describedby="popconfirm-message"
        data-testid={testId}
        className={cn(
          'fixed z-[var(--mantine-z-index-popover)] transition-opacity duration-150',
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
          className={cn(
            'bg-white dark:bg-[var(--mantine-color-dark-6)] rounded-md shadow-lg border border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)]',
            'p-4 min-w-[200px] max-w-[300px]',
            'transition-transform duration-150',
            isVisible && !isExiting ? 'scale-100' : 'scale-95',
            className
          )}
        >
          <div className="flex gap-3">
            {icon && (
              <span className="flex-shrink-0 text-[var(--mantine-color-yellow-6)]">{icon}</span>
            )}

            <div className="flex-1">
              {title && (
                <h3
                  id="popconfirm-title"
                  className="text-sm font-semibold text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)] mb-1 font-[var(--mantine-font-family)]"
                >
                  {title}
                </h3>
              )}
              <p
                id="popconfirm-message"
                className="text-sm text-[var(--mantine-color-gray-6)] dark:text-[var(--mantine-color-gray-4)] mb-4 font-[var(--mantine-font-family)]"
              >
                {message}
              </p>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded',
                    'border border-[var(--mantine-color-gray-4)] dark:border-[var(--mantine-color-dark-4)]',
                    'text-[var(--mantine-color-gray-7)] dark:text-[var(--mantine-color-gray-3)]',
                    'hover:bg-[var(--mantine-color-gray-0)] dark:hover:bg-[var(--mantine-color-dark-5)]',
                    'transition-colors disabled:opacity-50',
                    'font-[var(--mantine-font-family)]'
                  )}
                >
                  {cancelText}
                </button>

                <button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded',
                    'transition-colors disabled:opacity-50',
                    'font-[var(--mantine-font-family)]',
                    confirmVariant === 'danger'
                      ? 'bg-[var(--mantine-color-red-6)] text-white hover:bg-[var(--mantine-color-red-7)]'
                      : 'bg-[var(--mantine-color-blue-6)] text-white hover:bg-[var(--mantine-color-blue-7)]'
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

MantinePopconfirm.displayName = 'MantinePopconfirm';
