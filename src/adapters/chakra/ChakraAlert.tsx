/**
 * ChakraAlert - Chakra UI adapter alert component
 * Chakra UI-specific styling with multiple variants
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterAlertProps } from '../types';

/**
 * Variant styles for different alert types (Chakra UI color scheme)
 */
const variantStyles = {
  default:
    'chakra-alert-default bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100',
  success:
    'chakra-alert-success bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-800 dark:text-green-200',
  error:
    'chakra-alert-error bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-800 dark:text-red-200',
  warning:
    'chakra-alert-warning bg-orange-100 dark:bg-orange-900 border-orange-500 dark:border-orange-700 text-orange-800 dark:text-orange-200',
  info: 'chakra-alert-info bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700 text-blue-800 dark:text-blue-200',
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
 * Default icons for variants (Chakra UI style icons)
 */
const defaultIcons = {
  default: null,
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

/**
 * ChakraAlert component
 * Renders an alert message with Chakra UI styling
 */
export const ChakraAlert = memo(
  forwardRef<HTMLDivElement, IAdapterAlertProps>(function ChakraAlert(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      hideIcon,
      actions,
      status,
      onRequestDismiss,
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

    const displayIcon = icon !== undefined ? icon : defaultIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        data-testid={testId}
        className={cn(
          'chakra-alert',
          'relative rounded-md border-l-4 p-4',
          'transition-all duration-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        <div className="flex">
          {!hideIcon && displayIcon && (
            <div className={cn('chakra-alert-icon flex-shrink-0 mr-3', iconStyles[variant])}>{displayIcon}</div>
          )}

          <div className="chakra-alert-content flex-1">
            {title && <h3 className="chakra-alert-title text-sm font-semibold mb-1">{title}</h3>}
            <div className="chakra-alert-description text-sm">{message}</div>

            {actions && actions.length > 0 && (
              <div className="chakra-alert-actions mt-3 flex gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'chakra-alert-action text-sm font-medium px-3 py-1.5 rounded-md transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2',
                      action.variant === 'primary' && 'bg-current/10 hover:bg-current/20 focus:ring-current',
                      action.variant === 'secondary' && 'border hover:bg-current/5 focus:ring-gray-500',
                      action.variant === 'link' && 'underline hover:no-underline focus:ring-blue-500',
                      action.variant === 'danger' && 'text-red-600 hover:text-red-700 focus:ring-red-500'
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {dismissible && (
            <button
              type="button"
              onClick={onRequestDismiss}
              className={cn(
                'chakra-alert-close flex-shrink-0 ml-4 p-1 rounded-md',
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
      </div>
    );
  })
);

ChakraAlert.displayName = 'ChakraAlert';
