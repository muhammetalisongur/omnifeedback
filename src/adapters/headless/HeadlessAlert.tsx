/**
 * HeadlessAlert - Headless adapter alert component
 * Pure Tailwind CSS implementation with multiple variants
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterAlertProps } from '../types';

/**
 * Variant styles for different alert types
 */
const variantStyles = {
  default:
    'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200',
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
 * Default icons for variants
 */
const defaultIcons = {
  default: null,
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

/**
 * HeadlessAlert component
 * Renders an alert message with Tailwind CSS styling
 */
export const HeadlessAlert = memo(
  forwardRef<HTMLDivElement, IAdapterAlertProps>(function HeadlessAlert(props, ref) {
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
        const raf = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(raf);
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
      return undefined;
    }, [status]);

    const displayIcon = icon !== undefined ? icon : defaultIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        data-testid={testId}
        className={cn(
          'relative rounded-lg border p-4',
          'transition-all duration-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        <div className="flex">
          {!hideIcon && displayIcon && (
            <div className={cn('flex-shrink-0 mr-3', iconStyles[variant])}>{displayIcon}</div>
          )}

          <div className="flex-1">
            {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
            <div className="text-sm">{message}</div>

            {actions && actions.length > 0 && (
              <div className="mt-3 flex gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'text-sm font-medium px-3 py-1.5 rounded transition-colors',
                      action.variant === 'primary' && 'bg-current/10 hover:bg-current/20',
                      action.variant === 'secondary' && 'border hover:bg-current/5',
                      action.variant === 'link' && 'underline hover:no-underline',
                      action.variant === 'danger' && 'text-red-600 hover:text-red-700'
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
              className="flex-shrink-0 ml-4 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
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

HeadlessAlert.displayName = 'HeadlessAlert';
