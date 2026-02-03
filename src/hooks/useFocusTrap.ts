/**
 * useFocusTrap hook - Traps focus within a container element
 * Essential for modal accessibility - prevents focus from escaping
 */

import { useEffect, type RefObject } from 'react';

/**
 * Focus trap configuration options
 */
export interface IFocusTrapOptions {
  /** Enable or disable focus trap */
  enabled?: boolean | undefined;
  /** CSS selector for initial focus element */
  initialFocus?: string | undefined;
  /** Return focus to previous element on unmount */
  returnFocus?: boolean | undefined;
}

/**
 * Selector for all focusable elements
 */
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
  ).filter((el) => {
    // Filter out hidden elements
    return el.offsetParent !== null && !el.hasAttribute('disabled');
  });
}

/**
 * useFocusTrap hook
 *
 * Traps keyboard focus within a container element.
 * When Tab is pressed on the last element, focus moves to the first.
 * When Shift+Tab is pressed on the first element, focus moves to the last.
 *
 * @param containerRef - Ref to the container element
 * @param options - Focus trap configuration
 *
 * @example
 * ```tsx
 * function Modal({ children }) {
 *   const modalRef = useRef<HTMLDivElement>(null);
 *
 *   useFocusTrap(modalRef, {
 *     enabled: isOpen,
 *     initialFocus: '[data-autofocus]',
 *   });
 *
 *   return <div ref={modalRef}>{children}</div>;
 * }
 * ```
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  options: IFocusTrapOptions = {}
): void {
  const { enabled = true, initialFocus, returnFocus = true } = options;

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;

    // Store previously focused element for return focus
    const previouslyFocused = document.activeElement as HTMLElement | null;

    /**
     * Set initial focus when trap is enabled
     */
    const setInitialFocus = (): void => {
      const focusableElements = getFocusableElements(container);

      // Try to focus element matching initialFocus selector
      if (initialFocus) {
        const target = container.querySelector<HTMLElement>(initialFocus);
        if (target) {
          target.focus();
          return;
        }
      }

      // Try to focus element with autofocus attribute
      const autofocusElement = container.querySelector<HTMLElement>('[autofocus]');
      if (autofocusElement) {
        autofocusElement.focus();
        return;
      }

      // Focus first focusable element
      const firstFocusable = focusableElements[0];
      if (firstFocusable) {
        firstFocusable.focus();
        return;
      }

      // If no focusable elements, make container focusable and focus it
      container.setAttribute('tabindex', '-1');
      container.focus();
    };

    /**
     * Handle Tab key navigation
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (focusableElements.length === 0) {
        // No focusable elements, prevent default Tab behavior
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      // Safety check - should not happen given length check above
      if (!firstElement || !lastElement) {
        return;
      }

      // Shift + Tab: moving backwards
      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === container) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: moving forwards
      else {
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    /**
     * Prevent focus from escaping container via click
     */
    const handleFocusIn = (event: FocusEvent): void => {
      if (!container.contains(event.target as Node)) {
        // Focus escaped, bring it back
        const focusableElements = getFocusableElements(container);
        const firstFocusable = focusableElements[0];
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          container.focus();
        }
      }
    };

    // Set initial focus after a small delay to ensure DOM is ready
    const rafId = requestAnimationFrame(setInitialFocus);

    // Add event listeners
    container.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      // Return focus to previously focused element
      if (returnFocus && previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [enabled, containerRef, initialFocus, returnFocus]);
}
