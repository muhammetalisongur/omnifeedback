/**
 * Alert component - Inline alert/banner for important messages
 * Displays within page content flow (not floating like toast)
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from './icons';
import type {
  FeedbackStatus,
  FeedbackVariant,
  IAlertAction,
} from '../../core/types';

/**
 * Alert component props
 */
export interface IAlertProps {
  /** Alert message (required) */
  message: string;
  /** Alert title */
  title?: string;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Hide default icon */
  hideIcon?: boolean;
  /** Action buttons */
  actions?: IAlertAction[];
  /** Show border */
  bordered?: boolean;
  /** Use filled background style */
  filled?: boolean;
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when dismiss clicked */
  onRequestDismiss: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Variant-specific styles
 */
const variantStyles: Record<
  FeedbackVariant,
  { base: string; filled: string; icon: string }
> = {
  default: {
    base: 'bg-gray-50 border-gray-200 text-gray-800',
    filled: 'bg-gray-100 border-gray-200 text-gray-800',
    icon: 'text-gray-500',
  },
  success: {
    base: 'bg-green-50 border-green-200 text-green-800',
    filled: 'bg-green-100 border-green-200 text-green-800',
    icon: 'text-green-500',
  },
  error: {
    base: 'bg-red-50 border-red-200 text-red-800',
    filled: 'bg-red-100 border-red-200 text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    base: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    filled: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-600',
  },
  info: {
    base: 'bg-blue-50 border-blue-200 text-blue-800',
    filled: 'bg-blue-100 border-blue-200 text-blue-800',
    icon: 'text-blue-500',
  },
};

/**
 * Default icons for each variant
 */
const defaultIcons: Record<FeedbackVariant, React.ReactNode> = {
  success: <CheckCircleIcon className="w-5 h-5" />,
  error: <XCircleIcon className="w-5 h-5" />,
  warning: <ExclamationTriangleIcon className="w-5 h-5" />,
  info: <InformationCircleIcon className="w-5 h-5" />,
  default: <InformationCircleIcon className="w-5 h-5" />,
};

/**
 * Alert component
 * Inline alert for displaying important messages within the page content flow
 *
 * @example
 * ```tsx
 * // Basic alert
 * <Alert
 *   message="Your changes have been saved."
 *   variant="success"
 *   status="visible"
 *   onRequestDismiss={() => {}}
 * />
 *
 * // With title and actions
 * <Alert
 *   title="Update Available"
 *   message="A new version is available."
 *   variant="info"
 *   actions={[{ label: "Update", onClick: handleUpdate }]}
 *   status="visible"
 *   onRequestDismiss={() => {}}
 * />
 * ```
 */
export const Alert = memo(
  forwardRef<HTMLDivElement, IAlertProps>(function Alert(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      hideIcon = false,
      actions,
      bordered = true,
      filled = false,
      status,
      onRequestDismiss,
      className,
      style,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);

    // Handle enter animation
    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        const raf = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(raf);
      }
      return undefined;
    }, [status]);

    // Handle exit animation
    useEffect(() => {
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    const styles = variantStyles[variant];
    const displayIcon = hideIcon ? null : (icon ?? defaultIcons[variant]);

    return (
      <div
        ref={ref}
        role="alert"
        data-testid={testId}
        data-status={status}
        data-variant={variant}
        className={cn(
          'relative rounded-lg p-4',
          bordered && 'border',
          filled ? styles.filled : styles.base,
          // Animation
          'transition-all duration-200 ease-out',
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2',
          className
        )}
        style={style}
      >
        <div className="flex">
          {/* Icon */}
          {displayIcon && (
            <div
              className={cn('flex-shrink-0', styles.icon)}
              data-testid={testId ? `${testId}-icon` : undefined}
            >
              {displayIcon}
            </div>
          )}

          {/* Content */}
          <div className={cn('flex-1', displayIcon !== null && 'ml-3')}>
            {/* Title */}
            {title && (
              <h3
                className="text-sm font-semibold mb-1"
                data-testid={testId ? `${testId}-title` : undefined}
              >
                {title}
              </h3>
            )}

            {/* Message */}
            <p
              className="text-sm"
              data-testid={testId ? `${testId}-message` : undefined}
            >
              {message}
            </p>

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div
                className="mt-3 flex gap-2"
                data-testid={testId ? `${testId}-actions` : undefined}
              >
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'text-sm font-medium transition-colors',
                      action.variant === 'primary' &&
                        'px-3 py-1.5 rounded bg-current/10 hover:bg-current/20',
                      action.variant === 'secondary' &&
                        'px-3 py-1.5 rounded border border-current/20 hover:bg-current/5',
                      (!action.variant || action.variant === 'link') &&
                        'underline hover:no-underline'
                    )}
                    data-testid={testId ? `${testId}-action-${String(index)}` : undefined}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <button
              type="button"
              onClick={onRequestDismiss}
              className="flex-shrink-0 ml-4 p-1 rounded hover:bg-current/10 transition-colors"
              aria-label="Dismiss"
              data-testid={testId ? `${testId}-dismiss` : undefined}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  })
);

Alert.displayName = 'Alert';
