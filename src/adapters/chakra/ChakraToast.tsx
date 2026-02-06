/**
 * ChakraToast - Chakra UI adapter toast component
 * Chakra UI-specific styling implementation with dark mode support
 */

import { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastProps } from '../types';

/**
 * Variant styles for different toast types (Chakra UI color scheme)
 */
const variantStyles = {
  default:
    'chakra-toast-default bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white',
  success:
    'chakra-toast-success bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-800 dark:text-green-200',
  error:
    'chakra-toast-error bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-800 dark:text-red-200',
  warning:
    'chakra-toast-warning bg-orange-100 dark:bg-orange-900 border-orange-500 dark:border-orange-700 text-orange-800 dark:text-orange-200',
  info: 'chakra-toast-info bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700 text-blue-800 dark:text-blue-200',
};

/**
 * Icon styles for different variants (Chakra UI color scheme)
 */
const iconStyles = {
  default: 'text-gray-500',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-orange-500',
  info: 'text-blue-500',
};

/**
 * ChakraToast component
 * Renders a toast notification with Chakra UI styling
 */
export const ChakraToast = memo(
  forwardRef<HTMLDivElement, IAdapterToastProps>(function ChakraToast(props, ref) {
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
          'chakra-toast',
          'relative flex items-start gap-3 w-full max-w-sm p-4',
          'border-l-4 rounded-md shadow-lg',
          'pointer-events-auto',
          'transition-all duration-200 ease-out',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        {/* Icon */}
        {icon && <span className={cn('chakra-toast-icon flex-shrink-0 mt-0.5', iconStyles[variant])}>{icon}</span>}

        {/* Content */}
        <div className="chakra-toast-content flex-1 min-w-0">
          {title && <p className="chakra-toast-title text-sm font-semibold mb-1">{title}</p>}
          <p className="chakra-toast-message text-sm">{message}</p>

          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="chakra-toast-action mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
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
              'chakra-toast-close flex-shrink-0 p-1 rounded',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'focus:outline-none focus:ring-2 focus:ring-current',
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

ChakraToast.displayName = 'ChakraToast';
