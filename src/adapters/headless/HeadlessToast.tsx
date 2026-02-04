/**
 * HeadlessToast - Headless adapter toast component
 * Pure Tailwind CSS implementation with dark mode support
 */

import { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastProps } from '../types';

/**
 * Variant styles for different toast types
 */
const variantStyles = {
  default:
    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100',
  success:
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error:
    'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

/**
 * Icon styles for different variants
 */
const iconStyles = {
  default: 'text-gray-400',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

/**
 * HeadlessToast component
 * Renders a toast notification with Tailwind CSS styling
 */
export const HeadlessToast = memo(
  forwardRef<HTMLDivElement, IAdapterToastProps>(function HeadlessToast(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      action,
      status,
      onDismiss,
      onRemove,
      className,
      style,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        requestAnimationFrame(() => setIsVisible(true));
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    const handleTransitionEnd = useCallback(() => {
      if (status === 'exiting') {
        onRemove?.();
      }
    }, [status, onRemove]);

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-testid={testId}
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          'relative flex items-start gap-3 w-full max-w-sm p-4',
          'border rounded-lg shadow-lg',
          'pointer-events-auto',
          'transition-all duration-200 ease-out',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        {/* Icon */}
        {icon && <span className={cn('flex-shrink-0 mt-0.5', iconStyles[variant])}>{icon}</span>}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className="text-sm font-semibold mb-1">{title}</p>}
          <p className="text-sm">{message}</p>

          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded',
              'hover:bg-black/5 dark:hover:bg-white/5',
              'transition-colors'
            )}
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  })
);

HeadlessToast.displayName = 'HeadlessToast';
