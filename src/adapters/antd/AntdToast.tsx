/**
 * AntdToast - Ant Design adapter toast component
 * Implements Ant Design notification style with proper theming
 */

import { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastProps } from '../types';

/**
 * Variant styles following Ant Design color palette
 */
const variantStyles = {
  default:
    'of-antd-toast-default bg-white border-gray-200 text-gray-800',
  success:
    'of-antd-toast-success bg-green-50 border-green-300 text-green-800',
  error:
    'of-antd-toast-error bg-red-50 border-red-300 text-red-800',
  warning:
    'of-antd-toast-warning bg-yellow-50 border-yellow-300 text-yellow-800',
  info:
    'of-antd-toast-info bg-blue-50 border-blue-300 text-blue-800',
};

/**
 * Icon colors matching Ant Design theme
 */
const iconColors = {
  default: 'text-gray-400',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

/**
 * Default icons for each variant (Ant Design style)
 */
const defaultIcons = {
  default: null,
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
};

/**
 * AntdToast component
 * Renders a toast notification with Ant Design styling
 */
export const AntdToast = memo(
  forwardRef<HTMLDivElement, IAdapterToastProps>(function AntdToast(props, ref) {
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

    const displayIcon = icon !== undefined ? icon : defaultIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-testid={testId}
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          'of-antd-toast',
          'relative flex items-start gap-3 w-full max-w-sm p-4',
          'border rounded-lg shadow-md',
          'pointer-events-auto',
          'transition-all duration-300 ease-out',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        {/* Icon */}
        {displayIcon && (
          <span className={cn('of-antd-toast-icon flex-shrink-0 mt-0.5', iconColors[variant])}>
            {displayIcon}
          </span>
        )}

        {/* Content */}
        <div className="of-antd-toast-content flex-1 min-w-0">
          {title && (
            <p className="of-antd-toast-title text-sm font-semibold mb-1">{title}</p>
          )}
          <p className="of-antd-toast-message text-sm">{message}</p>

          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="of-antd-toast-action mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
              'of-antd-toast-close',
              'flex-shrink-0 p-1 rounded',
              'text-gray-400 hover:text-gray-600',
              'hover:bg-gray-100',
              'transition-colors'
            )}
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>
    );
  })
);

AntdToast.displayName = 'AntdToast';
