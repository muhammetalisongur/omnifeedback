/**
 * MantinePrompt - Mantine adapter prompt dialog component
 * Styled with Mantine color variables and validation support
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterPromptProps } from '../types';

/**
 * MantinePrompt component
 * Renders a prompt dialog for user input
 */
export const MantinePrompt = memo(
  forwardRef<HTMLDivElement, IAdapterPromptProps>(function MantinePrompt(props, ref) {
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

    // Focus input when visible
    useEffect(() => {
      if (isVisible) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, [isVisible]);

    // Handle escape key
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

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputType !== 'textarea' && !loading) {
          e.preventDefault();
          handleConfirm();
        }
      },
      [inputType, loading, handleConfirm]
    );

    const inputClassName = cn(
      'w-full px-3 py-2 rounded-md',
      'border border-[var(--mantine-color-gray-4)] dark:border-[var(--mantine-color-dark-4)]',
      'bg-white dark:bg-[var(--mantine-color-dark-6)]',
      'text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)]',
      'placeholder:text-[var(--mantine-color-gray-5)] dark:placeholder:text-[var(--mantine-color-gray-5)]',
      'focus:outline-none focus:ring-2 focus:ring-[var(--mantine-color-blue-5)] focus:border-transparent',
      'transition-colors',
      'font-[var(--mantine-font-family)]',
      error && 'border-[var(--mantine-color-red-5)] focus:ring-[var(--mantine-color-red-5)]'
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-title"
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
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h2
            id="prompt-title"
            className="text-lg font-semibold text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)] mb-2 font-[var(--mantine-font-family)]"
          >
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p className="text-[var(--mantine-color-gray-6)] dark:text-[var(--mantine-color-gray-4)] text-sm mb-4 font-[var(--mantine-font-family)]">
              {message}
            </p>
          )}

          {/* Input */}
          <div className="mb-4">
            {inputType === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className={inputClassName}
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

            {/* Error message */}
            {error && (
              <p
                id="prompt-error"
                className="mt-2 text-sm text-[var(--mantine-color-red-6)] dark:text-[var(--mantine-color-red-4)] font-[var(--mantine-font-family)]"
              >
                {error}
              </p>
            )}
          </div>

          {/* Buttons */}
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
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'flex-1 px-4 py-2 rounded-md font-medium',
                'bg-[var(--mantine-color-blue-6)] text-white hover:bg-[var(--mantine-color-blue-7)]',
                'transition-colors disabled:opacity-50',
                'font-[var(--mantine-font-family)]'
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

MantinePrompt.displayName = 'MantinePrompt';
