/**
 * Skeleton component exports
 * Provides skeleton loading placeholder components with compound pattern
 */

import { Skeleton as SkeletonBase } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import { SkeletonAvatar } from './SkeletonAvatar';
import { SkeletonCard } from './SkeletonCard';
import { SkeletonTable } from './SkeletonTable';

// Re-export types
export type { ISkeletonProps } from './Skeleton';
export type { ISkeletonTextProps } from './SkeletonText';
export type { ISkeletonAvatarProps } from './SkeletonAvatar';
export type { ISkeletonCardProps } from './SkeletonCard';
export type { ISkeletonTableProps } from './SkeletonTable';
export type { ISkeletonContainerProps } from './SkeletonContainer';

// Export container separately
export { SkeletonContainer } from './SkeletonContainer';

/**
 * Compound component interface
 */
interface ISkeletonCompound {
  (props: React.ComponentProps<typeof SkeletonBase>): React.ReactElement | null;
  /** Display name for debugging */
  displayName?: string;
  /** Text line skeleton */
  Text: typeof SkeletonText;
  /** Avatar/circle skeleton */
  Avatar: typeof SkeletonAvatar;
  /** Card skeleton with image, text, button */
  Card: typeof SkeletonCard;
  /** Table skeleton with header and rows */
  Table: typeof SkeletonTable;
}

/**
 * Create compound component
 */
const Skeleton = SkeletonBase as unknown as ISkeletonCompound;

// Attach sub-components
Skeleton.Text = SkeletonText;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;

export { Skeleton };
