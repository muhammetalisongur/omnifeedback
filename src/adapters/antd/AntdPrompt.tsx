/**
 * AntdPrompt - Ant Design adapter prompt dialog component
 * Implements Ant Design Modal with input field for user prompts
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterPromptProps } from '../types';

/**
 * AntdPrompt component
 * Renders a prompt dialog for user input with Ant Design styling
 */
export const AntdPrompt = memo(
  forwardRef<HTMLDivElement, IAdapterPromptProps>(function AntdPrompt(props, ref) {
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
      'of-antd-input',
      'w-full px-3 py-2 rounded',
      'border border-gray-300',
      'bg-white text-gray-900',
      'placeholder:text-gray-400',
      'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      'transition-colors',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="antd-prompt-title"
        data-testid={testId}
        className={cn(
          'of-antd-prompt-wrapper',
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/45',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 1000, ...style }}
        onClick={onCancel}
      >
        <div
          ref={dialogRef}
          className={cn(
            'of-antd-prompt',
            'relative w-full max-w-md bg-white',
            'rounded-lg shadow-xl',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e: React.MouseEvent): void => { e.stopPropagation(); }}
        >
          {/* Header */}
          <div className="of-antd-prompt-header px-6 py-4 border-b border-gray-200">
            <h2
              id="antd-prompt-title"
              className="of-antd-prompt-title text-base font-semibold text-gray-900"
            >
              {title}
            </h2>
          </div>

          {/* Body */}
          <div className="of-antd-prompt-body px-6 py-4">
            {/* Message */}
            {message && (
              <p className="of-antd-prompt-message text-sm text-gray-500 mb-4">{message}</p>
            )}

            {/* Input */}
            <div className="of-antd-prompt-input">
              {inputType === 'textarea' ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={value}
                  onChange={(e): void => { onValueChange(e.target.value); }}
                  placeholder={placeholder}
                  rows={4}
                  className={inputClassName}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'antd-prompt-error' : undefined}
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
                  aria-describedby={error ? 'antd-prompt-error' : undefined}
                />
              )}

              {/* Error message */}
              {error && (
                <p
                  id="antd-prompt-error"
                  className="of-antd-prompt-error mt-2 text-sm text-red-500"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="of-antd-prompt-footer px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                'of-antd-btn of-antd-btn-default',
                'px-4 py-1.5 text-sm rounded',
                'border border-gray-300',
                'text-gray-700 bg-white',
                'hover:text-blue-500 hover:border-blue-500',
                'transition-colors disabled:opacity-50'
              )}
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={(): void => { void handleConfirm(); }}
              disabled={loading}
              className={cn(
                'of-antd-btn of-antd-btn-primary',
                'px-4 py-1.5 text-sm font-medium rounded',
                'bg-blue-500 text-white hover:bg-blue-600',
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

AntdPrompt.displayName = 'AntdPrompt';
