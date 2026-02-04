/**
 * AntdDrawer - Ant Design adapter drawer component
 * Implements Ant Design Drawer with proper styling and behavior
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterDrawerProps } from '../types';

/**
 * Size styles for horizontal drawers following Ant Design widths
 */
const sizeStylesHorizontal = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
  xl: 'w-[480px]',
  full: 'w-screen',
};

/**
 * Size styles for vertical drawers
 */
const sizeStylesVertical = {
  sm: 'h-48',
  md: 'h-64',
  lg: 'h-96',
  xl: 'h-[480px]',
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
 * AntdDrawer component
 * Renders a drawer panel with Ant Design styling
 */
export const AntdDrawer = memo(
  forwardRef<HTMLDivElement, IAdapterDrawerProps>(function AntdDrawer(props, ref) {
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
        aria-labelledby={title ? 'antd-drawer-title' : undefined}
        data-testid={testId}
        className={cn(
          'of-antd-drawer-wrapper',
          'fixed inset-0 z-[1000]',
          'bg-black/45',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
        onClick={handleBackdropClick}
      >
        <div
          ref={drawerRef}
          className={cn(
            'of-antd-drawer',
            'fixed bg-white',
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
                <div className="of-antd-drawer-header flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2
                    id="antd-drawer-title"
                    className="of-antd-drawer-title text-base font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className="of-antd-drawer-close p-1 -mr-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      aria-label="Close drawer"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

          {/* Content */}
          <div className="of-antd-drawer-body flex-1 overflow-y-auto px-6 py-4">
            {content}
          </div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="of-antd-drawer-footer px-6 py-4 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

AntdDrawer.displayName = 'AntdDrawer';
