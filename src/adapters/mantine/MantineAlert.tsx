/**
 * MantineAlert - Mantine adapter alert component
 * Styled with Mantine color variables and design patterns
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterAlertProps } from '../types';

/**
 * Variant styles for different alert types using Mantine colors
 */
const variantStyles = {
  default:
    'bg-[var(--mantine-color-gray-0)] dark:bg-[var(--mantine-color-dark-6)] border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)] text-[var(--mantine-color-gray-8)] dark:text-[var(--mantine-color-gray-2)]',
  success:
    'bg-[var(--mantine-color-green-0)] dark:bg-[var(--mantine-color-green-9)]/20 border-[var(--mantine-color-green-4)] dark:border-[var(--mantine-color-green-8)] text-[var(--mantine-color-green-9)] dark:text-[var(--mantine-color-green-1)]',
  error:
    'bg-[var(--mantine-color-red-0)] dark:bg-[var(--mantine-color-red-9)]/20 border-[var(--mantine-color-red-4)] dark:border-[var(--mantine-color-red-8)] text-[var(--mantine-color-red-9)] dark:text-[var(--mantine-color-red-1)]',
  warning:
    'bg-[var(--mantine-color-yellow-0)] dark:bg-[var(--mantine-color-yellow-9)]/20 border-[var(--mantine-color-yellow-4)] dark:border-[var(--mantine-color-yellow-8)] text-[var(--mantine-color-yellow-9)] dark:text-[var(--mantine-color-yellow-1)]',
  info: 'bg-[var(--mantine-color-blue-0)] dark:bg-[var(--mantine-color-blue-9)]/20 border-[var(--mantine-color-blue-4)] dark:border-[var(--mantine-color-blue-8)] text-[var(--mantine-color-blue-9)] dark:text-[var(--mantine-color-blue-1)]',
};

/**
 * Icon styles for different variants
 */
const iconStyles = {
  default: 'text-[var(--mantine-color-gray-5)]',
  success: 'text-[var(--mantine-color-green-6)]',
  error: 'text-[var(--mantine-color-red-6)]',
  warning: 'text-[var(--mantine-color-yellow-6)]',
  info: 'text-[var(--mantine-color-blue-6)]',
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
 * MantineAlert component
 * Renders an alert message with Mantine styling
 */
export const MantineAlert = memo(
  forwardRef<HTMLDivElement, IAdapterAlertProps>(function MantineAlert(props, ref) {
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
          'relative rounded-md border p-4',
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
            {title && (
              <h3 className="text-sm font-semibold mb-1 font-[var(--mantine-font-family)]">
                {title}
              </h3>
            )}
            <div className="text-sm font-[var(--mantine-font-family)]">{message}</div>

            {actions && actions.length > 0 && (
              <div className="mt-3 flex gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'text-sm font-medium px-3 py-1.5 rounded transition-colors font-[var(--mantine-font-family)]',
                      action.variant === 'primary' && 'bg-current/10 hover:bg-current/20',
                      action.variant === 'secondary' && 'border hover:bg-current/5',
                      action.variant === 'link' && 'underline hover:no-underline',
                      action.variant === 'danger' &&
                        'text-[var(--mantine-color-red-6)] hover:text-[var(--mantine-color-red-7)]'
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
              className="flex-shrink-0 ml-4 p-1 rounded hover:bg-[var(--mantine-color-gray-1)] dark:hover:bg-[var(--mantine-color-dark-5)] transition-colors"
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

MantineAlert.displayName = 'MantineAlert';
