/**
 * MantineToast - Mantine adapter toast component
 * Styled with Mantine color variables and design patterns
 */

import { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastProps } from '../types';

/**
 * Variant styles for different toast types using Mantine color scheme
 */
const variantStyles = {
  default:
    'bg-white dark:bg-[var(--mantine-color-dark-7)] border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)] text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)]',
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
 * MantineToast component
 * Renders a toast notification with Mantine styling
 */
export const MantineToast = memo(
  forwardRef<HTMLDivElement, IAdapterToastProps>(function MantineToast(props, ref) {
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
        const raf = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(raf);
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
      return undefined;
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
          'border rounded-md shadow-md',
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
          {title && (
            <p className="text-sm font-semibold mb-1 font-[var(--mantine-font-family)]">{title}</p>
          )}
          <p className="text-sm font-[var(--mantine-font-family)]">{message}</p>

          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline font-[var(--mantine-font-family)]"
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
              'hover:bg-[var(--mantine-color-gray-1)] dark:hover:bg-[var(--mantine-color-dark-5)]',
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

MantineToast.displayName = 'MantineToast';
