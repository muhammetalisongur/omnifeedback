/**
 * MantineDrawer - Mantine adapter drawer component
 * Styled with Mantine color variables and multiple placement options
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterDrawerProps } from '../types';

/**
 * Size styles for different drawer sizes
 */
const sizeStylesHorizontal = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[32rem]',
  full: 'w-screen',
};

const sizeStylesVertical = {
  sm: 'h-48',
  md: 'h-64',
  lg: 'h-96',
  xl: 'h-[32rem]',
  full: 'h-screen',
};

/**
 * Placement styles
 */
const placementStyles = {
  left: 'left-0 top-0 bottom-0',
  right: 'right-0 top-0 bottom-0',
  top: 'top-0 left-0 right-0',
  bottom: 'bottom-0 left-0 right-0',
};

/**
 * Transform styles for animations
 */
const transformStyles = {
  left: { hidden: '-translate-x-full', visible: 'translate-x-0' },
  right: { hidden: 'translate-x-full', visible: 'translate-x-0' },
  top: { hidden: '-translate-y-full', visible: 'translate-y-0' },
  bottom: { hidden: 'translate-y-full', visible: 'translate-y-0' },
};

/**
 * MantineDrawer component
 * Renders a drawer panel with Mantine styling
 */
export const MantineDrawer = memo(
  forwardRef<HTMLDivElement, IAdapterDrawerProps>(function MantineDrawer(props, ref) {
    const {
      title,
      content,
      placement = 'right',
      size = 'md',
      closable = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      header,
      footer,
      status,
      onRequestClose,
      className,
      style,
      testId,
    } = props;

    const drawerRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';
    const isHorizontal = placement === 'left' || placement === 'right';

    useFocusTrap(drawerRef, { enabled: isVisible });
    useScrollLock(isVisible);

    useEffect(() => {
      if (!closeOnEscape) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, onRequestClose]);

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onRequestClose();
        }
      },
      [closeOnBackdropClick, onRequestClose]
    );

    const sizeStyles = isHorizontal ? sizeStylesHorizontal : sizeStylesVertical;

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 z-[var(--mantine-z-index-modal)]',
          'bg-[var(--mantine-color-dark-9)]/50 backdrop-blur-sm',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
        onClick={handleBackdropClick}
      >
        <div
          ref={drawerRef}
          className={cn(
            'fixed bg-white dark:bg-[var(--mantine-color-dark-7)]',
            'shadow-xl flex flex-col',
            'transition-transform duration-300 ease-out',
            placementStyles[placement],
            sizeStyles[size],
            isVisible && !isExiting
              ? transformStyles[placement].visible
              : transformStyles[placement].hidden,
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {header !== undefined
            ? header
            : title && (
                <div className="flex items-center justify-between p-4 border-b border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)]">
                  <h2
                    id="drawer-title"
                    className="text-lg font-semibold text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)] font-[var(--mantine-font-family)]"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className="p-1 rounded hover:bg-[var(--mantine-color-gray-1)] dark:hover:bg-[var(--mantine-color-dark-5)] transition-colors"
                      aria-label="Close drawer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{content}</div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="p-4 border-t border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)] bg-[var(--mantine-color-gray-0)] dark:bg-[var(--mantine-color-dark-6)]">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

MantineDrawer.displayName = 'MantineDrawer';
