/**
 * MuiConfirm - Material UI adapter confirm dialog component
 * Material Design confirmation dialog with proper button styling
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterConfirmProps } from '../types';

/**
 * MuiConfirm component
 * Renders a confirmation dialog with Material Design styling
 */
export const MuiConfirm = memo(
  forwardRef<HTMLDivElement, IAdapterConfirmProps>(function MuiConfirm(props, ref): JSX.Element {
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
      return (): void => { document.removeEventListener('keydown', handleKeyDown); };
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
        aria-labelledby="mui-confirm-title"
        aria-describedby="mui-confirm-message"
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/50',
          'transition-opacity duration-225',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 1300, ...style }}
        onClick={onCancel}
      >
        <div
          ref={dialogRef}
          className={cn(
            // MUI Dialog Paper
            'relative w-full max-w-sm bg-white dark:bg-gray-900',
            'rounded shadow-2xl',
            'transition-all duration-225 ease-out',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e): void => e.stopPropagation()}
        >
          {/* Content */}
          <div className="px-6 pt-6 pb-4">
            {icon && (
              <div className="flex justify-center mb-4 text-gray-500">
                {icon}
              </div>
            )}

            <h2
              id="mui-confirm-title"
              className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2"
            >
              {title}
            </h2>

            <div
              id="mui-confirm-message"
              className="text-gray-600 dark:text-gray-400"
            >
              {message}
            </div>
          </div>

          {/* Actions - MUI DialogActions */}
          <div className="flex justify-end gap-2 px-6 pb-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                // MUI Button - text variant
                'px-4 py-2 min-w-[64px] rounded',
                'text-sm font-medium uppercase tracking-wide',
                'text-blue-600 dark:text-blue-400',
                'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                'transition-colors duration-150',
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
                // MUI Button - contained variant
                'px-4 py-2 min-w-[64px] rounded',
                'text-sm font-medium uppercase tracking-wide',
                'transition-colors duration-150',
                'disabled:opacity-50',
                'shadow hover:shadow-md',
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

MuiConfirm.displayName = 'MuiConfirm';
