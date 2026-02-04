/**
 * ShadcnPrompt - shadcn/ui adapter prompt dialog component
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterPromptProps } from '../types';

/**
 * ShadcnPrompt component
 */
export const ShadcnPrompt = memo(
  forwardRef<HTMLDivElement, IAdapterPromptProps>(function ShadcnPrompt(props, ref): JSX.Element {
    const {
      title,
      message,
      inputType = 'text',
      placeholder,
      confirmText = 'OK',
      cancelText = 'Cancel',
      value,
      onValueChange,
      error,
      onConfirm,
      onCancel,
      status,
      className,
      style,
      testId,
    } = props;

    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useFocusTrap(dialogRef, { enabled: isVisible });
    useScrollLock(isVisible);

    useEffect((): void => {
      if (isVisible) {
        setTimeout((): void => { inputRef.current?.focus(); }, 100);
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
      return (): void => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleConfirm = useCallback(async (): Promise<void> => {
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }, [onConfirm]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter' && inputType !== 'textarea' && !loading) {
          e.preventDefault();
          void handleConfirm();
        }
      },
      [inputType, loading, handleConfirm]
    );

    const inputClassName = cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
      'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-destructive focus-visible:ring-destructive'
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-title"
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
            {/* Title */}
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 id="prompt-title" className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h2>
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </div>

            {/* Input */}
            <div className="grid gap-2">
              {inputType === 'textarea' ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  placeholder={placeholder}
                  rows={4}
                  className={cn(inputClassName, 'min-h-[80px] py-2')}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'prompt-error' : undefined}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={inputType}
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className={inputClassName}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'prompt-error' : undefined}
                />
              )}

              {error && (
                <p id="prompt-error" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
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
                type="button"
                onClick={(): void => { void handleConfirm(); }}
                disabled={loading}
                className={cn(
                  'inline-flex h-10 items-center justify-center rounded-md px-4 py-2',
                  'bg-primary text-primary-foreground text-sm font-medium',
                  'ring-offset-background transition-colors hover:bg-primary/90',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  'disabled:opacity-50'
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

ShadcnPrompt.displayName = 'ShadcnPrompt';
