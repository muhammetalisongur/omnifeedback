/**
 * Positioning utility for popover-style components
 * Calculates optimal position relative to a target element
 */

import type { CSSProperties } from 'react';
import type { PopconfirmPlacement } from '../core/types';

/**
 * Position result from calculation
 */
export interface IPositionResult {
  /** Calculated position coordinates */
  position: { top: number; left: number };
  /** Final placement (may differ from preferred if flipped) */
  placement: PopconfirmPlacement;
}

/**
 * Arrow style result
 */
export interface IArrowStyles {
  /** CSS class names for positioning */
  className: string;
  /** Inline styles */
  style: CSSProperties;
}

/**
 * Base placement without start/end suffix
 */
type BasePlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Calculate optimal position for a popover element relative to a target
 *
 * @param target - Target element to position relative to
 * @param popover - Popover element to position
 * @param preferredPlacement - Desired placement
 * @param offset - Distance from target in pixels
 * @returns Calculated position and final placement
 *
 * @example
 * ```ts
 * const result = calculatePosition(
 *   buttonRef.current,
 *   popoverRef.current,
 *   'top',
 *   8
 * );
 * // result = { position: { top: 100, left: 200 }, placement: 'top' }
 * ```
 */
export function calculatePosition(
  target: HTMLElement,
  popover: HTMLElement,
  preferredPlacement: PopconfirmPlacement,
  offset: number
): IPositionResult {
  const targetRect = target.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Get base placement (without -start/-end)
  const basePlacement = preferredPlacement.split('-')[0] as BasePlacement;

  // Calculate base positions for each placement
  const positions: Record<BasePlacement, { top: number; left: number }> = {
    top: {
      top: targetRect.top - popoverRect.height - offset,
      left: targetRect.left + (targetRect.width - popoverRect.width) / 2,
    },
    bottom: {
      top: targetRect.bottom + offset,
      left: targetRect.left + (targetRect.width - popoverRect.width) / 2,
    },
    left: {
      top: targetRect.top + (targetRect.height - popoverRect.height) / 2,
      left: targetRect.left - popoverRect.width - offset,
    },
    right: {
      top: targetRect.top + (targetRect.height - popoverRect.height) / 2,
      left: targetRect.right + offset,
    },
  };

  let { top, left } = positions[basePlacement];
  let finalPlacement = preferredPlacement;

  // Handle start/end alignment
  if (preferredPlacement.includes('-start')) {
    if (basePlacement === 'top' || basePlacement === 'bottom') {
      left = targetRect.left;
    } else {
      top = targetRect.top;
    }
  } else if (preferredPlacement.includes('-end')) {
    if (basePlacement === 'top' || basePlacement === 'bottom') {
      left = targetRect.right - popoverRect.width;
    } else {
      top = targetRect.bottom - popoverRect.height;
    }
  }

  // Flip if outside viewport (top <-> bottom)
  if (top < 0 && basePlacement === 'top') {
    top = positions.bottom.top;
    finalPlacement = preferredPlacement.replace('top', 'bottom') as PopconfirmPlacement;
  } else if (top + popoverRect.height > viewport.height && basePlacement === 'bottom') {
    top = positions.top.top;
    finalPlacement = preferredPlacement.replace('bottom', 'top') as PopconfirmPlacement;
  }

  // Flip if outside viewport (left <-> right)
  if (left < 0 && basePlacement === 'left') {
    left = positions.right.left;
    finalPlacement = preferredPlacement.replace('left', 'right') as PopconfirmPlacement;
  } else if (left + popoverRect.width > viewport.width && basePlacement === 'right') {
    left = positions.left.left;
    finalPlacement = preferredPlacement.replace('right', 'left') as PopconfirmPlacement;
  }

  // Constrain to viewport with padding
  const padding = 8;
  top = Math.max(padding, Math.min(top, viewport.height - popoverRect.height - padding));
  left = Math.max(padding, Math.min(left, viewport.width - popoverRect.width - padding));

  return {
    position: { top, left },
    placement: finalPlacement,
  };
}

/**
 * Get arrow styles based on placement
 *
 * @param placement - Current placement of the popover
 * @returns CSS classes and styles for the arrow
 *
 * @example
 * ```tsx
 * const arrowStyles = getArrowStyles('top');
 * // Returns styles for arrow pointing down (popover is above target)
 * ```
 */
export function getArrowStyles(placement: PopconfirmPlacement): IArrowStyles {
  const base = placement.split('-')[0] as BasePlacement;

  const styles: Record<BasePlacement, IArrowStyles> = {
    top: {
      // Arrow points down (popover is above)
      className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t-0 border-l-0',
      style: { bottom: -4 },
    },
    bottom: {
      // Arrow points up (popover is below)
      className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0',
      style: { top: -4 },
    },
    left: {
      // Arrow points right (popover is to the left)
      className: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t-0 border-r-0',
      style: { right: -4 },
    },
    right: {
      // Arrow points left (popover is to the right)
      className: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b-0 border-l-0',
      style: { left: -4 },
    },
  };

  return styles[base];
}

/**
 * Get the opposite placement (for flipping)
 *
 * @param placement - Current placement
 * @returns Opposite placement
 */
export function getOppositePlacement(placement: PopconfirmPlacement): PopconfirmPlacement {
  const opposites: Record<string, string> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };

  const parts = placement.split('-');
  const base = parts[0] as string;
  const suffix = parts[1];

  const oppositeBase = opposites[base as keyof typeof opposites] || base;

  return (suffix ? `${oppositeBase}-${suffix}` : oppositeBase) as PopconfirmPlacement;
}

/**
 * Check if popover would overflow viewport at given placement
 *
 * @param targetRect - Target element bounding rect
 * @param popoverRect - Popover element bounding rect
 * @param placement - Placement to check
 * @param offset - Distance from target
 * @returns True if would overflow
 */
export function wouldOverflow(
  targetRect: DOMRect,
  popoverRect: DOMRect,
  placement: PopconfirmPlacement,
  offset: number
): boolean {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const base = placement.split('-')[0] as BasePlacement;

  switch (base) {
    case 'top':
      return targetRect.top - popoverRect.height - offset < 0;
    case 'bottom':
      return targetRect.bottom + popoverRect.height + offset > viewport.height;
    case 'left':
      return targetRect.left - popoverRect.width - offset < 0;
    case 'right':
      return targetRect.right + popoverRect.width + offset > viewport.width;
    default:
      return false;
  }
}
