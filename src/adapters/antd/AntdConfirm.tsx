/**
 * AntdConfirm - Ant Design adapter confirm dialog component
 * Implements Ant Design Modal.confirm style dialog
 */

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IAdapterConfirmProps } from '../types';

/**
 * Default warning icon (Ant Design style)
 */
const WarningIcon = (): JSX.Element => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

/**
 * AntdConfirm component
 * Renders a confirmation dialog with Ant Design styling
 */
export const AntdConfirm = memo(
  forwardRef<HTMLDivElement, IAdapterConfirmProps>(function AntdConfirm(props, ref) {
    const {
      message,
      title = 'Confirm',
      confirmText = 'OK',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      icon,
      onConfirm,
      onCancel,
      status,
      className,
      style,
      testId,
    } = props;

    const [loading, setLoading] = useState(false);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useFocusTrap(dialogRef, { enabled: isVisible });
    useScrollLock(isVisible);

    useEffect((): void => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

    useEffect((): (() => void) => {
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => { document.removeEventListener('keydown', handleKeyDown); };
    }, [onCancel]);

    const handleConfirm = useCallback(async (): Promise<void> => {
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }, [onConfirm]);

    const displayIcon = icon ?? (
      <span className={confirmVariant === 'danger' ? 'text-red-500' : 'text-yellow-500'}>
        <WarningIcon />
      </span>
    );

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="antd-confirm-title"
        aria-describedby="antd-confirm-message"
        data-testid={testId}
        className={cn(
          'of-antd-confirm-wrapper',
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/45',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 1000, ...style }}
        onClick={onCancel}
      >
        <div
          ref={dialogRef}
          className={cn(
            'of-antd-confirm',
            'relative w-full max-w-md bg-white',
            'rounded-lg shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e: React.MouseEvent): void => { e.stopPropagation(); }}
        >
          <div className="of-antd-confirm-body flex gap-4">
            {displayIcon && (
              <div className="of-antd-confirm-icon flex-shrink-0">{displayIcon}</div>
            )}

            <div className="of-antd-confirm-content flex-1">
              <h3
                id="antd-confirm-title"
                className="of-antd-confirm-title text-base font-semibold text-gray-900 mb-2"
              >
                {title}
              </h3>

              <div
                id="antd-confirm-message"
                className="of-antd-confirm-message text-sm text-gray-500"
              >
                {message}
              </div>
            </div>
          </div>

          <div className="of-antd-confirm-btns flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                'of-antd-btn of-antd-btn-default',
                'px-4 py-1.5 text-sm rounded',
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
              onClick={(): void => { void handleConfirm(); }}
              disabled={loading}
              className={cn(
                'of-antd-btn',
                'px-4 py-1.5 text-sm font-medium rounded',
                'transition-colors disabled:opacity-50',
                confirmVariant === 'danger'
                  ? 'of-antd-btn-danger bg-red-500 text-white hover:bg-red-600'
                  : 'of-antd-btn-primary bg-blue-500 text-white hover:bg-blue-600'
              )}
            >
              {loading ? 'Loading...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  })
);

AntdConfirm.displayName = 'AntdConfirm';
