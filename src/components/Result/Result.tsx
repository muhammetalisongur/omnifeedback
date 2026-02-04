/**
 * Result - Result page component for displaying operation outcomes
 * Used after form submissions, payments, or important operations
 */

import { memo, forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import type { IResultProps, IResultAction, ResultStatus, ResultSize, IResultStatusConfig } from './types';
import {
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
  WarningIcon,
  NotFoundIcon,
  ForbiddenIcon,
  ServerErrorIcon,
  LoadingSpinner,
} from './icons';

/**
 * Status configuration mapping
 * Defines icon background and color for each status
 */
const statusConfig: Record<ResultStatus, IResultStatusConfig> = {
  success: {
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-500 dark:text-green-400',
  },
  error: {
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  info: {
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
  warning: {
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
  },
  '404': {
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-500 dark:text-gray-400',
  },
  '403': {
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  '500': {
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500 dark:text-red-400',
  },
};

/**
 * Default icons for each status
 */
const statusIcons: Record<ResultStatus, ReactNode> = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
  warning: <WarningIcon />,
  '404': <NotFoundIcon />,
  '403': <ForbiddenIcon />,
  '500': <ServerErrorIcon />,
};

/**
 * Size configuration for responsive styling
 */
const sizeConfig: Record<ResultSize, {
  container: string;
  iconWrapper: string;
  iconSize: string;
  title: string;
  description: string;
}> = {
  sm: {
    container: 'py-8 px-4',
    iconWrapper: 'p-3 mb-4',
    iconSize: 'w-10 h-10',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    container: 'py-12 px-6',
    iconWrapper: 'p-4 mb-6',
    iconSize: 'w-14 h-14',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    container: 'py-16 px-8',
    iconWrapper: 'p-5 mb-8',
    iconSize: 'w-18 h-18',
    title: 'text-2xl',
    description: 'text-lg',
  },
};

/**
 * Button variant styles
 */
const buttonVariants = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-6 py-2.5',
  secondary:
    'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2.5',
  link: 'text-blue-600 dark:text-blue-400 hover:underline',
};

/**
 * Action button component
 */
function ResultButton({
  action,
  variant,
  testId,
}: {
  action: IResultAction;
  variant: 'primary' | 'secondary' | 'link';
  testId?: string;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled ?? action.loading}
      data-testid={testId}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant]
      )}
    >
      {action.loading ? (
        <span className="w-4 h-4">
          <LoadingSpinner />
        </span>
      ) : (
        action.icon && <span className="flex-shrink-0">{action.icon}</span>
      )}
      {action.label}
    </button>
  );
}

/**
 * Result component
 * Displays operation outcomes with icon, title, description and action buttons
 *
 * @example
 * ```tsx
 * // Success result
 * <Result
 *   status="success"
 *   title="Payment Successful!"
 *   description="Your order #12345 has been created."
 *   primaryAction={{
 *     label: 'View Order',
 *     onClick: () => navigate('/orders/12345'),
 *   }}
 * />
 *
 * // Error page
 * <Result
 *   status="404"
 *   title="Page Not Found"
 *   description="The page you are looking for does not exist."
 *   primaryAction={{
 *     label: 'Go Home',
 *     onClick: () => navigate('/'),
 *   }}
 * />
 * ```
 */
export const Result = memo(
  forwardRef<HTMLDivElement, IResultProps>(function Result(props, ref) {
    const {
      status,
      title,
      description,
      icon: customIcon,
      primaryAction,
      secondaryAction,
      extraActions,
      extra,
      size = 'md',
      className,
      style,
      testId,
    } = props;

    // Get configuration based on status and size
    const config = statusConfig[status];
    const sizes = sizeConfig[size];
    const displayIcon = customIcon ?? statusIcons[status];

    // Determine aria role based on status
    const ariaRole = status === 'error' || status === '500' ? 'alert' : 'status';

    return (
      <div
        ref={ref}
        role={ariaRole}
        aria-live="polite"
        data-testid={testId}
        data-result-status={status}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizes.container,
          className
        )}
        style={style}
      >
        {/* Icon */}
        <div
          className={cn('rounded-full', sizes.iconWrapper, config.iconBg)}
          data-testid={testId ? `${testId}-icon` : undefined}
        >
          <div className={cn(sizes.iconSize, config.iconColor)}>{displayIcon}</div>
        </div>

        {/* Title */}
        <h1
          className={cn(
            'font-bold text-gray-900 dark:text-gray-100 mb-2',
            sizes.title
          )}
          data-testid={testId ? `${testId}-title` : undefined}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            className={cn(
              'text-gray-500 dark:text-gray-400 max-w-md',
              sizes.description,
              (primaryAction ?? secondaryAction ?? extraActions) ? 'mb-8' : ''
            )}
            data-testid={testId ? `${testId}-description` : undefined}
          >
            {description}
          </p>
        )}

        {/* Primary and Secondary Actions */}
        {(primaryAction ?? secondaryAction) && (
          <div
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
            data-testid={testId ? `${testId}-actions` : undefined}
          >
            {primaryAction && (
              <ResultButton
                action={primaryAction}
                variant="primary"
                {...(testId !== undefined && { testId: `${testId}-primary-action` })}
              />
            )}
            {secondaryAction && (
              <ResultButton
                action={secondaryAction}
                variant="secondary"
                {...(testId !== undefined && { testId: `${testId}-secondary-action` })}
              />
            )}
          </div>
        )}

        {/* Extra Actions */}
        {extraActions && extraActions.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-center gap-4 mb-6"
            data-testid={testId ? `${testId}-extra-actions` : undefined}
          >
            {extraActions.map((action, index) => (
              <ResultButton
                key={index}
                action={action}
                variant="link"
                {...(testId !== undefined && { testId: `${testId}-extra-action-${String(index)}` })}
              />
            ))}
          </div>
        )}

        {/* Extra Content */}
        {extra && (
          <div
            className="w-full max-w-md"
            data-testid={testId ? `${testId}-extra` : undefined}
          >
            {extra}
          </div>
        )}
      </div>
    );
  })
);

Result.displayName = 'Result';
