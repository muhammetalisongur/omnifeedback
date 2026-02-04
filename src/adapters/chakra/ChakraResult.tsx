/**
 * ChakraResult - Chakra UI adapter result page component
 * Chakra UI-specific styling for status pages
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterResultProps, ResultStatus } from '../types';

/**
 * Default icons for result statuses (Chakra UI style)
 */
const defaultIcons: Record<ResultStatus, React.ReactNode> = {
  success: (
    <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  '404': (
    <div className="chakra-result-code text-6xl font-bold text-gray-400 dark:text-gray-500">404</div>
  ),
  '403': (
    <div className="chakra-result-code text-6xl font-bold text-gray-400 dark:text-gray-500">403</div>
  ),
  '500': (
    <div className="chakra-result-code text-6xl font-bold text-gray-400 dark:text-gray-500">500</div>
  ),
};

/**
 * ChakraResult component
 * Renders a result/status page with Chakra UI styling
 */
export const ChakraResult = memo(
  forwardRef<HTMLDivElement, IAdapterResultProps>(function ChakraResult(props, ref) {
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
          'chakra-result',
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {/* Icon */}
        {displayIcon && <div className="chakra-result-icon mb-6">{displayIcon}</div>}

        {/* Title */}
        <h2 className="chakra-result-title text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="chakra-result-subtitle text-gray-600 dark:text-gray-300 max-w-md mb-6">{subtitle}</p>
        )}

        {/* Extra content */}
        {extra && <div className="chakra-result-extra mb-6">{extra}</div>}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="chakra-result-actions flex flex-wrap gap-3 justify-center">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className={cn(
                  'chakra-btn px-4 py-2 rounded-md font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  action.variant === 'primary' &&
                    'chakra-btn-primary bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
                  action.variant === 'secondary' &&
                    'chakra-btn-secondary bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
                  action.variant === 'danger' &&
                    'chakra-btn-danger bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
                  action.variant === 'link' &&
                    'chakra-btn-link text-blue-500 dark:text-blue-400 hover:underline focus:ring-blue-500',
                  !action.variant &&
                    'chakra-btn-secondary bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500'
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

ChakraResult.displayName = 'ChakraResult';
