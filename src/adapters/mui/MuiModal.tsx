/**
 * MuiModal - Material UI adapter modal component
 * Material Design dialog with elevation and proper focus management
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterModalProps } from '../types';

/**
 * Size styles for modal (MUI dialog widths)
 */
const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full h-full m-0 rounded-none',
};

/**
 * MuiModal component
 * Renders a modal dialog with Material Design styling
 */
export const MuiModal = memo(
  forwardRef<HTMLDivElement, IAdapterModalProps>(function MuiModal(props, ref) {
    const {
      title,
      content,
      size = 'md',
      closable = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
      header,
      status,
      onRequestClose,
      centered = true,
      scrollBehavior = 'inside',
      className,
      style,
      testId,
    } = props;

    const modalRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useFocusTrap(modalRef, { enabled: isVisible });
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

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'mui-modal-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex p-4',
          // MUI Modal backdrop
          'bg-black/50',
          'transition-opacity duration-225',
          centered ? 'items-center justify-center' : 'items-start justify-center pt-20',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 1300, ...style }}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={cn(
            // MUI Paper/Dialog styling
            'relative w-full bg-white dark:bg-gray-900',
            'rounded shadow-2xl',
            'flex flex-col',
            // MUI-style transitions
            'transition-all duration-225 ease-out',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            scrollBehavior === 'inside' && 'max-h-[90vh]',
            sizeStyles[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - MUI DialogTitle */}
          {header !== undefined
            ? header
            : title && (
                <div className="flex items-center justify-between px-6 py-4">
                  <h2
                    id="mui-modal-title"
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
                      aria-label="Close modal"
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

          {/* Content - MUI DialogContent */}
          <div
            className={cn(
              'flex-1 px-6 py-2',
              scrollBehavior === 'inside' && 'overflow-y-auto',
              'text-gray-600 dark:text-gray-400'
            )}
          >
            {content}
          </div>

          {/* Footer - MUI DialogActions */}
          {footer !== undefined && footer !== null && (
            <div className="flex justify-end gap-2 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

MuiModal.displayName = 'MuiModal';
