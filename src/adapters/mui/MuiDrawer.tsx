/**
 * MuiDrawer - Material UI adapter drawer component
 * Material Design drawer with multiple anchor positions
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterDrawerProps } from '../types';

/**
 * Size styles for different drawer sizes (horizontal)
 */
const sizeStylesHorizontal = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[400px]',
  full: 'w-screen',
};

/**
 * Size styles for different drawer sizes (vertical)
 */
const sizeStylesVertical = {
  sm: 'h-48',
  md: 'h-64',
  lg: 'h-96',
  xl: 'h-[400px]',
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
 * MuiDrawer component
 * Renders a drawer panel with Material Design styling
 */
export const MuiDrawer = memo(
  forwardRef<HTMLDivElement, IAdapterDrawerProps>(function MuiDrawer(props, ref): JSX.Element {
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
      if (!closeOnEscape) {return;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => { document.removeEventListener('keydown', handleKeyDown); };
    }, [closeOnEscape, onRequestClose]);

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent): void => {
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
        aria-labelledby={title ? 'mui-drawer-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 z-[1200]',
          'bg-black/50',
          'transition-opacity duration-225',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
        onClick={handleBackdropClick}
      >
        <div
          ref={drawerRef}
          className={cn(
            // MUI Drawer Paper
            'fixed bg-white dark:bg-gray-900',
            'shadow-2xl flex flex-col',
            'transition-transform duration-225 ease-out',
            placementStyles[placement],
            sizeStyles[size],
            isVisible && !isExiting
              ? transformStyles[placement].visible
              : transformStyles[placement].hidden,
            className
          )}
          onClick={(e): void => e.stopPropagation()}
        >
          {/* Header */}
          {header !== undefined
            ? header
            : title && (
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                  <h2
                    id="mui-drawer-title"
                    className="text-xl font-medium text-gray-900 dark:text-gray-100"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className={cn(
                        'p-2 -mr-2 rounded-full',
                        'text-gray-500 dark:text-gray-400',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'transition-colors duration-150'
                      )}
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
          <div className="flex-1 overflow-y-auto px-6 py-4">{content}</div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

MuiDrawer.displayName = 'MuiDrawer';
