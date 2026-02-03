/**
 * CircularProgress component - SVG-based circular progress indicator
 * Supports determinate and indeterminate modes
 */

import { memo, forwardRef } from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import type { FeedbackVariant, ProgressSize } from '../../core/types';

/**
 * CircularProgress component props
 */
export interface ICircularProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Progress label */
  label?: string;
  /** Show percentage text in center */
  showPercentage?: boolean;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Indeterminate mode */
  indeterminate?: boolean;
  /** Size */
  size?: ProgressSize;
  /** Custom color */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Size configurations (width/height in pixels)
 */
const sizeConfig: Record<ProgressSize, { size: number; strokeWidth: number; fontSize: string }> = {
  sm: { size: 32, strokeWidth: 3, fontSize: 'text-xs' },
  md: { size: 48, strokeWidth: 4, fontSize: 'text-sm' },
  lg: { size: 64, strokeWidth: 5, fontSize: 'text-base' },
};

/**
 * Variant-specific stroke colors
 */
const variantStyles: Record<FeedbackVariant, string> = {
  default: 'stroke-gray-600',
  success: 'stroke-green-500',
  error: 'stroke-red-500',
  warning: 'stroke-yellow-500',
  info: 'stroke-blue-500',
};

/**
 * CircularProgress component
 * SVG-based circular progress indicator
 *
 * @example
 * ```tsx
 * // Basic circular progress
 * <CircularProgress value={50} />
 *
 * // With percentage in center
 * <CircularProgress value={75} showPercentage />
 *
 * // Indeterminate spinning
 * <CircularProgress indeterminate />
 *
 * // Large success variant
 * <CircularProgress value={100} size="lg" variant="success" />
 * ```
 */
export const CircularProgress = memo(
  forwardRef<HTMLDivElement, ICircularProgressProps>(function CircularProgress(
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
      color,
      strokeWidth: customStrokeWidth,
      className,
      style,
      testId,
    } = props;

    // Get size configuration
    const config = sizeConfig[size];
    const svgSize = config.size;
    const strokeWidth = customStrokeWidth ?? config.strokeWidth;

    // Calculate SVG values
    const radius = (svgSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayPercentage = Math.round(percentage);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Center position
    const center = svgSize / 2;

    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-col items-center', className)}
        style={style}
        data-testid={testId}
      >
        {/* SVG Progress Circle */}
        <div
          className="relative"
          style={{ width: svgSize, height: svgSize }}
        >
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label || 'Progress'}
            className={cn(indeterminate && 'animate-spin')}
            data-testid={testId ? `${testId}-svg` : undefined}
          >
            {/* Background track circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-gray-200"
              data-testid={testId ? `${testId}-track` : undefined}
            />

            {/* Progress circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className={cn(
                !color && variantStyles[variant],
                !indeterminate && 'transition-all duration-300 ease-out'
              )}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: indeterminate ? circumference * 0.75 : strokeDashoffset,
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
                ...(color && { stroke: color }),
              }}
              data-testid={testId ? `${testId}-fill` : undefined}
              data-indeterminate={indeterminate ? 'true' : undefined}
            />
          </svg>

          {/* Center percentage text */}
          {showPercentage && !indeterminate && (
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center',
                config.fontSize,
                'font-medium text-gray-700'
              )}
              data-testid={testId ? `${testId}-percentage` : undefined}
            >
              {displayPercentage}%
            </div>
          )}
        </div>

        {/* Label below */}
        {label && (
          <span
            className="mt-2 text-sm text-gray-700"
            data-testid={testId ? `${testId}-label` : undefined}
          >
            {label}
          </span>
        )}
      </div>
    );
  })
);

CircularProgress.displayName = 'CircularProgress';
