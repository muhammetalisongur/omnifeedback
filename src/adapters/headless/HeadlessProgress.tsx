/**
 * HeadlessProgress - Headless adapter progress component
 * Pure Tailwind CSS implementation with indeterminate mode support
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterProgressProps } from '../types';

/**
 * Variant colors for progress bar
 */
const variantColors = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
};

/**
 * Size styles for progress bar height
 */
const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

/**
 * HeadlessProgress component
 * Renders a progress bar with Tailwind CSS styling
 */
export const HeadlessProgress = memo(
  forwardRef<HTMLDivElement, IAdapterProgressProps>(function HeadlessProgress(props, ref): JSX.Element {
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
          'w-full transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {(label ?? showPercentage) && (
          <div className="flex justify-between mb-1 text-sm">
            {label && <span className="text-gray-700 dark:text-gray-300">{label}</span>}
            {showPercentage && !indeterminate && (
              <span className="text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>
            )}
          </div>
        )}

        <div
          className={cn(
            'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variantColors[variant],
              indeterminate && 'animate-indeterminate'
            )}
            style={{
              width: indeterminate ? '50%' : `${String(percentage)}%`,
              ...(indeterminate && {
                animation: 'indeterminate 1.5s ease-in-out infinite',
              }),
            }}
          />
        </div>
      </div>
    );
  })
);

HeadlessProgress.displayName = 'HeadlessProgress';
