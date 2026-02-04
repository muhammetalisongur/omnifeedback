/**
 * ShadcnConfirm - shadcn/ui adapter confirm dialog component
 * Styled like shadcn AlertDialog
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterConfirmProps } from '../types';

/**
 * ShadcnConfirm component
 */
export const ShadcnConfirm = memo(
  forwardRef<HTMLDivElement, IAdapterConfirmProps>(function ShadcnConfirm(props, ref) {
    const {
      message,
      title = 'Are you sure?',
      confirmText = 'Continue',
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
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        data-testid={testId}
        data-state={isVisible && !isExiting ? 'open' : 'closed'}
        className={cn(
          'fixed inset-0 z-50',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
        onClick={onCancel}
      >
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-black/80',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
        />

        {/* Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            ref={dialogRef}
            data-state={isVisible && !isExiting ? 'open' : 'closed'}
            className={cn(
              'relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg',
              'duration-200 sm:rounded-lg',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {icon && <div className="flex justify-center mb-2">{icon}</div>}

            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 id="confirm-title" className="text-lg font-semibold">
                {title}
              </h2>
              <p id="confirm-description" className="text-sm text-muted-foreground">
                {message}
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className={cn(
                  'mt-2 sm:mt-0 inline-flex h-10 items-center justify-center rounded-md',
                  'border border-input bg-background px-4 py-2',
                  'text-sm font-medium ring-offset-background transition-colors',
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
                onClick={handleConfirm}
                disabled={loading}
                className={cn(
                  'inline-flex h-10 items-center justify-center rounded-md px-4 py-2',
                  'text-sm font-medium ring-offset-background transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  'disabled:opacity-50',
                  confirmVariant === 'danger'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {loading ? 'Loading...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  })
);

ShadcnConfirm.displayName = 'ShadcnConfirm';
