/**
 * ChakraModal - Chakra UI adapter modal component
 * Chakra UI-specific styling with focus trap and scroll lock
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterModalProps } from '../types';

/**
 * Size styles for modal (Chakra UI sizing)
 */
const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full h-full m-0 rounded-none',
};

/**
 * ChakraModal component
 * Renders a modal dialog with Chakra UI styling
 */
export const ChakraModal = memo(
  forwardRef<HTMLDivElement, IAdapterModalProps>(function ChakraModal(props, ref) {
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
        aria-labelledby={title ? 'chakra-modal-title' : undefined}
        data-testid={testId}
        className={cn(
          'chakra-modal-overlay',
          'fixed inset-0 flex p-4',
          'bg-blackAlpha-600 dark:bg-blackAlpha-700',
          'transition-opacity duration-150',
          centered ? 'items-center justify-center' : 'items-start justify-center pt-16',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 1400, backgroundColor: 'rgba(0, 0, 0, 0.48)', ...style }}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={cn(
            'chakra-modal-content',
            'relative w-full bg-white dark:bg-gray-800',
            'rounded-md shadow-xl',
            'flex flex-col',
            'transition-all duration-150',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            scrollBehavior === 'inside' && 'max-h-[85vh]',
            sizeStyles[size],
            className
          )}
          onClick={(e): void => { e.stopPropagation(); }}
        >
          {/* Header */}
          {header !== undefined
            ? header
            : title && (
                <div className="chakra-modal-header flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <h2
                    id="chakra-modal-title"
                    className="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className={cn(
                        'chakra-modal-close-btn',
                        'p-2 rounded-md',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500',
                        'transition-colors'
                      )}
                      aria-label="Close modal"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
          <div className={cn('chakra-modal-body flex-1 px-6 py-4', scrollBehavior === 'inside' && 'overflow-y-auto')}>
            {content}
          </div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="chakra-modal-footer px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 rounded-b-md">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

ChakraModal.displayName = 'ChakraModal';
