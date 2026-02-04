/**
 * SkeletonText - Text line skeleton placeholder
 * Displays multiple animated lines for text content loading
 */

import { memo } from 'react';
import { Skeleton } from './Skeleton';
import type { SkeletonAnimation } from '../../core/types';

/**
 * Props for SkeletonText component
 */
export interface ISkeletonTextProps {
  /** Number of text lines */
  lines?: number;
  /** Width of the last line (percentage or px) */
  lastLineWidth?: string | number;
  /** Gap between lines in pixels */
  gap?: number;
  /** Height of each line */
  lineHeight?: number;
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Base color */
  baseColor?: string;
  /** Highlight color */
  highlightColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * SkeletonText component
 * Renders multiple skeleton lines to simulate text content
 *
 * @example
 * ```tsx
 * // Single line
 * <SkeletonText />
 *
 * // Multiple lines with shorter last line
 * <SkeletonText lines={4} lastLineWidth="60%" />
 *
 * // Custom styling
 * <SkeletonText lines={3} lineHeight={20} gap={12} />
 * ```
 */
export const SkeletonText = memo(function SkeletonText({
  lines = 1,
  lastLineWidth = '60%',
  gap = 8,
  lineHeight = 16,
  animation = 'pulse',
  baseColor,
  highlightColor,
  className,
  testId,
}: ISkeletonTextProps) {
  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap }}
      data-testid={testId}
    >
      {Array.from({ length: lines }, (_, index) => {
        const isLastLine = index === lines - 1;
        const width = isLastLine && lines > 1 ? lastLineWidth : '100%';

        return (
          <Skeleton
            key={index}
            height={lineHeight}
            width={width}
            animation={animation}
            {...(baseColor !== undefined && { baseColor })}
            {...(highlightColor !== undefined && { highlightColor })}
            {...(testId !== undefined && { testId: `${testId}-line-${String(index)}` })}
          />
        );
      })}
    </div>
  );
});

SkeletonText.displayName = 'Skeleton.Text';
