/**
 * ChakraProgress - Chakra UI adapter progress component
 * Chakra UI-specific styling with indeterminate mode support
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterProgressProps } from '../types';

/**
 * Variant colors for progress bar (Chakra UI color scheme)
 */
const variantColors = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  error: 'bg-red-500',
};

/**
 * Track colors (Chakra UI style)
 */
const trackColors = 'bg-gray-200 dark:bg-gray-600';

/**
 * Size styles for progress bar height (Chakra UI sizing)
 */
const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

/**
 * ChakraProgress component
 * Renders a progress bar with Chakra UI styling
 */
export const ChakraProgress = memo(
  forwardRef<HTMLDivElement, IAdapterProgressProps>(function ChakraProgress(props, ref) {
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
          'chakra-progress',
          'w-full transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {(label ?? showPercentage) && (
          <div className="chakra-progress-label flex justify-between mb-1 text-sm">
            {label && <span className="text-gray-700 dark:text-gray-200">{label}</span>}
            {showPercentage && !indeterminate && (
              <span className="text-gray-500 dark:text-gray-400 font-medium">{Math.round(percentage)}%</span>
            )}
          </div>
        )}

        <div
          className={cn(
            'chakra-progress-track',
            'w-full rounded-full overflow-hidden',
            trackColors,
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              'chakra-progress-filled',
              'h-full rounded-full transition-all duration-300 ease-out',
              variantColors[variant],
              indeterminate && 'chakra-progress-indeterminate'
            )}
            style={{
              width: indeterminate ? '50%' : `${percentage}%`,
              ...(indeterminate && {
                animation: 'chakra-progress-indeterminate 1.5s ease-in-out infinite',
              }),
            }}
          />
        </div>
      </div>
    );
  })
);

ChakraProgress.displayName = 'ChakraProgress';
