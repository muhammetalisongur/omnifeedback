/**
 * ChakraPrompt - Chakra UI adapter prompt dialog component
 * Chakra UI-specific styling with validation support
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterPromptProps } from '../types';

/**
 * ChakraPrompt component
 * Renders a prompt dialog for user input with Chakra UI styling
 */
export const ChakraPrompt = memo(
  forwardRef<HTMLDivElement, IAdapterPromptProps>(function ChakraPrompt(props, ref) {
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
    useEffect((): void => {
      if (isVisible) {
        setTimeout((): void => { inputRef.current?.focus(); }, 100);
      }
    }, [isVisible]);

    // Handle escape key
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
      'chakra-input',
      'w-full px-4 py-2 rounded-md',
      'border-2 border-gray-200 dark:border-gray-600',
      'bg-white dark:bg-gray-800',
      'text-gray-900 dark:text-white',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      'transition-colors',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chakra-prompt-title"
        data-testid={testId}
        className={cn(
          'chakra-prompt-overlay',
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
            'chakra-prompt-content',
            'relative w-full max-w-md bg-white dark:bg-gray-800',
            'rounded-md shadow-xl p-6',
            'transition-all duration-150',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e): void => { e.stopPropagation(); }}
        >
          {/* Title */}
          <h2
            id="chakra-prompt-title"
            className="chakra-prompt-header text-lg font-semibold text-gray-900 dark:text-white mb-2"
          >
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p className="chakra-prompt-message text-gray-600 dark:text-gray-300 text-sm mb-4">{message}</p>
          )}

          {/* Input */}
          <div className="chakra-form-control mb-4">
            {inputType === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={value}
                onChange={(e): void => { onValueChange(e.target.value); }}
                placeholder={placeholder}
                rows={4}
                className={inputClassName}
                aria-invalid={!!error}
                aria-describedby={error ? 'chakra-prompt-error' : undefined}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={inputType}
                value={value}
                onChange={(e): void => { onValueChange(e.target.value); }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={inputClassName}
                aria-invalid={!!error}
                aria-describedby={error ? 'chakra-prompt-error' : undefined}
              />
            )}

            {/* Error message */}
            {error && (
              <p id="chakra-prompt-error" className="chakra-form-error mt-2 text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="chakra-prompt-footer flex gap-3">
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
              type="button"
              onClick={(): void => { void handleConfirm(); }}
              disabled={loading}
              className={cn(
                'chakra-btn chakra-btn-primary',
                'flex-1 px-4 py-2 rounded-md font-medium',
                'bg-blue-500 text-white hover:bg-blue-600',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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

ChakraPrompt.displayName = 'ChakraPrompt';
