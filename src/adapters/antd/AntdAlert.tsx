/**
 * AntdAlert - Ant Design adapter alert component
 * Implements Ant Design Alert with proper styling and variants
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterAlertProps } from '../types';

/**
 * Variant styles following Ant Design alert colors
 */
const variantStyles = {
  default:
    'of-antd-alert-default bg-gray-50 border-gray-300 text-gray-800',
  success:
    'of-antd-alert-success bg-green-50 border-green-200 text-green-800',
  error:
    'of-antd-alert-error bg-red-50 border-red-200 text-red-800',
  warning:
    'of-antd-alert-warning bg-yellow-50 border-yellow-200 text-yellow-800',
  info:
    'of-antd-alert-info bg-blue-50 border-blue-200 text-blue-800',
};

/**
 * Icon colors matching Ant Design theme
 */
const iconColors = {
  default: 'text-gray-500',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

/**
 * Default icons for variants (Ant Design style)
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
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
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
 * AntdAlert component
 * Renders an alert message with Ant Design styling
 */
export const AntdAlert = memo(
  forwardRef<HTMLDivElement, IAdapterAlertProps>(function AntdAlert(props, ref) {
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
          'of-antd-alert',
          'relative rounded border p-4',
          'transition-all duration-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        <div className="of-antd-alert-content flex">
          {!hideIcon && displayIcon && (
            <div className={cn('of-antd-alert-icon flex-shrink-0 mr-3 mt-0.5', iconColors[variant])}>
              {displayIcon}
            </div>
          )}

          <div className="of-antd-alert-message flex-1">
            {title && (
              <h4 className="of-antd-alert-title text-sm font-semibold mb-1">{title}</h4>
            )}
            <div className="of-antd-alert-description text-sm">{message}</div>

            {actions && actions.length > 0 && (
              <div className="of-antd-alert-actions mt-3 flex gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'of-antd-alert-action text-sm font-medium px-3 py-1 rounded transition-colors',
                      action.variant === 'primary' &&
                        'bg-blue-500 text-white hover:bg-blue-600',
                      action.variant === 'secondary' &&
                        'border border-gray-300 text-gray-700 hover:bg-gray-50',
                      action.variant === 'link' &&
                        'text-blue-600 hover:text-blue-700 underline',
                      action.variant === 'danger' &&
                        'text-red-600 hover:text-red-700',
                      !action.variant && 'text-blue-600 hover:text-blue-700'
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
              className="of-antd-alert-close flex-shrink-0 ml-4 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              aria-label="Close alert"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  })
);

AntdAlert.displayName = 'AntdAlert';
