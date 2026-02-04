/**
 * ChakraPopconfirm - Chakra UI adapter popconfirm component
 * Chakra UI-specific styling with positioning
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
 * ChakraPopconfirm component
 * Renders a positioned confirmation popover with Chakra UI styling
 */
export const ChakraPopconfirm = memo(
  forwardRef<HTMLDivElement, IAdapterPopconfirmProps>(function ChakraPopconfirm(props, ref) {
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
    useEffect((): (() => void) | undefined => {
      if (!isVisible || !triggerRef.current || !popoverRef.current) {return undefined;}

      const triggerElement = triggerRef.current;
      const popoverElement = popoverRef.current;

      const updatePosition = (): void => {
        const triggerRect = triggerElement.getBoundingClientRect();
        const popoverRect = popoverElement.getBoundingClientRect();
        const newPosition = calculatePosition(triggerRect, popoverRect, placement);

        // Keep within viewport
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

    // Focus confirm button
    useEffect((): void => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

    // Handle escape key
    useEffect((): (() => void) | undefined => {
      if (!isVisible) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => { document.removeEventListener('keydown', handleKeyDown); };
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
        aria-labelledby={title ? 'chakra-popconfirm-title' : undefined}
        aria-describedby="chakra-popconfirm-message"
        data-testid={testId}
        className={cn(
          'chakra-popover',
          'fixed z-50 transition-opacity duration-150',
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
            'chakra-popover-content',
            'bg-white dark:bg-gray-700 rounded-md shadow-lg',
            'border border-gray-200 dark:border-gray-600',
            'p-4 min-w-[220px] max-w-[320px]',
            'transition-transform duration-150',
            isVisible && !isExiting ? 'scale-100' : 'scale-95',
            className
          )}
        >
          <div className="flex gap-3">
            {icon && <span className="chakra-popover-icon flex-shrink-0 text-orange-500">{icon}</span>}

            <div className="chakra-popover-body flex-1">
              {title && (
                <h3
                  id="chakra-popconfirm-title"
                  className="chakra-popover-header text-sm font-semibold text-gray-900 dark:text-white mb-1"
                >
                  {title}
                </h3>
              )}
              <p
                id="chakra-popconfirm-message"
                className="text-sm text-gray-600 dark:text-gray-300 mb-4"
              >
                {message}
              </p>

              <div className="chakra-popover-footer flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className={cn(
                    'chakra-btn chakra-btn-sm chakra-btn-outline',
                    'px-3 py-1.5 text-sm rounded-md',
                    'border border-gray-300 dark:border-gray-500',
                    'text-gray-700 dark:text-gray-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-600',
                    'focus:outline-none focus:ring-2 focus:ring-gray-500',
                    'transition-colors disabled:opacity-50'
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
                    'chakra-btn chakra-btn-sm',
                    'px-3 py-1.5 text-sm font-medium rounded-md',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'transition-colors disabled:opacity-50',
                    confirmVariant === 'danger'
                      ? 'chakra-btn-danger bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                      : 'chakra-btn-primary bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
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

ChakraPopconfirm.displayName = 'ChakraPopconfirm';
