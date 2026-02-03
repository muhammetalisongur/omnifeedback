/**
 * SkeletonAvatar - Avatar/profile image skeleton placeholder
 * Displays a circular skeleton for avatar loading states
 */

import { memo } from 'react';
import { Skeleton } from './Skeleton';
import type { SkeletonAnimation, SkeletonAvatarSize } from '../../core/types';

/**
 * Props for SkeletonAvatar component
 */
export interface ISkeletonAvatarProps {
  /** Size preset or custom size in pixels */
  size?: SkeletonAvatarSize | number;
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
 * Size preset values in pixels
 */
const SIZE_MAP: Record<SkeletonAvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

/**
 * SkeletonAvatar component
 * Renders a circular skeleton placeholder for avatars
 *
 * @example
 * ```tsx
 * // Default medium size
 * <SkeletonAvatar />
 *
 * // Large size preset
 * <SkeletonAvatar size="lg" />
 *
 * // Custom pixel size
 * <SkeletonAvatar size={100} />
 * ```
 */
export const SkeletonAvatar = memo(function SkeletonAvatar({
  size = 'md',
  animation = 'pulse',
  baseColor,
  highlightColor,
  className,
  testId,
}: ISkeletonAvatarProps) {
  /**
   * Calculate the dimension based on size prop
   */
  const dimension = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <Skeleton
      width={dimension}
      height={dimension}
      circle
      animation={animation}
      {...(baseColor !== undefined && { baseColor })}
      {...(highlightColor !== undefined && { highlightColor })}
      {...(className !== undefined && { className })}
      {...(testId !== undefined && { testId })}
    />
  );
});

SkeletonAvatar.displayName = 'Skeleton.Avatar';
