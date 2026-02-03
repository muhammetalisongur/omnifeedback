/**
 * LinearProgress component - Horizontal progress bar
 * Supports determinate and indeterminate modes with optional striped animation
 */

import { memo, forwardRef } from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import type { FeedbackVariant, ProgressSize } from '../../core/types';

/**
 * LinearProgress component props
 */
export interface ILinearProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Progress label */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Indeterminate mode */
  indeterminate?: boolean;
  /** Size */
  size?: ProgressSize;
  /** Enable animation */
  animated?: boolean;
  /** Show striped pattern */
  striped?: boolean;
  /** Custom color */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Size-specific track heights
 */
const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

/**
 * Variant-specific fill colors
 */
const variantStyles: Record<FeedbackVariant, string> = {
  default: 'bg-gray-600',
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

/**
 * LinearProgress component
 * Horizontal progress bar with track and fill
 *
 * @example
 * ```tsx
 * // Basic progress
 * <LinearProgress value={50} />
 *
 * // With label and percentage
 * <LinearProgress value={75} label="Uploading..." showPercentage />
 *
 * // Indeterminate loading
 * <LinearProgress indeterminate label="Loading..." />
 *
 * // Striped and animated
 * <LinearProgress value={60} striped animated />
 * ```
 */
export const LinearProgress = memo(
  forwardRef<HTMLDivElement, ILinearProgressProps>(function LinearProgress(
    props,
    ref
  ) {
    const {
      value,
      max = 100,
      label,
      showPercentage = false,
      variant = 'info',
      indeterminate = false,
      size = 'md',
      animated = false,
      striped = false,
      color,
      className,
      style,
      testId,
    } = props;

    // Calculate percentage
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayPercentage = Math.round(percentage);

    // Build fill style
    const fillStyle: React.CSSProperties = {
      width: indeterminate ? '50%' : `${percentage}%`,
      ...(color && { backgroundColor: color }),
    };

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        style={style}
        data-testid={testId}
      >
        {/* Label and percentage row */}
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-1">
            {label && (
              <span
                className="text-sm text-gray-700"
                data-testid={testId ? `${testId}-label` : undefined}
              >
                {label}
              </span>
            )}
            {showPercentage && !indeterminate && (
              <span
                className="text-sm text-gray-600"
                data-testid={testId ? `${testId}-percentage` : undefined}
              >
                {displayPercentage}%
              </span>
            )}
          </div>
        )}

        {/* Progress track */}
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Progress'}
          className={cn(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            sizeStyles[size]
          )}
          data-testid={testId ? `${testId}-track` : undefined}
        >
          {/* Progress fill */}
          <div
            className={cn(
              'h-full rounded-full',
              !color && variantStyles[variant],
              // Transition for determinate mode
              !indeterminate && 'transition-all duration-300 ease-out',
              // Indeterminate animation
              indeterminate && 'animate-indeterminate',
              // Striped pattern
              striped && 'bg-striped',
              // Animated stripes
              striped && animated && 'animate-striped'
            )}
            style={fillStyle}
            data-testid={testId ? `${testId}-fill` : undefined}
            data-indeterminate={indeterminate ? 'true' : undefined}
            data-striped={striped ? 'true' : undefined}
          />
        </div>
      </div>
    );
  })
);

LinearProgress.displayName = 'LinearProgress';
