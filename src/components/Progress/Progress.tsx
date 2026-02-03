/**
 * Progress component - Wrapper for LinearProgress and CircularProgress
 * Automatically selects the correct component based on type prop
 */

import { memo, forwardRef } from 'react';
import type React from 'react';
import { LinearProgress } from './LinearProgress';
import { CircularProgress } from './CircularProgress';
import type { FeedbackVariant, ProgressSize, ProgressType } from '../../core/types';

/**
 * Progress component props
 */
export interface IProgressProps {
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
  /** Progress type (linear or circular) */
  type?: ProgressType;
  /** Enable animation (linear only) */
  animated?: boolean;
  /** Show striped pattern (linear only) */
  striped?: boolean;
  /** Custom color */
  color?: string;
  /** Stroke width (circular only) */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Progress component
 * Unified progress indicator that renders LinearProgress or CircularProgress
 * based on the type prop
 *
 * @example
 * ```tsx
 * // Linear progress (default)
 * <Progress value={50} label="Loading..." />
 *
 * // Circular progress
 * <Progress value={75} type="circular" showPercentage />
 *
 * // Indeterminate linear
 * <Progress indeterminate type="linear" />
 *
 * // Indeterminate circular
 * <Progress indeterminate type="circular" />
 * ```
 */
export const Progress = memo(
  forwardRef<HTMLDivElement, IProgressProps>(function Progress(props, ref) {
    const {
      type = 'linear',
      animated,
      striped,
      strokeWidth,
      ...commonProps
    } = props;

    if (type === 'circular') {
      return (
        <CircularProgress
          ref={ref}
          {...commonProps}
          {...(strokeWidth !== undefined && { strokeWidth })}
        />
      );
    }

    return (
      <LinearProgress
        ref={ref}
        {...commonProps}
        {...(animated !== undefined && { animated })}
        {...(striped !== undefined && { striped })}
      />
    );
  })
);

Progress.displayName = 'Progress';
