/**
 * Sheet - Bottom sheet component with snap points and drag-to-dismiss
 * Mobile-first design with touch and mouse support
 */

import {
  memo,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import { useDrag } from '../../hooks/useDrag';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { FeedbackStatus } from '../../core/types';

/**
 * Sheet component props
 */
export interface ISheetProps {
  /** Sheet content (required) */
  content: React.ReactNode;
  /** Sheet title */
  title?: React.ReactNode;
  /** Snap points as percentages (0-100) */
  snapPoints?: number[];
  /** Default snap point index */
  defaultSnapPoint?: number;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on ESC key */
  closeOnEscape?: boolean;
  /** Show drag handle */
  showHandle?: boolean;
  /** Velocity threshold for dismiss (pixels/ms) */
  dismissVelocity?: number;
  /** Distance threshold for dismiss (percentage of height) */
  dismissThreshold?: number;
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when close requested */
  onRequestClose: () => void;
  /** Callback when snap point changes */
  onSnapPointChange?: (index: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Default snap points (50% and 90% of viewport height)
 */
const DEFAULT_SNAP_POINTS = [50, 90];

/**
 * Sheet component
 * Bottom sheet with snap points and drag-to-dismiss functionality
 *
 * @example
 * ```tsx
 * // Basic sheet
 * <Sheet
 *   title="Options"
 *   content={<OptionsList />}
 *   status="visible"
 *   onRequestClose={handleClose}
 * />
 *
 * // Sheet with custom snap points
 * <Sheet
 *   content={<FilterPanel />}
 *   snapPoints={[30, 60, 90]}
 *   defaultSnapPoint={1}
 *   status="visible"
 *   onRequestClose={handleClose}
 * />
 * ```
 */
export const Sheet = memo(
  forwardRef<HTMLDivElement, ISheetProps>(function Sheet(props, ref) {
    const {
      content,
      title,
      snapPoints = DEFAULT_SNAP_POINTS,
      defaultSnapPoint = 0,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showHandle = true,
      dismissVelocity = 0.5,
      dismissThreshold = 25,
      status,
      onRequestClose,
      onSnapPointChange,
      className,
      style,
      testId,
    } = props;

    const sheetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint);
    const [isAnimating, setIsAnimating] = useState(false);
    const [translateY, setTranslateY] = useState(100); // Start off-screen

    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    // Calculate current snap point height
    const currentSnapHeight = useMemo(() => {
      const snapValue = snapPoints[currentSnapIndex] ?? snapPoints[0] ?? 50;
      return snapValue;
    }, [snapPoints, currentSnapIndex]);

    // Focus trap
    useFocusTrap(contentRef, { enabled: status === 'visible' });

    // Scroll lock
    useScrollLock(status === 'visible' || status === 'entering');

    /**
     * Find nearest snap point for given position
     */
    const findNearestSnapPoint = useCallback(
      (position: number): number => {
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        snapPoints.forEach((point, index) => {
          const distance = Math.abs(position - point);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });

        return nearestIndex;
      },
      [snapPoints]
    );

    /**
     * Snap to specific point with animation
     */
    const snapTo = useCallback(
      (index: number) => {
        const clampedIndex = Math.max(0, Math.min(index, snapPoints.length - 1));
        setIsAnimating(true);
        setCurrentSnapIndex(clampedIndex);

        const snapValue = snapPoints[clampedIndex] ?? 50;
        setTranslateY(100 - snapValue);

        onSnapPointChange?.(clampedIndex);

        // Remove animation flag after transition
        setTimeout(() => setIsAnimating(false), 300);
      },
      [snapPoints, onSnapPointChange]
    );

    /**
     * Handle drag end - determine dismiss or snap
     */
    const handleDragEnd = useCallback(
      (offset: number, velocity: number) => {
        // Calculate current visual position as percentage
        const viewportHeight = window.innerHeight;
        const offsetPercentage = (offset / viewportHeight) * 100;
        const currentPosition = currentSnapHeight - offsetPercentage;

        // Check for dismiss (dragged down significantly or with velocity)
        if (velocity > dismissVelocity || offsetPercentage > dismissThreshold) {
          onRequestClose();
          return;
        }

        // Check for dismiss if dragged below minimum
        if (currentPosition < (snapPoints[0] ?? 50) / 2) {
          onRequestClose();
          return;
        }

        // Find nearest snap point
        const nearestIndex = findNearestSnapPoint(currentPosition);
        snapTo(nearestIndex);
      },
      [
        currentSnapHeight,
        dismissVelocity,
        dismissThreshold,
        snapPoints,
        findNearestSnapPoint,
        snapTo,
        onRequestClose,
      ]
    );

    // Drag hook
    const { dragState, dragHandlers } = useDrag({
      axis: 'y',
      enabled: isVisible && !isExiting,
      bounds: [0, window.innerHeight],
      onDragEnd: handleDragEnd,
    });

    // Calculate current translate value
    const currentTranslate = useMemo(() => {
      if (dragState.isDragging) {
        // During drag, add offset to current position
        const viewportHeight = window.innerHeight;
        const offsetPercentage = (dragState.offset / viewportHeight) * 100;
        return Math.max(0, 100 - currentSnapHeight + offsetPercentage);
      }
      return translateY;
    }, [dragState.isDragging, dragState.offset, currentSnapHeight, translateY]);

    // Handle enter animation
    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        // Small delay to trigger animation
        const raf = requestAnimationFrame(() => {
          setIsAnimating(true);
          const snapValue = snapPoints[defaultSnapPoint] ?? snapPoints[0] ?? 50;
          setTranslateY(100 - snapValue);
          setTimeout(() => setIsAnimating(false), 300);
        });
        return () => cancelAnimationFrame(raf);
      }
      return undefined;
    }, [status, snapPoints, defaultSnapPoint]);

    // Handle exit animation
    useEffect(() => {
      if (status === 'exiting') {
        setIsAnimating(true);
        setTranslateY(100);
      }
    }, [status]);

    // ESC key handler
    useEffect(() => {
      if (!closeOnEscape || !isVisible) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, isVisible, onRequestClose]);

    // Backdrop click handler
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onRequestClose();
        }
      },
      [closeOnBackdropClick, onRequestClose]
    );

    return (
      <div
        ref={ref}
        data-testid={testId}
        data-status={status}
        className="fixed inset-0 z-50"
        style={style}
      >
        {/* Backdrop */}
        <div
          data-testid={testId ? `${testId}-backdrop` : undefined}
          className={cn(
            'absolute inset-0 bg-black transition-opacity duration-300',
            isVisible && !isExiting
              ? 'opacity-50'
              : 'opacity-0 pointer-events-none'
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Sheet Panel */}
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title && testId ? `${testId}-title` : undefined}
          data-testid={testId ? `${testId}-panel` : undefined}
          className={cn(
            'fixed bottom-0 left-0 right-0',
            'bg-white dark:bg-gray-900',
            'rounded-t-2xl shadow-xl',
            'flex flex-col',
            'max-h-[95vh]',
            isAnimating && 'transition-transform duration-300 ease-out',
            className
          )}
          style={{
            transform: `translateY(${String(currentTranslate)}%)`,
          }}
        >
          {/* Drag Handle */}
          {showHandle && (
            <div
              {...dragHandlers}
              data-testid={testId ? `${testId}-handle` : undefined}
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          )}

          {/* Header */}
          {title && (
            <div
              className="px-4 pb-3 border-b border-gray-200 dark:border-gray-700"
              data-testid={testId ? `${testId}-header` : undefined}
            >
              <h2
                id={testId ? `${testId}-title` : undefined}
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center"
                data-testid={testId ? `${testId}-title-text` : undefined}
              >
                {title}
              </h2>
            </div>
          )}

          {/* Content */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            data-testid={testId ? `${testId}-content` : undefined}
          >
            {content}
          </div>
        </div>
      </div>
    );
  })
);

Sheet.displayName = 'Sheet';
