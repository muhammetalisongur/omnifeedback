/**
 * HeadlessConfirm - Headless adapter confirm dialog component
 * Pure Tailwind CSS implementation with accessible dialog
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterConfirmProps } from '../types';

/**
 * HeadlessConfirm component
 * Renders a confirmation dialog with Tailwind CSS styling
 */
export const HeadlessConfirm = memo(
  forwardRef<HTMLDivElement, IAdapterConfirmProps>(function HeadlessConfirm(props, ref): JSX.Element {
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
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

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
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 10000, ...style }}
        onClick={onCancel}
      >
        <div
          ref={dialogRef}
          className={cn(
            'relative w-full max-w-md bg-white dark:bg-gray-900',
            'rounded-lg shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {icon && <div className="flex justify-center mb-4">{icon}</div>}

          <h2
            id="confirm-title"
            className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100 mb-2"
          >
            {title}
          </h2>

          <div
            id="confirm-message"
            className="text-gray-600 dark:text-gray-400 text-center mb-6"
          >
            {message}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-600',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-800',
                'transition-colors disabled:opacity-50'
              )}
            >
              {cancelText}
            </button>

            <button
              ref={confirmButtonRef}
              type="button"
              onClick={() => void handleConfirm()}
              disabled={loading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium',
                'transition-colors disabled:opacity-50',
                confirmVariant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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

HeadlessConfirm.displayName = 'HeadlessConfirm';
