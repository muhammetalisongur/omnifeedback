/**
 * AntdProgress - Ant Design adapter progress component
 * Implements Ant Design Progress with proper styling
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterProgressProps } from '../types';

/**
 * Variant colors following Ant Design progress colors
 */
const variantColors = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

/**
 * Track colors
 */
const trackColors = {
  default: 'bg-gray-200',
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  error: 'bg-red-100',
};

/**
 * Size styles for progress bar height following Ant Design
 */
const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

/**
 * AntdProgress component
 * Renders a progress bar with Ant Design styling
 */
export const AntdProgress = memo(
  forwardRef<HTMLDivElement, IAdapterProgressProps>(function AntdProgress(props, ref) {
    const {
      value,
      max = 100,
      label,
      showPercentage,
      variant = 'default',
      indeterminate,
      size = 'md',
      status,
      className,
      style,
      testId,
    } = props;

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const isVisible = status === 'visible' || status === 'entering';

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? 'Progress'}
        data-testid={testId}
        className={cn(
          'of-antd-progress',
          'w-full transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {(label || showPercentage) && (
          <div className="of-antd-progress-info flex justify-between mb-2 text-sm">
            {label && (
              <span className="of-antd-progress-label text-gray-700">{label}</span>
            )}
            {showPercentage && !indeterminate && (
              <span className="of-antd-progress-text text-gray-500 font-medium">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            'of-antd-progress-outer',
            'w-full rounded-full overflow-hidden',
            trackColors[variant],
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              'of-antd-progress-inner',
              'h-full rounded-full transition-all duration-300 ease-out',
              variantColors[variant],
              indeterminate && 'of-antd-progress-indeterminate'
            )}
            style={{
              width: indeterminate ? '30%' : `${percentage}%`,
              ...(indeterminate && {
                animation: 'antd-progress-indeterminate 1.5s ease-in-out infinite',
              }),
            }}
          />
        </div>
      </div>
    );
  })
);

AntdProgress.displayName = 'AntdProgress';
