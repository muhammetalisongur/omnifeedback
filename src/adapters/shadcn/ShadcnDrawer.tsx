/**
 * ShadcnDrawer - shadcn/ui adapter drawer component
 * Styled like shadcn Sheet component
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterDrawerProps } from '../types';

/**
 * Close icon
 */
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * Size styles for horizontal placement
 */
const sizeStylesHorizontal = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[32rem]',
  full: 'w-screen',
};

/**
 * Size styles for vertical placement
 */
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
  left: 'inset-y-0 left-0 border-r',
  right: 'inset-y-0 right-0 border-l',
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
};

/**
 * Animation classes
 */
const animationClasses = {
  left: 'data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
  right: 'data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
  top: 'data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
  bottom: 'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
};

/**
 * ShadcnDrawer component
 */
export const ShadcnDrawer = memo(
  forwardRef<HTMLDivElement, IAdapterDrawerProps>(function ShadcnDrawer(props, ref) {
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
      if (!closeOnEscape) return undefined;

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
        data-state={isVisible && !isExiting ? 'open' : 'closed'}
        className={cn(
          'fixed inset-0 z-50',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
        onClick={handleBackdropClick}
      >
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-black/80',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
        />

        {/* Content */}
        <div
          ref={drawerRef}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
          className={cn(
            'fixed gap-4 bg-background p-6 shadow-lg',
            'transition-all duration-300 ease-in-out',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:duration-300 data-[state=open]:duration-500',
            placementStyles[placement],
            animationClasses[placement],
            sizeStyles[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {header !== undefined
            ? header
            : title && (
                <div className="flex flex-col space-y-2">
                  <h2
                    id="drawer-title"
                    className="text-lg font-semibold leading-none tracking-tight"
                  >
                    {title}
                  </h2>
                </div>
              )}

          {/* Close button */}
          {closable && (
            <button
              type="button"
              onClick={onRequestClose}
              className={cn(
                'absolute right-4 top-4 rounded-sm opacity-70',
                'ring-offset-background transition-opacity hover:opacity-100',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              )}
              aria-label="Close"
            >
              <CloseIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4">{content}</div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

ShadcnDrawer.displayName = 'ShadcnDrawer';
