/**
 * MuiToast - Material UI adapter toast component
 * Material Design styling with elevation and paper-like appearance
 */

import { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastProps } from '../types';

/**
 * Variant styles for different toast types (MUI color palette)
 */
const variantStyles = {
  default:
    'bg-white dark:bg-gray-800 border-l-4 border-l-gray-500 text-gray-900 dark:text-gray-100',
  success:
    'bg-white dark:bg-gray-800 border-l-4 border-l-green-500 text-gray-900 dark:text-gray-100',
  error:
    'bg-white dark:bg-gray-800 border-l-4 border-l-red-500 text-gray-900 dark:text-gray-100',
  warning:
    'bg-white dark:bg-gray-800 border-l-4 border-l-orange-500 text-gray-900 dark:text-gray-100',
  info: 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 text-gray-900 dark:text-gray-100',
};

/**
 * Icon colors for different variants
 */
const iconColors = {
  default: 'text-gray-500',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-orange-500',
  info: 'text-blue-500',
};

/**
 * MuiToast component
 * Renders a toast notification with Material Design styling
 */
export const MuiToast = memo(
  forwardRef<HTMLDivElement, IAdapterToastProps>(function MuiToast(props, ref) {
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
          // MUI Paper-like appearance
          'relative flex items-start gap-3 w-full max-w-sm',
          'rounded shadow-md',
          'p-4',
          'pointer-events-auto',
          // MUI-style transitions
          'transition-all duration-225 ease-out',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        {/* Icon */}
        {icon && (
          <span className={cn('flex-shrink-0 mt-0.5', iconColors[variant])}>
            {icon}
          </span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-medium mb-0.5 text-gray-900 dark:text-gray-100">
              {title}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>

          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                'mt-2 text-sm font-medium uppercase tracking-wide',
                'text-blue-600 dark:text-blue-400',
                'hover:text-blue-700 dark:hover:text-blue-300',
                'transition-colors'
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button - MUI IconButton style */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 -mr-1 -mt-1 rounded-full',
              'text-gray-500 dark:text-gray-400',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors duration-150'
            )}
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

MuiToast.displayName = 'MuiToast';
