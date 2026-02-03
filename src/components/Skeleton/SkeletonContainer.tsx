/**
 * SkeletonContainer - Conditional skeleton wrapper component
 * Shows fallback skeleton content when loading, actual content when loaded
 */

import { memo, type ReactNode } from 'react';
import { useFeedbackStore } from '../../core/FeedbackStore';

/**
 * Props for SkeletonContainer component
 */
export interface ISkeletonContainerProps {
  /** Skeleton ID to check for visibility */
  id: string;
  /** Fallback skeleton content to show while loading */
  fallback: ReactNode;
  /** Actual content to show when not loading */
  children: ReactNode;
}

/**
 * SkeletonContainer component
 * Conditionally renders skeleton fallback or children based on loading state
 *
 * @example
 * ```tsx
 * const { skeleton } = useFeedback();
 *
 * useEffect(() => {
 *   skeleton.show('user-data');
 *   fetchUser().finally(() => skeleton.hide('user-data'));
 * }, []);
 *
 * return (
 *   <SkeletonContainer
 *     id="user-data"
 *     fallback={<UserCardSkeleton />}
 *   >
 *     <UserCard user={user} />
 *   </SkeletonContainer>
 * );
 * ```
 */
export const SkeletonContainer = memo(function SkeletonContainer({
  id,
  fallback,
  children,
}: ISkeletonContainerProps) {
  /**
   * Check if skeleton with the given ID is visible in the store
   */
  const isVisible = useFeedbackStore((state) =>
    Array.from(state.items.values()).some(
      (item) =>
        item.type === 'skeleton' &&
        item.id === id &&
        item.status !== 'removed'
    )
  );

  return <>{isVisible ? fallback : children}</>;
});

SkeletonContainer.displayName = 'SkeletonContainer';
