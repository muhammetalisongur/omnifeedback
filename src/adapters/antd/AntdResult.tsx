/**
 * AntdResult - Ant Design adapter result page component
 * Implements Ant Design Result with proper status icons and styling
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterResultProps, ResultStatus } from '../types';

/**
 * Default icons for result statuses (Ant Design style)
 */
const defaultIcons: Record<ResultStatus, React.ReactNode> = {
  success: (
    <div className="of-antd-result-icon-success w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
      <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </div>
  ),
  error: (
    <div className="of-antd-result-icon-error w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
      <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
    </div>
  ),
  info: (
    <div className="of-antd-result-icon-info w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
      <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    </div>
  ),
  warning: (
    <div className="of-antd-result-icon-warning w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
      <svg className="w-10 h-10 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    </div>
  ),
  '404': (
    <div className="of-antd-result-icon-404 text-6xl font-bold text-gray-300">404</div>
  ),
  '403': (
    <div className="of-antd-result-icon-403 text-6xl font-bold text-gray-300">403</div>
  ),
  '500': (
    <div className="of-antd-result-icon-500 text-6xl font-bold text-gray-300">500</div>
  ),
};

/**
 * AntdResult component
 * Renders a result/status page with Ant Design styling
 */
export const AntdResult = memo(
  forwardRef<HTMLDivElement, IAdapterResultProps>(function AntdResult(props, ref) {
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
          'of-antd-result',
          'flex flex-col items-center justify-center py-12 px-6 text-center',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {/* Icon */}
        {displayIcon && (
          <div className="of-antd-result-icon mb-6">{displayIcon}</div>
        )}

        {/* Title */}
        <h2 className="of-antd-result-title text-2xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="of-antd-result-subtitle text-sm text-gray-500 max-w-md mb-6">
            {subtitle}
          </p>
        )}

        {/* Extra content */}
        {extra && (
          <div className="of-antd-result-extra mb-6">{extra}</div>
        )}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="of-antd-result-actions flex flex-wrap gap-3 justify-center">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className={cn(
                  'of-antd-btn px-4 py-1.5 rounded font-medium text-sm transition-colors',
                  action.variant === 'primary' &&
                    'of-antd-btn-primary bg-blue-500 text-white hover:bg-blue-600',
                  action.variant === 'secondary' &&
                    'of-antd-btn-default border border-gray-300 text-gray-700 bg-white hover:text-blue-500 hover:border-blue-500',
                  action.variant === 'danger' &&
                    'of-antd-btn-danger bg-red-500 text-white hover:bg-red-600',
                  action.variant === 'link' &&
                    'of-antd-btn-link text-blue-500 hover:text-blue-600',
                  !action.variant &&
                    'of-antd-btn-default border border-gray-300 text-gray-700 bg-white hover:text-blue-500 hover:border-blue-500'
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

AntdResult.displayName = 'AntdResult';
