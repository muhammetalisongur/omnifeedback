/**
 * HeadlessPrompt - Headless adapter prompt dialog component
 * Pure Tailwind CSS implementation with validation support
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterPromptProps } from '../types';

/**
 * HeadlessPrompt component
 * Renders a prompt dialog for user input
 */
export const HeadlessPrompt = memo(
  forwardRef<HTMLDivElement, IAdapterPromptProps>(function HeadlessPrompt(props, ref) {
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
      'w-full px-3 py-2 rounded-lg',
      'border border-gray-300 dark:border-gray-600',
      'bg-white dark:bg-gray-800',
      'text-gray-900 dark:text-gray-100',
      'placeholder:text-gray-500 dark:placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      'transition-colors',
      error && 'border-red-500 focus:ring-red-500'
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
          {/* Title */}
          <h2
            id="prompt-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{message}</p>
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
              <p id="prompt-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
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
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium',
                'bg-blue-600 text-white hover:bg-blue-700',
                'transition-colors disabled:opacity-50'
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

HeadlessPrompt.displayName = 'HeadlessPrompt';
