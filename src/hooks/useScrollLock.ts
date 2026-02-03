/**
 * useScrollLock hook - Prevents body scrolling
 * Essential for modals to prevent background scroll
 */

import { useEffect, useRef } from 'react';

/**
 * Track active scroll locks to support nested modals
 * Only restore scroll when all locks are released
 */
let activeScrollLocks = 0;

/**
 * Original body styles to restore
 */
interface IOriginalStyles {
  overflow: string;
  position: string;
  top: string;
  width: string;
  paddingRight: string;
}

/**
 * Stored original styles
 */
let originalStyles: IOriginalStyles | null = null;
let scrollY = 0;

/**
 * Get scrollbar width
 */
function getScrollbarWidth(): number {
  // Create a temporary div to measure scrollbar width
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}

/**
 * Lock body scroll
 */
function lockScroll(): void {
  if (activeScrollLocks === 0) {
    // Store current scroll position
    scrollY = window.scrollY;

    // Store original styles
    originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
    };

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = getScrollbarWidth();

    // Apply scroll lock styles
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${String(scrollY)}px`;
    document.body.style.width = '100%';

    // Add padding to compensate for scrollbar removal
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${String(scrollbarWidth)}px`;
    }
  }

  activeScrollLocks++;
}

/**
 * Unlock body scroll
 */
function unlockScroll(): void {
  activeScrollLocks--;

  if (activeScrollLocks === 0 && originalStyles) {
    // Restore original styles
    document.body.style.overflow = originalStyles.overflow;
    document.body.style.position = originalStyles.position;
    document.body.style.top = originalStyles.top;
    document.body.style.width = originalStyles.width;
    document.body.style.paddingRight = originalStyles.paddingRight;

    // Restore scroll position
    window.scrollTo(0, scrollY);

    originalStyles = null;
    scrollY = 0;
  }
}

/**
 * useScrollLock hook
 *
 * Prevents body scrolling when enabled. Supports nested usage -
 * scroll will only be restored when all locks are released.
 *
 * @param enabled - Whether scroll lock is active
 *
 * @example
 * ```tsx
 * function Modal({ isOpen }) {
 *   useScrollLock(isOpen);
 *
 *   return isOpen ? <div>Modal Content</div> : null;
 * }
 * ```
 */
export function useScrollLock(enabled: boolean): void {
  const isLockedRef = useRef(false);

  useEffect(() => {
    // Skip on server side
    if (typeof document === 'undefined') {
      return undefined;
    }

    if (enabled && !isLockedRef.current) {
      // Lock scroll
      lockScroll();
      isLockedRef.current = true;
    } else if (!enabled && isLockedRef.current) {
      // Unlock scroll
      unlockScroll();
      isLockedRef.current = false;
    }

    return () => {
      // Cleanup: unlock if still locked
      if (isLockedRef.current) {
        unlockScroll();
        isLockedRef.current = false;
      }
    };
  }, [enabled]);
}

/**
 * Get the current number of active scroll locks
 * Useful for testing and debugging
 */
export function getActiveScrollLocks(): number {
  return activeScrollLocks;
}

/**
 * Reset scroll lock state
 * Only use for testing purposes
 */
export function resetScrollLockState(): void {
  activeScrollLocks = 0;
  originalStyles = null;
  scrollY = 0;
}
