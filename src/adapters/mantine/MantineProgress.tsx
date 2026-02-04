/**
 * MantineProgress - Mantine adapter progress component
 * Styled with Mantine color variables and indeterminate mode support
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterProgressProps } from '../types';

/**
 * Variant colors for progress bar using Mantine colors
 */
const variantColors = {
  default: 'bg-[var(--mantine-color-blue-6)]',
  success: 'bg-[var(--mantine-color-green-6)]',
  warning: 'bg-[var(--mantine-color-yellow-5)]',
  error: 'bg-[var(--mantine-color-red-6)]',
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
 * MantineProgress component
 * Renders a progress bar with Mantine styling
 */
export const MantineProgress = memo(
  forwardRef<HTMLDivElement, IAdapterProgressProps>(function MantineProgress(props, ref) {
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
          <div className="flex justify-between mb-1 text-sm font-[var(--mantine-font-family)]">
            {label && (
              <span className="text-[var(--mantine-color-gray-7)] dark:text-[var(--mantine-color-gray-3)]">
                {label}
              </span>
            )}
            {showPercentage && !indeterminate && (
              <span className="text-[var(--mantine-color-gray-5)] dark:text-[var(--mantine-color-gray-4)]">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            'w-full bg-[var(--mantine-color-gray-2)] dark:bg-[var(--mantine-color-dark-5)] rounded-full overflow-hidden',
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

MantineProgress.displayName = 'MantineProgress';
