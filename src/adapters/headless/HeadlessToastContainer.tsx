/**
 * HeadlessToastContainer - Container for positioning toasts
 * Pure Tailwind CSS implementation with card-deck stacking
 */

import { memo, useState, useRef, Children, isValidElement } from 'react';
import { cn } from '../../utils/cn';
import { TOAST_DEFAULTS } from '../../utils/constants';
import type { IAdapterToastContainerProps } from '../types';

/**
 * Position styles for toast container
 */
const positionStyles = {
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-0 right-0',
};

/**
 * HeadlessToastContainer component
 * Positions and stacks toast notifications with card-deck effect and expand-on-hover
 */
export const HeadlessToastContainer = memo(function HeadlessToastContainer({
  position,
  gap,
  stacked = false,
  expandOnHover = false,
  children,
}: IAdapterToastContainerProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  // Enable hover detection only when both stacked and expandOnHover are true
  const shouldTrackHover = stacked && expandOnHover;
  // Show collapsed (card-deck) when stacked and not hovering (or expandOnHover disabled)
  const isCollapsed = stacked && (!expandOnHover || !isHovered);
  const childCount = Children.count(children);

  // Track first toast height for card-stack overlap calculation
  const firstHeightRef = useRef<number>(0);
  const [, setHeightTick] = useState(0);

  const isBottom = position.includes('bottom');

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col p-4',
        // Allow pointer events when expandOnHover is enabled
        shouldTrackHover ? 'pointer-events-auto' : 'pointer-events-none',
        positionStyles[position],
        isBottom && 'flex-col-reverse'
      )}
      aria-live="polite"
      aria-label="Notifications"
      data-stacked={stacked}
      data-expand-on-hover={expandOnHover}
      onMouseEnter={shouldTrackHover ? () => setIsHovered(true) : undefined}
      onMouseLeave={shouldTrackHover ? () => setIsHovered(false) : undefined}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) { return child; }

        // Card-deck effect: progressive scale and opacity reduction
        const scaleValue = isCollapsed
          ? 1 - index * TOAST_DEFAULTS.STACK_SCALE_STEP
          : 1;
        const opacityValue = isCollapsed
          ? 1 - index * TOAST_DEFAULTS.STACK_OPACITY_STEP
          : 1;

        // Card-stack overlap: negative margin pulls background toasts behind the front one
        const firstHeight = firstHeightRef.current || TOAST_DEFAULTS.STACK_FALLBACK_HEIGHT;
        const overlapMargin = isCollapsed && index > 0 && firstHeight > 0
          ? -(firstHeight - TOAST_DEFAULTS.STACK_PEEK)
          : 0;
        const normalMargin = index > 0 ? gap : 0;
        const margin = isCollapsed ? overlapMargin : normalMargin;

        // Ref callback for the first toast to measure its height
        const refCallback = index === 0 && stacked
          ? (el: HTMLDivElement | null) => {
              if (el) {
                const h = el.offsetHeight;
                if (firstHeightRef.current !== h) {
                  firstHeightRef.current = h;
                  setHeightTick(v => v + 1);
                }
              }
            }
          : undefined;

        return (
          <div
            key={index}
            ref={refCallback}
            className="transition-all duration-300 ease-out origin-top"
            style={{
              // Use marginBottom for bottom positions (flex-col-reverse), marginTop for top
              ...(isBottom
                ? { marginBottom: index > 0 ? margin : 0 }
                : { marginTop: index > 0 ? margin : 0 }),
              // Z-index: first toast on top (newest)
              zIndex: childCount - index,
              // Progressive scale and opacity (card-deck depth effect)
              transform: `scale(${String(scaleValue)})`,
              transformOrigin: isBottom ? 'bottom center' : 'top center',
              opacity: opacityValue,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
});

HeadlessToastContainer.displayName = 'HeadlessToastContainer';
