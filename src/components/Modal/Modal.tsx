/**
 * Modal component - Accessible modal dialog
 * Features focus trap, scroll lock, ESC close, and backdrop click
 */

import type React from 'react';
import {
  memo,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IModalOptions, FeedbackStatus, ModalSize } from '../../core/types';
import { CloseIcon } from '../Toast/icons';

/**
 * Modal component props
 */
export interface IModalProps extends IModalOptions {
  /** Current animation status */
  status: FeedbackStatus;
  /** Called to request modal close */
  onRequestClose: () => void;
  /** Called when exit animation completes */
  onRemove?: () => void;
}

/**
 * Size to CSS class mapping
 */
const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full w-full h-full m-0 rounded-none',
};

/**
 * Modal component
 *
 * Fully accessible modal dialog with:
 * - Focus trapping within modal
 * - Body scroll prevention
 * - ESC key to close
 * - Backdrop click to close
 * - Return focus on close
 *
 * @example
 * ```tsx
 * <Modal
 *   title="Confirmation"
 *   content={<p>Are you sure?</p>}
 *   status="visible"
 *   onRequestClose={handleClose}
 * />
 * ```
 */
export const Modal = memo(
  forwardRef<HTMLDivElement, IModalProps>(function Modal(props, ref) {
    const {
      title,
      content,
      size = 'md',
      closable = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
      header,
      preventScroll = true,
      initialFocus,
      returnFocus = true,
      centered = false,
      scrollBehavior = 'inside',
      status,
      onRequestClose,
      onRemove,
      className,
      style,
      testId,
    } = props;

    const modalPanelRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Handle enter animation
    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        const raf = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(raf);
      }
      return undefined;
    }, [status]);

    // Handle exit animation
    useEffect(() => {
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    // Focus trap - only when visible
    useFocusTrap(modalPanelRef, {
      enabled: status === 'visible',
      initialFocus,
      returnFocus,
    });

    // Scroll lock - when entering or visible
    useScrollLock(
      preventScroll && (status === 'entering' || status === 'visible')
    );

    // ESC key handler
    useEffect(() => {
      if (!closeOnEscape || status !== 'visible') {
        return undefined;
      }

      const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, onRequestClose, status]);

    // Handle animation end
    const handleTransitionEnd = useCallback(
      (event: React.TransitionEvent): void => {
        // Only handle opacity transitions to avoid multiple calls
        if (event.propertyName === 'opacity' && status === 'exiting') {
          onRemove?.();
        }
      },
      [status, onRemove]
    );

    // Backdrop click handler
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent): void => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          onRequestClose();
        }
      },
      [closeOnBackdropClick, onRequestClose]
    );

    // Close button click handler
    const handleCloseClick = useCallback((): void => {
      onRequestClose();
    }, [onRequestClose]);

    // Determine if modal is in showing state
    const isShowing = isVisible && status !== 'exiting';

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        data-testid={testId}
        data-status={status}
        className={cn(
          // Backdrop
          'fixed inset-0 flex p-4',
          centered ? 'items-center' : 'items-start pt-16',
          'justify-center',
          'bg-black/50 backdrop-blur-sm',
          // Animation
          'transition-opacity duration-200 ease-out',
          isShowing ? 'opacity-100' : 'opacity-0'
        )}
        style={{ zIndex: 10000 }}
        onClick={handleBackdropClick}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Modal Panel */}
        <div
          ref={modalPanelRef}
          className={cn(
            'relative w-full bg-white rounded-lg shadow-xl',
            'dark:bg-gray-800',
            'flex flex-col',
            // Animation
            'transition-all duration-200 ease-out',
            isShowing
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-4',
            // Size
            sizeStyles[size],
            // Scroll behavior
            scrollBehavior === 'inside' && size !== 'full' && 'max-h-[90vh]',
            className
          )}
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {header !== undefined ? (
            header
          ) : title ? (
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {title}
              </h2>
              {closable && (
                <button
                  type="button"
                  onClick={handleCloseClick}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                  aria-label="Close modal"
                >
                  <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          ) : closable ? (
            // No title but closable - show close button in corner
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={handleCloseClick}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
                aria-label="Close modal"
              >
                <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ) : null}

          {/* Content */}
          <div
            className={cn(
              'flex-1 p-4',
              scrollBehavior === 'inside' && 'overflow-y-auto'
            )}
          >
            {content}
          </div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

Modal.displayName = 'Modal';
