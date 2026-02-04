/**
 * AntdModal - Ant Design adapter modal component
 * Implements Ant Design modal dialog with proper styling and behavior
 */

import { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterModalProps } from '../types';

/**
 * Size styles following Ant Design modal widths
 */
const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full h-full m-0 rounded-none',
};

/**
 * AntdModal component
 * Renders a modal dialog with Ant Design styling
 */
export const AntdModal = memo(
  forwardRef<HTMLDivElement, IAdapterModalProps>(function AntdModal(props, ref) {
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
        aria-labelledby={title ? 'antd-modal-title' : undefined}
        data-testid={testId}
        className={cn(
          'of-antd-modal-wrapper',
          'fixed inset-0 flex p-4',
          'bg-black/45',
          'transition-opacity duration-200',
          centered ? 'items-center justify-center' : 'items-start justify-center pt-24',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 1000, ...style }}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={cn(
            'of-antd-modal',
            'relative w-full bg-white',
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
                <div className="of-antd-modal-header flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2
                    id="antd-modal-title"
                    className="of-antd-modal-title text-base font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      type="button"
                      onClick={onRequestClose}
                      className="of-antd-modal-close p-1 -mr-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      aria-label="Close modal"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

          {/* Content */}
          <div
            className={cn(
              'of-antd-modal-body flex-1 px-6 py-4',
              scrollBehavior === 'inside' && 'overflow-y-auto'
            )}
          >
            {content}
          </div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="of-antd-modal-footer px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

AntdModal.displayName = 'AntdModal';
