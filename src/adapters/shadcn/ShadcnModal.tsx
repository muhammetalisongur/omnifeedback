/**
 * ShadcnModal - shadcn/ui adapter modal component
 * Styled like shadcn Dialog component
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterModalProps } from '../types';

/**
 * Close icon component
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
 * Size styles
 */
const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full h-full',
};

/**
 * ShadcnModal component
 */
export const ShadcnModal = memo(
  forwardRef<HTMLDivElement, IAdapterModalProps>(function ShadcnModal(props, ref) {
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

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        data-testid={testId}
        data-state={isVisible && !isExiting ? 'open' : 'closed'}
        className={cn(
          'fixed inset-0 z-50',
          'transition-opacity duration-200',
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
          className={cn(
            'fixed inset-0 flex p-4',
            centered ? 'items-center justify-center' : 'items-start justify-center pt-20'
          )}
        >
          <div
            ref={modalRef}
            data-state={isVisible && !isExiting ? 'open' : 'closed'}
            className={cn(
              'relative grid w-full gap-4 border bg-background p-6 shadow-lg',
              'duration-200 sm:rounded-lg',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              scrollBehavior === 'inside' && 'max-h-[90vh] overflow-y-auto',
              sizeStyles[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {header !== undefined
              ? header
              : title && (
                  <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    <h2
                      id="modal-title"
                      className="text-lg font-semibold leading-none tracking-tight"
                    >
                      {title}
                    </h2>
                  </div>
                )}

            {/* Content */}
            <div className="text-sm text-muted-foreground">{content}</div>

            {/* Footer */}
            {footer !== undefined && footer !== null && (
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                {footer}
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
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  'disabled:pointer-events-none'
                )}
                aria-label="Close"
              >
                <CloseIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  })
);

ShadcnModal.displayName = 'ShadcnModal';
