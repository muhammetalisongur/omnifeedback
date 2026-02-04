/**
 * HeadlessResult - Headless adapter result page component
 * Pure Tailwind CSS implementation for status pages
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterResultProps, ResultStatus } from '../types';

/**
 * Default icons for result statuses
 */
const defaultIcons: Record<ResultStatus, React.ReactNode> = {
  success: (
    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  info: (
    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  '404': (
    <div className="text-6xl font-bold text-gray-400 dark:text-gray-600">404</div>
  ),
  '403': (
    <div className="text-6xl font-bold text-gray-400 dark:text-gray-600">403</div>
  ),
  '500': (
    <div className="text-6xl font-bold text-gray-400 dark:text-gray-600">500</div>
  ),
};

/**
 * HeadlessResult component
 * Renders a result/status page
 */
export const HeadlessResult = memo(
  forwardRef<HTMLDivElement, IAdapterResultProps>(function HeadlessResult(props, ref) {
    const {
      resultStatus,
      title,
      subtitle,
      icon,
      extra,
      actions,
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';
    const displayIcon = icon ?? defaultIcons[resultStatus];

    return (
      <div
        ref={ref}
        role="status"
        data-testid={testId}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {/* Icon */}
        {displayIcon && <div className="mb-6">{displayIcon}</div>}

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">{subtitle}</p>
        )}

        {/* Extra content */}
        {extra && <div className="mb-6">{extra}</div>}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  action.variant === 'primary' &&
                    'bg-blue-600 text-white hover:bg-blue-700',
                  action.variant === 'secondary' &&
                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
                  action.variant === 'danger' &&
                    'bg-red-600 text-white hover:bg-red-700',
                  action.variant === 'link' &&
                    'text-blue-600 dark:text-blue-400 hover:underline',
                  !action.variant &&
                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  })
);

HeadlessResult.displayName = 'HeadlessResult';
