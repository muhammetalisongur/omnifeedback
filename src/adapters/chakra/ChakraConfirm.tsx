/**
 * ChakraConfirm - Chakra UI adapter confirm dialog component
 * Chakra UI-specific styling with accessible dialog
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterConfirmProps } from '../types';

/**
 * ChakraConfirm component
 * Renders a confirmation dialog with Chakra UI styling
 */
export const ChakraConfirm = memo(
  forwardRef<HTMLDivElement, IAdapterConfirmProps>(function ChakraConfirm(props, ref) {
    const {
      message,
      title = 'Confirm',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      icon,
      onConfirm,
      onCancel,
      status,
      className,
      style,
      testId,
    } = props;

    const [loading, setLoading] = useState(false);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useFocusTrap(dialogRef, { enabled: isVisible });
    useScrollLock(isVisible);

    useEffect(() => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

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
        aria-labelledby="chakra-confirm-title"
        aria-describedby="chakra-confirm-message"
        data-testid={testId}
        className={cn(
          'chakra-confirm-overlay',
          'fixed inset-0 flex items-center justify-center p-4',
          'transition-opacity duration-150',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 1400, backgroundColor: 'rgba(0, 0, 0, 0.48)', ...style }}
        onClick={onCancel}
      >
        <div
          ref={dialogRef}
          className={cn(
            'chakra-confirm-content',
            'relative w-full max-w-md bg-white dark:bg-gray-800',
            'rounded-md shadow-xl p-6',
            'transition-all duration-150',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {icon && <div className="chakra-confirm-icon flex justify-center mb-4">{icon}</div>}

          <h2
            id="chakra-confirm-title"
            className="chakra-confirm-title text-lg font-semibold text-center text-gray-900 dark:text-white mb-2"
          >
            {title}
          </h2>

          <div
            id="chakra-confirm-message"
            className="chakra-confirm-message text-gray-600 dark:text-gray-300 text-center mb-6"
          >
            {message}
          </div>

          <div className="chakra-confirm-actions flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                'chakra-btn chakra-btn-outline',
                'flex-1 px-4 py-2 rounded-md',
                'border-2 border-gray-300 dark:border-gray-500',
                'text-gray-700 dark:text-gray-200',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
                'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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
                'chakra-btn',
                'flex-1 px-4 py-2 rounded-md font-medium',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                confirmVariant === 'danger'
                  ? 'chakra-btn-danger bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                  : 'chakra-btn-primary bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
              )}
            >
              {loading ? 'Loading...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  })
);

ChakraConfirm.displayName = 'ChakraConfirm';
