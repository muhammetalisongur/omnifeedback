/**
 * Skeleton - Base skeleton loading placeholder component
 * Displays animated placeholder while content is loading
 */

import { memo, forwardRef, type CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import type { SkeletonAnimation } from '../../core/types';

/**
 * Props for the Skeleton component
 */
export interface ISkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Render as circle */
  circle?: boolean;
  /** Render inline (inline-block) */
  inline?: boolean;
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Base color */
  baseColor?: string;
  /** Highlight color (for wave animation) */
  highlightColor?: string;
  /** Border radius */
  borderRadius?: string | number;
  /** Animation duration in ms */
  duration?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Number of skeleton items to render */
  count?: number;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Default skeleton colors
 */
const DEFAULT_BASE_COLOR = 'rgb(229 231 235)'; // gray-200
const DEFAULT_HIGHLIGHT_COLOR = 'rgb(243 244 246)'; // gray-100

/**
 * Skeleton component
 * Base building block for skeleton loading placeholders
 *
 * @example
 * ```tsx
 * // Basic rectangle
 * <Skeleton width={200} height={20} />
 *
 * // Circle (avatar placeholder)
 * <Skeleton width={40} height={40} circle />
 *
 * // Multiple items
 * <Skeleton count={3} height={16} />
 *
 * // Wave animation
 * <Skeleton animation="wave" />
 * ```
 */
export const Skeleton = memo(
  forwardRef<HTMLSpanElement, ISkeletonProps>(function Skeleton(props, ref) {
    const {
      width,
      height = 16,
      circle = false,
      inline = false,
      animation = 'pulse',
      baseColor = DEFAULT_BASE_COLOR,
      highlightColor = DEFAULT_HIGHLIGHT_COLOR,
      borderRadius,
      duration = 1500,
      className,
      style,
      count = 1,
      testId,
    } = props;

    /**
     * Calculate the final width
     */
    const computedWidth = width ?? (circle ? height : '100%');

    /**
     * Calculate the final border radius
     */
    const computedBorderRadius = circle ? '50%' : (borderRadius ?? 4);

    /**
     * Build CSS custom properties for animations
     */
    const cssVars = {
      '--skeleton-base': baseColor,
      '--skeleton-highlight': highlightColor,
      '--skeleton-duration': `${duration}ms`,
    } as CSSProperties;

    /**
     * Build the style object
     */
    const skeletonStyle: CSSProperties = {
      width: computedWidth,
      height,
      borderRadius: computedBorderRadius,
      backgroundColor: animation !== 'wave' ? baseColor : undefined,
      ...cssVars,
      ...style,
    };

    /**
     * Build class names
     */
    const skeletonClassName = cn(
      // Base styles
      inline ? 'inline-block align-middle' : 'block',
      // Animation classes
      animation === 'pulse' && 'animate-pulse',
      animation === 'wave' && 'skeleton-wave',
      className
    );

    /**
     * Render multiple skeleton elements if count > 1
     */
    const elements = Array.from({ length: count }, (_, index) => (
      <span
        key={index}
        ref={index === 0 ? ref : undefined}
        className={skeletonClassName}
        style={skeletonStyle}
        aria-hidden="true"
        data-testid={testId ? `${testId}-${index}` : undefined}
      />
    ));

    if (count === 1) {
      return (
        <span
          ref={ref}
          className={skeletonClassName}
          style={skeletonStyle}
          aria-hidden="true"
          data-testid={testId}
        />
      );
    }

    return (
      <span className="skeleton-group" data-testid={testId}>
        {elements}
      </span>
    );
  })
);

Skeleton.displayName = 'Skeleton';
