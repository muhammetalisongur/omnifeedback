/**
 * MuiProgress - Material UI adapter progress component
 * Material Design linear progress with determinate and indeterminate modes
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterProgressProps } from '../types';

/**
 * Variant colors for progress bar (MUI palette)
 */
const variantColors = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-orange-500',
  error: 'bg-red-600',
};

/**
 * Track colors
 */
const trackColors = {
  default: 'bg-blue-200 dark:bg-blue-900/50',
  success: 'bg-green-200 dark:bg-green-900/50',
  warning: 'bg-orange-200 dark:bg-orange-900/50',
  error: 'bg-red-200 dark:bg-red-900/50',
};

/**
 * Size styles for progress bar height
 */
const sizeStyles = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

/**
 * MuiProgress component
 * Renders a progress bar with Material Design styling
 */
export const MuiProgress = memo(
  forwardRef<HTMLDivElement, IAdapterProgressProps>(function MuiProgress(props, ref): JSX.Element {
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
          'w-full transition-opacity duration-225',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {(label ?? showPercentage) && (
          <div className="flex justify-between mb-2 text-sm">
            {label && (
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}
            {showPercentage && !indeterminate && (
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            'w-full rounded-full overflow-hidden',
            trackColors[variant],
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full',
              variantColors[variant],
              indeterminate
                ? 'animate-mui-indeterminate'
                : 'transition-all duration-300 ease-out'
            )}
            style={{
              width: indeterminate ? '30%' : `${String(percentage)}%`,
              ...(indeterminate && {
                animation: 'mui-indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
              }),
            }}
          />
        </div>
      </div>
    );
  })
);

MuiProgress.displayName = 'MuiProgress';
