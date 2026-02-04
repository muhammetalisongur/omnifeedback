/**
 * MuiPrompt - Material UI adapter prompt dialog component
 * Material Design text field and dialog styling with validation
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterPromptProps } from '../types';

/**
 * MuiPrompt component
 * Renders a prompt dialog for user input with Material Design styling
 */
export const MuiPrompt = memo(
  forwardRef<HTMLDivElement, IAdapterPromptProps>(function MuiPrompt(props, ref) {
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
    const [isFocused, setIsFocused] = useState(false);
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

    // MUI TextField outlined variant styling
    const inputClassName = cn(
      'w-full px-3.5 py-3 rounded',
      'border-2',
      'bg-transparent',
      'text-gray-900 dark:text-gray-100',
      'placeholder:text-gray-500 dark:placeholder:text-gray-400',
      'transition-colors duration-150',
      'focus:outline-none',
      error
        ? 'border-red-500 focus:border-red-600'
        : isFocused
          ? 'border-blue-600 dark:border-blue-400'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mui-prompt-title"
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
            'relative w-full max-w-sm bg-white dark:bg-gray-900',
            'rounded shadow-2xl',
            'transition-all duration-225 ease-out',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title - MUI DialogTitle */}
          <div className="px-6 pt-6 pb-2">
            <h2
              id="mui-prompt-title"
              className="text-xl font-medium text-gray-900 dark:text-gray-100"
            >
              {title}
            </h2>
          </div>

          {/* Content - MUI DialogContent */}
          <div className="px-6 py-2">
            {/* Message */}
            {message && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {message}
              </p>
            )}

            {/* Input - MUI TextField */}
            <div className="relative">
              {inputType === 'textarea' ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  rows={4}
                  className={inputClassName}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'mui-prompt-error' : undefined}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={inputType}
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className={inputClassName}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'mui-prompt-error' : undefined}
                />
              )}

              {/* Error message - MUI FormHelperText */}
              {error && (
                <p
                  id="mui-prompt-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Actions - MUI DialogActions */}
          <div className="flex justify-end gap-2 px-6 pb-6 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
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
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'px-4 py-2 min-w-[64px] rounded',
                'text-sm font-medium uppercase tracking-wide',
                'bg-blue-600 text-white hover:bg-blue-700',
                'shadow hover:shadow-md',
                'transition-all duration-150',
                'disabled:opacity-50'
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

MuiPrompt.displayName = 'MuiPrompt';
