/**
 * MantineResult - Mantine adapter result page component
 * Styled with Mantine color variables for status pages
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterResultProps, ResultStatus } from '../types';

/**
 * Default icons for result statuses
 */
const defaultIcons: Record<ResultStatus, React.ReactNode> = {
  success: (
    <svg
      className="w-16 h-16 text-[var(--mantine-color-green-6)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-16 h-16 text-[var(--mantine-color-red-6)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-16 h-16 text-[var(--mantine-color-blue-6)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="w-16 h-16 text-[var(--mantine-color-yellow-6)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  '404': (
    <div className="text-6xl font-bold text-[var(--mantine-color-gray-4)] dark:text-[var(--mantine-color-dark-4)] font-[var(--mantine-font-family)]">
      404
    </div>
  ),
  '403': (
    <div className="text-6xl font-bold text-[var(--mantine-color-gray-4)] dark:text-[var(--mantine-color-dark-4)] font-[var(--mantine-font-family)]">
      403
    </div>
  ),
  '500': (
    <div className="text-6xl font-bold text-[var(--mantine-color-gray-4)] dark:text-[var(--mantine-color-dark-4)] font-[var(--mantine-font-family)]">
      500
    </div>
  ),
};

/**
 * MantineResult component
 * Renders a result/status page
 */
export const MantineResult = memo(
  forwardRef<HTMLDivElement, IAdapterResultProps>(function MantineResult(props, ref) {
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
        <h2 className="text-xl font-semibold text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)] mb-2 font-[var(--mantine-font-family)]">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[var(--mantine-color-gray-6)] dark:text-[var(--mantine-color-gray-4)] max-w-md mb-6 font-[var(--mantine-font-family)]">
            {subtitle}
          </p>
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
                  'px-4 py-2 rounded-md font-medium transition-colors font-[var(--mantine-font-family)]',
                  action.variant === 'primary' &&
                    'bg-[var(--mantine-color-blue-6)] text-white hover:bg-[var(--mantine-color-blue-7)]',
                  action.variant === 'secondary' &&
                    'bg-[var(--mantine-color-gray-1)] dark:bg-[var(--mantine-color-dark-5)] text-[var(--mantine-color-gray-7)] dark:text-[var(--mantine-color-gray-3)] hover:bg-[var(--mantine-color-gray-2)] dark:hover:bg-[var(--mantine-color-dark-4)]',
                  action.variant === 'danger' &&
                    'bg-[var(--mantine-color-red-6)] text-white hover:bg-[var(--mantine-color-red-7)]',
                  action.variant === 'link' &&
                    'text-[var(--mantine-color-blue-6)] dark:text-[var(--mantine-color-blue-4)] hover:underline',
                  !action.variant &&
                    'bg-[var(--mantine-color-gray-1)] dark:bg-[var(--mantine-color-dark-5)] text-[var(--mantine-color-gray-7)] dark:text-[var(--mantine-color-gray-3)] hover:bg-[var(--mantine-color-gray-2)] dark:hover:bg-[var(--mantine-color-dark-4)]'
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

MantineResult.displayName = 'MantineResult';
