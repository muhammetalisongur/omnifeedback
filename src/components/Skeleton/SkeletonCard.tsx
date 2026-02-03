/**
 * SkeletonCard - Card content skeleton placeholder
 * Displays a card skeleton with image, text and button placeholders
 */

import { memo } from 'react';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import type { SkeletonAnimation } from '../../core/types';

/**
 * Props for SkeletonCard component
 */
export interface ISkeletonCardProps {
  /** Show image placeholder at top */
  hasImage?: boolean;
  /** Height of the image placeholder */
  imageHeight?: number;
  /** Number of text lines in the body */
  lines?: number;
  /** Show a button placeholder at bottom */
  hasButton?: boolean;
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
 * SkeletonCard component
 * Renders a card skeleton with configurable sections
 *
 * @example
 * ```tsx
 * // Default card with image, text, and button
 * <SkeletonCard />
 *
 * // Card without image
 * <SkeletonCard hasImage={false} />
 *
 * // Card with more text lines
 * <SkeletonCard lines={5} imageHeight={250} />
 * ```
 */
export const SkeletonCard = memo(function SkeletonCard({
  hasImage = true,
  imageHeight = 200,
  lines = 3,
  hasButton = true,
  animation = 'pulse',
  baseColor,
  highlightColor,
  className,
  testId,
}: ISkeletonCardProps) {
  /**
   * Build optional props for child components
   */
  const optionalProps = {
    ...(baseColor !== undefined && { baseColor }),
    ...(highlightColor !== undefined && { highlightColor }),
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden ${className ?? ''}`}
      data-testid={testId}
    >
      {/* Image placeholder */}
      {hasImage && (
        <Skeleton
          height={imageHeight}
          animation={animation}
          borderRadius={0}
          {...optionalProps}
          {...(testId !== undefined && { testId: `${testId}-image` })}
        />
      )}

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <Skeleton
          height={24}
          width="70%"
          animation={animation}
          {...optionalProps}
          {...(testId !== undefined && { testId: `${testId}-title` })}
        />

        {/* Text lines */}
        <SkeletonText
          lines={lines}
          animation={animation}
          {...optionalProps}
          {...(testId !== undefined && { testId: `${testId}-text` })}
        />

        {/* Button placeholder */}
        {hasButton && (
          <Skeleton
            height={36}
            width={100}
            animation={animation}
            {...optionalProps}
            {...(testId !== undefined && { testId: `${testId}-button` })}
          />
        )}
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'Skeleton.Card';
