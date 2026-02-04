/**
 * MuiResult - Material UI adapter result page component
 * Material Design styled result/status pages
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterResultProps, ResultStatus } from '../types';

/**
 * Default icons for result statuses (MUI-style filled icons)
 */
const defaultIcons: Record<ResultStatus, React.ReactNode> = {
  success: (
    <svg className="w-20 h-20 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  error: (
    <svg className="w-20 h-20 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  info: (
    <svg className="w-20 h-20 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  warning: (
    <svg className="w-20 h-20 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  '404': (
    <div className="text-7xl font-light text-gray-400 dark:text-gray-600">404</div>
  ),
  '403': (
    <div className="text-7xl font-light text-gray-400 dark:text-gray-600">403</div>
  ),
  '500': (
    <div className="text-7xl font-light text-gray-400 dark:text-gray-600">500</div>
  ),
};

/**
 * MuiResult component
 * Renders a result/status page with Material Design styling
 */
export const MuiResult = memo(
  forwardRef<HTMLDivElement, IAdapterResultProps>(function MuiResult(props, ref) {
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
          'flex flex-col items-center justify-center py-16 px-6 text-center',
          'transition-opacity duration-225',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {/* Icon */}
        {displayIcon && <div className="mb-8">{displayIcon}</div>}

        {/* Title */}
        <h2 className="text-2xl font-normal text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mb-8">
            {subtitle}
          </p>
        )}

        {/* Extra content */}
        {extra && <div className="mb-8">{extra}</div>}

        {/* Actions - MUI Button styling */}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className={cn(
                  'px-6 py-2.5 min-w-[88px] rounded',
                  'text-sm font-medium uppercase tracking-wide',
                  'transition-all duration-150',
                  'shadow hover:shadow-md',
                  action.variant === 'primary' &&
                    'bg-blue-600 text-white hover:bg-blue-700',
                  action.variant === 'secondary' &&
                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-none',
                  action.variant === 'danger' &&
                    'bg-red-600 text-white hover:bg-red-700',
                  action.variant === 'link' &&
                    'text-blue-600 dark:text-blue-400 shadow-none hover:shadow-none hover:underline',
                  !action.variant &&
                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-none'
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

MuiResult.displayName = 'MuiResult';
