/**
 * Prompt - Input dialog component for user input
 * Similar to browser's prompt() but with more features
 */

import {
  memo,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { cn } from '../../utils/cn';
import type { IPromptOptions, FeedbackStatus, PromptInputType } from '../../core/types';

/**
 * Props for the Prompt component
 */
export interface IPromptProps extends IPromptOptions {
  /** Current feedback status */
  status: FeedbackStatus;
}

/**
 * Prompt component
 * Renders an input dialog with validation support
 *
 * @example
 * ```tsx
 * <Prompt
 *   title="Enter your name"
 *   placeholder="John Doe"
 *   onConfirm={(value) => console.log(value)}
 *   onCancel={() => console.log('Cancelled')}
 *   status="visible"
 * />
 * ```
 */
export const Prompt = memo(
  forwardRef<HTMLDivElement, IPromptProps>(function Prompt(props, ref) {
    const {
      title,
      description,
      inputType = 'text',
      placeholder,
      defaultValue = '',
      confirmText = 'OK',
      cancelText = 'Cancel',
      label,
      validate,
      required,
      minLength,
      maxLength,
      pattern,
      icon,
      rows = 4,
      autoFocus = true,
      selectOnFocus = false,
      status,
      onConfirm,
      onCancel,
      className,
      testId,
    } = props;

    // State
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Visibility states
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    /**
     * Auto-focus input when visible
     */
    useEffect(() => {
      if (isVisible && autoFocus && inputRef.current) {
        // Small delay to ensure the dialog is rendered
        const timer = setTimeout(() => {
          inputRef.current?.focus();
          if (selectOnFocus && defaultValue) {
            inputRef.current?.select();
          }
        }, 50);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [isVisible, autoFocus, selectOnFocus, defaultValue]);

    /**
     * Handle ESC key to cancel
     */
    useEffect(() => {
      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape' && isVisible && onCancel) {
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onCancel]);

    /**
     * Validate input value
     */
    const validateValue = useCallback(
      (val: string): string | null => {
        // Required check
        if (required && !val.trim()) {
          return 'This field is required';
        }

        // Min length check
        if (minLength !== undefined && val.length < minLength) {
          return `Must be at least ${minLength} characters`;
        }

        // Max length check
        if (maxLength !== undefined && val.length > maxLength) {
          return `Must be at most ${maxLength} characters`;
        }

        // Pattern check
        if (pattern && !pattern.test(val)) {
          return 'Invalid format';
        }

        // Custom validation
        if (validate) {
          const result = validate(val);
          if (result !== true) {
            return result;
          }
        }

        return null;
      },
      [required, minLength, maxLength, pattern, validate]
    );

    /**
     * Handle form submit
     */
    const handleSubmit = useCallback(
      async (e: FormEvent) => {
        e.preventDefault();

        const validationError = validateValue(value);
        if (validationError) {
          setError(validationError);
          return;
        }

        setIsSubmitting(true);
        try {
          await onConfirm(value);
        } finally {
          setIsSubmitting(false);
        }
      },
      [value, validateValue, onConfirm]
    );

    /**
     * Handle input change
     */
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        // Clear error on change
        if (error) {
          setError(null);
        }
      },
      [error]
    );

    /**
     * Handle key down for Enter submit (except textarea)
     */
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputType !== 'textarea') {
          e.preventDefault();
          handleSubmit(e as unknown as FormEvent);
        }
      },
      [inputType, handleSubmit]
    );

    /**
     * Handle backdrop click
     */
    const handleBackdropClick = useCallback(() => {
      if (onCancel) {
        onCancel();
      }
    }, [onCancel]);

    /**
     * Get input type for HTML input element
     */
    const getHtmlInputType = (type: PromptInputType): string => {
      if (type === 'textarea') return 'text';
      return type;
    };

    /**
     * Common input classes
     */
    const inputClasses = cn(
      'w-full px-3 py-2 border rounded-lg',
      'bg-white dark:bg-gray-700',
      'border-gray-300 dark:border-gray-600',
      'text-gray-900 dark:text-white',
      'placeholder-gray-400 dark:placeholder-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-red-500 focus:ring-red-500',
      inputType === 'textarea' && 'resize-none'
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={testId ? `${testId}-title` : 'prompt-title'}
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 10000 }}
        onClick={handleBackdropClick}
      >
        <form
          onSubmit={handleSubmit}
          data-testid={testId ? `${testId}-form` : undefined}
          className={cn(
            'relative w-full max-w-md bg-white dark:bg-gray-800',
            'rounded-lg shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          {icon && (
            <div
              className="flex justify-center mb-4"
              data-testid={testId ? `${testId}-icon` : undefined}
            >
              {icon}
            </div>
          )}

          {/* Title */}
          <h2
            id={testId ? `${testId}-title` : 'prompt-title'}
            className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100 mb-2"
            data-testid={testId ? `${testId}-title` : undefined}
          >
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p
              className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4"
              data-testid={testId ? `${testId}-description` : undefined}
            >
              {description}
            </p>
          )}

          {/* Input Field */}
          <div className="mb-4">
            {label && (
              <label
                htmlFor={testId ? `${testId}-input` : 'prompt-input'}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {inputType === 'textarea' ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                id={testId ? `${testId}-input` : 'prompt-input'}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                disabled={isSubmitting}
                aria-invalid={!!error}
                aria-describedby={error ? (testId ? `${testId}-error` : 'prompt-error') : undefined}
                data-testid={testId ? `${testId}-input` : undefined}
                className={inputClasses}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                id={testId ? `${testId}-input` : 'prompt-input'}
                type={getHtmlInputType(inputType)}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={isSubmitting}
                aria-invalid={!!error}
                aria-describedby={error ? (testId ? `${testId}-error` : 'prompt-error') : undefined}
                data-testid={testId ? `${testId}-input` : undefined}
                className={inputClasses}
              />
            )}

            {/* Character count */}
            {maxLength !== undefined && (
              <div
                className="text-xs text-gray-400 text-right mt-1"
                data-testid={testId ? `${testId}-char-count` : undefined}
              >
                {value.length}/{maxLength}
              </div>
            )}

            {/* Error message */}
            {error && (
              <p
                id={testId ? `${testId}-error` : 'prompt-error'}
                role="alert"
                className="text-sm text-red-500 mt-1"
                data-testid={testId ? `${testId}-error` : undefined}
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
              disabled={isSubmitting}
              data-testid={testId ? `${testId}-cancel` : undefined}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-600',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {cancelText}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid={testId ? `${testId}-confirm` : undefined}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium',
                'bg-blue-600 text-white',
                'hover:bg-blue-700',
                'transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Processing...' : confirmText}
            </button>
          </div>
        </form>
      </div>
    );
  })
);

Prompt.displayName = 'Prompt';
