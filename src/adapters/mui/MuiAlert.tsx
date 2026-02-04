/**
 * MuiAlert - Material UI adapter alert component
 * Material Design alert with standard color variants
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterAlertProps } from '../types';

/**
 * Variant styles for different alert types (MUI Alert colors)
 */
const variantStyles = {
  default:
    'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200',
  success:
    'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
  error:
    'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
  warning:
    'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
};

/**
 * Icon colors for different variants
 */
const iconColors = {
  default: 'text-gray-500',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-orange-600 dark:text-orange-400',
  info: 'text-blue-600 dark:text-blue-400',
};

/**
 * Default icons for variants (MUI-style icons)
 */
const defaultIcons = {
  default: null,
  success: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
};

/**
 * MuiAlert component
 * Renders an alert message with Material Design styling
 */
export const MuiAlert = memo(
  forwardRef<HTMLDivElement, IAdapterAlertProps>(function MuiAlert(props, ref) {
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
          // MUI Alert styling
          'relative rounded border p-4',
          'transition-all duration-225',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        <div className="flex">
          {!hideIcon && displayIcon && (
            <div className={cn('flex-shrink-0 mr-3', iconColors[variant])}>
              {displayIcon}
            </div>
          )}

          <div className="flex-1">
            {title && (
              <h3 className="text-base font-medium mb-1">{title}</h3>
            )}
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
                      action.variant === 'primary' &&
                        'bg-blue-600 text-white hover:bg-blue-700',
                      action.variant === 'secondary' &&
                        'border border-current hover:bg-black/5 dark:hover:bg-white/5',
                      action.variant === 'link' &&
                        'text-blue-600 dark:text-blue-400 hover:underline',
                      action.variant === 'danger' &&
                        'bg-red-600 text-white hover:bg-red-700',
                      !action.variant &&
                        'hover:bg-black/5 dark:hover:bg-white/5'
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
                'flex-shrink-0 ml-4 p-1 rounded-full',
                'hover:bg-black/10 dark:hover:bg-white/10',
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
      </div>
    );
  })
);

MuiAlert.displayName = 'MuiAlert';
