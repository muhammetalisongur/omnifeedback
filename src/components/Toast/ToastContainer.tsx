/**
 * ToastContainer - Portal-based container for toast notifications
 * Renders toasts grouped by position with proper stacking
 */

import { memo, useMemo, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { FeedbackManager } from '../../core/FeedbackManager';
import { cn } from '../../utils/cn';
import { Z_INDEX, TOAST_DEFAULTS, MAX_VISIBLE } from '../../utils/constants';
import { Toast } from './Toast';
import type { ToastPosition, IFeedbackItem } from '../../core/types';

/**
 * ToastContainer props
 */
export interface IToastContainerProps {
  /** Default position for toasts without explicit position */
  position?: ToastPosition;
  /** Gap between toasts in pixels */
  gap?: number;
  /** Enable stacked/collapsed mode (staircase effect) - auto-enables expandOnHover */
  stacked?: boolean;
  /** Expand stacked toasts on hover (requires stacked=true) - deprecated, always true when stacked */
  expandOnHover?: boolean;
  /** Maximum number of visible toasts per position */
  maxVisibleToasts?: number;
  /** Custom container className */
  className?: string;
  /** Custom Toast component (for adapters) */
  ToastComponent?: typeof Toast;
  /** Container element to render portal into */
  container?: Element | null;
}

/**
 * Position to CSS class mapping
 */
const positionStyles: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

/**
 * ToastContainer component
 *
 * Features:
 * - Groups toasts by position
 * - Renders via portal to document.body
 * - Proper z-index layering
 * - Reverses order for bottom positions
 * - SSR safe
 */
export const ToastContainer = memo(function ToastContainer({
  position = 'top-right',
  gap = TOAST_DEFAULTS.GAP,
  stacked = false,
  expandOnHover: _expandOnHover, // Deprecated - always true when stacked
  maxVisibleToasts = MAX_VISIBLE.TOAST,
  className,
  ToastComponent = Toast,
  container,
}: IToastContainerProps) {
  // Hover state for stack behavior - always enabled when stacked
  const [hoveredPosition, setHoveredPosition] = useState<ToastPosition | null>(null);

  // Track first toast height per position for card-stack overlap calculation
  const stackHeightsRef = useRef<Record<string, number>>({});
  const [, setHeightTick] = useState(0);

  // Get toasts from store
  const toasts = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'toast'> =>
        item.type === 'toast' && item.status !== 'removed'
    )
  );

  // Group toasts by position
  const groupedToasts = useMemo(() => {
    const groups: Record<ToastPosition, IFeedbackItem<'toast'>[]> = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    };

    toasts.forEach((toast) => {
      const toastPosition = toast.options.position ?? position;
      groups[toastPosition].push(toast);
    });

    return groups;
  }, [toasts, position]);

  // Handle toast removal
  const handleRemove = useCallback((_id: string): void => {
    // FeedbackManager handles actual removal
    // This is called after exit animation completes
  }, []);

  // Handle dismiss request
  const handleDismissRequest = useCallback((id: string): void => {
    const manager = FeedbackManager.getInstance();
    manager.remove(id);
  }, []);

  // Don't render if no toasts
  if (toasts.length === 0) {
    return null;
  }

  // SSR check
  if (typeof document === 'undefined') {
    return null;
  }

  const portalContainer = container ?? document.body;

  return createPortal(
    <>
      {Object.entries(groupedToasts).map(([pos, positionToasts]) => {
        if (positionToasts.length === 0) {
          return null;
        }

        const isHovered = hoveredPosition === pos;
        // Enable hover detection when stacked (expandOnHover is always true when stacked)
        const shouldTrackHover = stacked;
        // Show collapsed (overlapped) when stacked and not hovering
        const isCollapsed = stacked && !isHovered;

        // Reverse so newest toast is at index 0 (closest to edge, highest z-index)
        const orderedToasts = [...positionToasts].reverse();
        // Limit visible toasts
        const visibleToasts = orderedToasts.slice(0, maxVisibleToasts);

        return (
          <div
            key={pos}
            data-position={pos}
            data-stacked={stacked}
            className={cn(
              'fixed flex flex-col',
              // Allow pointer events for the container when expandOnHover is enabled
              shouldTrackHover ? 'pointer-events-auto' : 'pointer-events-none',
              positionStyles[pos as ToastPosition],
              className
            )}
            style={{ zIndex: Z_INDEX.TOAST }}
            onMouseEnter={shouldTrackHover ? () => setHoveredPosition(pos as ToastPosition) : undefined}
            onMouseLeave={shouldTrackHover ? () => setHoveredPosition(null) : undefined}
          >
            {visibleToasts.map((toast, index) => {
              const shouldApplyStack = isCollapsed;

              // Card-stack: progressive scale and opacity for depth effect
              const scaleValue = shouldApplyStack
                ? 1 - index * TOAST_DEFAULTS.STACK_SCALE_STEP
                : 1;
              const opacityValue = shouldApplyStack
                ? 1 - index * TOAST_DEFAULTS.STACK_OPACITY_STEP
                : 1;

              // Card-stack overlap: negative margin pulls background toasts behind the front one
              // Each background toast peeks by STACK_PEEK pixels
              const firstHeight = stackHeightsRef.current[pos] ?? TOAST_DEFAULTS.STACK_FALLBACK_HEIGHT;
              const marginTop = index === 0
                ? 0
                : shouldApplyStack && firstHeight > 0
                  ? -(firstHeight - TOAST_DEFAULTS.STACK_PEEK)
                  : gap;

              // Scale origin based on position: top positions shrink upward, bottom shrink downward
              const isBottom = pos.startsWith('bottom');

              return (
                <div
                  key={toast.id}
                  ref={index === 0 && stacked ? (el: HTMLDivElement | null) => {
                    if (el) {
                      const h = el.offsetHeight;
                      if (stackHeightsRef.current[pos] !== h) {
                        stackHeightsRef.current[pos] = h;
                        setHeightTick(v => v + 1);
                      }
                    }
                  } : undefined}
                  className="transition-all duration-300 ease-out"
                  style={{
                    marginTop,
                    // Z-index: newest toast on top
                    zIndex: visibleToasts.length - index,
                    // Progressive scale and opacity (card-stack depth effect)
                    transform: `scale(${String(scaleValue)})`,
                    transformOrigin: isBottom ? 'bottom center' : 'top center',
                    opacity: opacityValue,
                  }}
                >
                  <ToastComponent
                    {...toast.options}
                    status={toast.status}
                    onRemove={() => handleRemove(toast.id)}
                    onDismissRequest={() => handleDismissRequest(toast.id)}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </>,
    portalContainer
  );
});

ToastContainer.displayName = 'ToastContainer';
