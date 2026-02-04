/**
 * MantineModal - Mantine adapter modal component
 * Styled with Mantine color variables and design patterns
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
 * MantineModal component
 * Renders a modal dialog with Mantine styling
 */
export const MantineModal = memo(
  forwardRef<HTMLDivElement, IAdapterModalProps>(function MantineModal(props, ref) {
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

    useEffect((): (() => void) | undefined => {
      if (!closeOnEscape) {return undefined;}

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

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex p-4',
          'bg-[var(--mantine-color-dark-9)]/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          centered ? 'items-center justify-center' : 'items-start justify-center pt-20',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 'var(--mantine-z-index-modal)', ...style }}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={cn(
            'relative w-full bg-white dark:bg-[var(--mantine-color-dark-7)]',
            'rounded-md shadow-xl',
            'flex flex-col',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            scrollBehavior === 'inside' && 'max-h-[90vh]',
            sizeStyles[size],
            className
          )}
          onClick={(e: React.MouseEvent): void => { e.stopPropagation(); }}
        >
          {/* Header */}
          {header !== undefined
            ? header
            : title && (
                <div className="flex items-center justify-between p-4 border-b border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)]">
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)] font-[var(--mantine-font-family)]"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className="p-1 rounded hover:bg-[var(--mantine-color-gray-1)] dark:hover:bg-[var(--mantine-color-dark-5)] transition-colors"
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
            <div className="p-4 border-t border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)] bg-[var(--mantine-color-gray-0)] dark:bg-[var(--mantine-color-dark-6)] rounded-b-md">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

MantineModal.displayName = 'MantineModal';
