/**
 * AntdPopconfirm - Ant Design adapter popconfirm component
 * Implements Ant Design Popconfirm with proper positioning
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterPopconfirmProps, PopconfirmPlacement } from '../types';

/**
 * Calculate popconfirm position relative to trigger
 */
function calculatePosition(
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  placement: PopconfirmPlacement
): { top: number; left: number } {
  const offset = 12;

  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top - popoverRect.height - offset,
        left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
      };
    case 'top-start':
      return {
        top: triggerRect.top - popoverRect.height - offset,
        left: triggerRect.left,
      };
    case 'top-end':
      return {
        top: triggerRect.top - popoverRect.height - offset,
        left: triggerRect.right - popoverRect.width,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
      };
    case 'bottom-start':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left,
      };
    case 'bottom-end':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.right - popoverRect.width,
      };
    case 'left':
      return {
        top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
        left: triggerRect.left - popoverRect.width - offset,
      };
    case 'left-start':
      return {
        top: triggerRect.top,
        left: triggerRect.left - popoverRect.width - offset,
      };
    case 'left-end':
      return {
        top: triggerRect.bottom - popoverRect.height,
        left: triggerRect.left - popoverRect.width - offset,
      };
    case 'right':
      return {
        top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
        left: triggerRect.right + offset,
      };
    case 'right-start':
      return {
        top: triggerRect.top,
        left: triggerRect.right + offset,
      };
    case 'right-end':
      return {
        top: triggerRect.bottom - popoverRect.height,
        left: triggerRect.right + offset,
      };
    default:
      return { top: 0, left: 0 };
  }
}

/**
 * Default warning icon (Ant Design style)
 */
const WarningIcon = () => (
  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

/**
 * AntdPopconfirm component
 * Renders a positioned confirmation popover with Ant Design styling
 */
export const AntdPopconfirm = memo(
  forwardRef<HTMLDivElement, IAdapterPopconfirmProps>(function AntdPopconfirm(props, ref) {
    const {
      message,
      title,
      confirmText = 'OK',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      icon,
      placement = 'top',
      triggerRef,
      onConfirm,
      onCancel,
      status,
      className,
      style,
      testId,
    } = props;

    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    // Calculate position
    useEffect(() => {
      if (!isVisible || !triggerRef.current || !popoverRef.current) return;

      const updatePosition = () => {
        const triggerRect = triggerRef.current!.getBoundingClientRect();
        const popoverRect = popoverRef.current!.getBoundingClientRect();
        const newPosition = calculatePosition(triggerRect, popoverRect, placement);

        // Keep within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        newPosition.left = Math.max(
          8,
          Math.min(newPosition.left, viewportWidth - popoverRect.width - 8)
        );
        newPosition.top = Math.max(
          8,
          Math.min(newPosition.top, viewportHeight - popoverRect.height - 8)
        );

        setPosition(newPosition);
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isVisible, triggerRef, placement]);

    // Focus confirm button
    useEffect(() => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

    // Handle escape key
    useEffect(() => {
      if (!isVisible) return undefined;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onCancel]);

    const handleConfirm = useCallback(async () => {
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }, [onConfirm]);

    const displayIcon = icon ?? <WarningIcon />;

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'antd-popconfirm-title' : undefined}
        aria-describedby="antd-popconfirm-message"
        data-testid={testId}
        className={cn(
          'of-antd-popconfirm-wrapper',
          'fixed z-[1050] transition-opacity duration-150',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{
          top: position.top,
          left: position.left,
          ...style,
        }}
      >
        <div
          ref={popoverRef}
          className={cn(
            'of-antd-popconfirm',
            'bg-white rounded-lg shadow-lg border border-gray-200',
            'p-3 min-w-[180px] max-w-[280px]',
            'transition-transform duration-150',
            isVisible && !isExiting ? 'scale-100' : 'scale-95',
            className
          )}
        >
          <div className="of-antd-popconfirm-inner flex gap-2">
            {displayIcon && (
              <span className="of-antd-popconfirm-icon flex-shrink-0 mt-0.5">
                {displayIcon}
              </span>
            )}

            <div className="of-antd-popconfirm-message flex-1">
              {title && (
                <h4
                  id="antd-popconfirm-title"
                  className="of-antd-popconfirm-title text-sm font-medium text-gray-900 mb-1"
                >
                  {title}
                </h4>
              )}
              <p
                id="antd-popconfirm-message"
                className="of-antd-popconfirm-description text-sm text-gray-500"
              >
                {message}
              </p>

              <div className="of-antd-popconfirm-buttons flex gap-2 justify-end mt-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className={cn(
                    'of-antd-btn of-antd-btn-sm',
                    'px-2 py-1 text-xs rounded',
                    'border border-gray-300',
                    'text-gray-700 bg-white',
                    'hover:text-blue-500 hover:border-blue-500',
                    'transition-colors disabled:opacity-50'
                  )}
                >
                  {cancelText}
                </button>

                <button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className={cn(
                    'of-antd-btn of-antd-btn-sm',
                    'px-2 py-1 text-xs font-medium rounded',
                    'transition-colors disabled:opacity-50',
                    confirmVariant === 'danger'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  )}
                >
                  {loading ? '...' : confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })
);

AntdPopconfirm.displayName = 'AntdPopconfirm';
