/**
 * HeadlessModal - Headless adapter modal component
 * Pure Tailwind CSS implementation with focus trap and scroll lock
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterModalProps } from '../types';

/**
 * Size styles for modal
 */
const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full h-full m-0 rounded-none',
};

/**
 * HeadlessModal component
 * Renders a modal dialog with Tailwind CSS styling
 */
export const HeadlessModal = memo(
  forwardRef<HTMLDivElement, IAdapterModalProps>(function HeadlessModal(props, ref): JSX.Element {
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
      if (!closeOnEscape) {return;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, onRequestClose]);

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent): void => {
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
        aria-labelledby={title ? 'modal-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          centered ? 'items-center justify-center' : 'items-start justify-center pt-20',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 10000, ...style }}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={cn(
            'relative w-full bg-white dark:bg-gray-900',
            'rounded-lg shadow-xl',
            'flex flex-col',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            scrollBehavior === 'inside' && 'max-h-[90vh]',
            sizeStyles[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {header !== undefined
            ? header
            : title && (
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

          {/* Content */}
          <div className={cn('flex-1 p-4', scrollBehavior === 'inside' && 'overflow-y-auto')}>
            {content}
          </div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

HeadlessModal.displayName = 'HeadlessModal';
