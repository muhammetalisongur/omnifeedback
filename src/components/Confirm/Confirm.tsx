/**
 * Confirm component - Modal dialog for user confirmations
 * Promise-based API for easy async/await usage
 */

import {
  memo,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import { Spinner } from '../Loading/Spinner';
import { ExclamationTriangleIcon } from './icons';
import type { FeedbackStatus } from '../../core/types';

/**
 * Confirm component props
 */
export interface IConfirmProps {
  /** Confirm message (required) */
  message: string;
  /** Dialog title */
  title?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button style */
  confirmVariant?: 'primary' | 'danger';
  /** Loading state on confirm */
  confirmLoading?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Default danger icon
 */
const DefaultDangerIcon = (
  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
  </div>
);

/**
 * Default primary icon
 */
const DefaultPrimaryIcon = (
  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
    <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
  </div>
);

/**
 * Confirm component
 * Modal dialog for user confirmations with promise-based API
 *
 * @example
 * ```tsx
 * // Used internally by useConfirm hook
 * const confirmed = await confirm.show({
 *   title: 'Delete Account',
 *   message: 'Are you sure you want to delete your account?',
 *   confirmVariant: 'danger',
 * });
 *
 * if (confirmed) {
 *   // User clicked confirm
 * }
 * ```
 */
export const Confirm = memo(
  forwardRef<HTMLDivElement, IConfirmProps>(function Confirm(props, ref) {
    const {
      message,
      title,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      confirmLoading = false,
      icon,
      status,
      onConfirm,
      onCancel,
      className,
      style,
      testId,
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Store previous focus element
    useEffect(() => {
      previousFocusRef.current = document.activeElement as HTMLElement;
      return () => {
        // Restore focus on unmount
        previousFocusRef.current?.focus();
      };
    }, []);

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

    // Focus confirm button on visible
    useEffect(() => {
      if (status === 'visible' && confirmButtonRef.current) {
        confirmButtonRef.current.focus();
      }
    }, [status]);

    // Handle ESC key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) {
          e.preventDefault();
          onCancel?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel, isLoading]);

    // Handle confirm with loading state
    const handleConfirm = useCallback(async () => {
      setIsLoading(true);
      try {
        await onConfirm();
      } finally {
        setIsLoading(false);
      }
    }, [onConfirm]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(() => {
      if (!isLoading) {
        onCancel?.();
      }
    }, [onCancel, isLoading]);

    // Stop propagation on dialog click
    const handleDialogClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
      },
      []
    );

    // Determine which icon to display
    const displayIcon =
      icon !== undefined
        ? icon
        : confirmVariant === 'danger'
          ? DefaultDangerIcon
          : DefaultPrimaryIcon;

    const isExiting = status === 'exiting';
    const showLoading = isLoading || confirmLoading;

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'confirm-title' : undefined}
        aria-describedby="confirm-message"
        data-testid={testId}
        data-status={status}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
        )}
        style={{ zIndex: 10000, ...style }}
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50 backdrop-blur-sm',
            'transition-opacity duration-200',
            isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
          )}
          data-testid={testId ? `${testId}-backdrop` : undefined}
        />

        {/* Dialog */}
        <div
          className={cn(
            'relative w-full max-w-md bg-white rounded-lg shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95',
            className
          )}
          onClick={handleDialogClick}
          data-testid={testId ? `${testId}-dialog` : undefined}
        >
          {/* Icon */}
          {displayIcon && (
            <div
              className="mb-4"
              data-testid={testId ? `${testId}-icon` : undefined}
            >
              {displayIcon}
            </div>
          )}

          {/* Title */}
          {title && (
            <h2
              id="confirm-title"
              className="text-lg font-semibold text-center text-gray-900 mb-2"
              data-testid={testId ? `${testId}-title` : undefined}
            >
              {title}
            </h2>
          )}

          {/* Message */}
          <p
            id="confirm-message"
            className="text-sm text-gray-600 text-center mb-6"
            data-testid={testId ? `${testId}-message` : undefined}
          >
            {message}
          </p>

          {/* Actions */}
          <div
            className="flex gap-3"
            data-testid={testId ? `${testId}-actions` : undefined}
          >
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              disabled={showLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg text-sm font-medium',
                'border border-gray-300 text-gray-700 bg-white',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
                'transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              data-testid={testId ? `${testId}-cancel` : undefined}
            >
              {cancelText}
            </button>

            {/* Confirm Button */}
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirm}
              disabled={showLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg text-sm font-medium',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                confirmVariant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              )}
              data-testid={testId ? `${testId}-confirm` : undefined}
            >
              {showLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner type="default" className="w-4 h-4" />
                  <span>Loading...</span>
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    );
  })
);

Confirm.displayName = 'Confirm';
