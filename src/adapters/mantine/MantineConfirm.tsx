/**
 * MantineConfirm - Mantine adapter confirm dialog component
 * Styled with Mantine color variables and accessible dialog patterns
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterConfirmProps } from '../types';

/**
 * MantineConfirm component
 * Renders a confirmation dialog with Mantine styling
 */
export const MantineConfirm = memo(
  forwardRef<HTMLDivElement, IAdapterConfirmProps>(function MantineConfirm(props, ref) {
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

    useEffect((): void => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

    useEffect((): (() => void) => {
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
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-[var(--mantine-color-dark-9)]/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 'var(--mantine-z-index-modal)', ...style }}
        onClick={onCancel}
      >
        <div
          ref={dialogRef}
          className={cn(
            'relative w-full max-w-md bg-white dark:bg-[var(--mantine-color-dark-7)]',
            'rounded-md shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e: React.MouseEvent): void => { e.stopPropagation(); }}
        >
          {icon && <div className="flex justify-center mb-4">{icon}</div>}

          <h2
            id="confirm-title"
            className="text-lg font-semibold text-center text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)] mb-2 font-[var(--mantine-font-family)]"
          >
            {title}
          </h2>

          <div
            id="confirm-message"
            className="text-[var(--mantine-color-gray-6)] dark:text-[var(--mantine-color-gray-4)] text-center mb-6 font-[var(--mantine-font-family)]"
          >
            {message}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                'flex-1 px-4 py-2 rounded-md',
                'border border-[var(--mantine-color-gray-4)] dark:border-[var(--mantine-color-dark-4)]',
                'text-[var(--mantine-color-gray-7)] dark:text-[var(--mantine-color-gray-3)]',
                'hover:bg-[var(--mantine-color-gray-0)] dark:hover:bg-[var(--mantine-color-dark-6)]',
                'transition-colors disabled:opacity-50',
                'font-[var(--mantine-font-family)]'
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
                'flex-1 px-4 py-2 rounded-md font-medium',
                'transition-colors disabled:opacity-50',
                'font-[var(--mantine-font-family)]',
                confirmVariant === 'danger'
                  ? 'bg-[var(--mantine-color-red-6)] text-white hover:bg-[var(--mantine-color-red-7)]'
                  : 'bg-[var(--mantine-color-blue-6)] text-white hover:bg-[var(--mantine-color-blue-7)]'
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

MantineConfirm.displayName = 'MantineConfirm';
