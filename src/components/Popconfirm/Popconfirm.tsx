/**
 * Popconfirm component - Popover-based confirmation dialog
 * Appears near the trigger element with arrow pointer
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
import { calculatePosition, getArrowStyles } from '../../utils/positioning';
import type { FeedbackStatus, PopconfirmPlacement } from '../../core/types';

/**
 * Popconfirm component props
 */
export interface IPopconfirmProps {
  /** Target element to attach to */
  target: HTMLElement | React.RefObject<HTMLElement>;
  /** Confirmation message */
  message: string;
  /** Title (optional) */
  title?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'danger';
  /** Placement relative to target */
  placement?: PopconfirmPlacement;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Show arrow pointing to target */
  showArrow?: boolean;
  /** Offset from target (pixels) */
  offset?: number;
  /** Close when clicking outside */
  closeOnClickOutside?: boolean;
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Exclamation triangle icon for danger variant
 */
function ExclamationTriangleIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

/**
 * Question mark circle icon for default variant
 */
function QuestionMarkCircleIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
      />
    </svg>
  );
}

/**
 * Popconfirm component
 * Lightweight popover-based confirmation for inline actions
 *
 * @example
 * ```tsx
 * // Basic delete confirmation
 * <Popconfirm
 *   target={buttonRef}
 *   message="Delete this item?"
 *   placement="top"
 *   status="visible"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 *
 * // Danger variant
 * <Popconfirm
 *   target={deleteButton}
 *   message="This action cannot be undone!"
 *   confirmVariant="danger"
 *   confirmText="Delete"
 *   status="visible"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export const Popconfirm = memo(
  forwardRef<HTMLDivElement, IPopconfirmProps>(function Popconfirm(props, ref) {
    const {
      target,
      message,
      title,
      confirmText = 'Yes',
      cancelText = 'No',
      confirmVariant = 'primary',
      placement = 'top',
      icon,
      showArrow = true,
      offset = 8,
      closeOnClickOutside = true,
      status,
      onConfirm,
      onCancel,
      className,
      style,
      testId,
    } = props;

    const popconfirmRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [actualPlacement, setActualPlacement] = useState(placement);
    const [isVisible, setIsVisible] = useState(false);
    const [isPositioned, setIsPositioned] = useState(false);

    /**
     * Get target element from HTMLElement or RefObject
     */
    const getTargetElement = useCallback((): HTMLElement | null => {
      if ('current' in target) {return target.current;}
      return target;
    }, [target]);

    /**
     * Calculate and update position
     */
    useEffect(() => {
      const targetEl = getTargetElement();
      if (!targetEl || !popconfirmRef.current) {return undefined;}

      const updatePosition = (): void => {
        const popoverEl = popconfirmRef.current;
        if (!popoverEl) {return;}

        const result = calculatePosition(
          targetEl,
          popoverEl,
          placement,
          offset
        );
        setPosition(result.position);
        setActualPlacement(result.placement);
        setIsPositioned(true);
      };

      // Initial position calculation
      updatePosition();

      // Update on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [getTargetElement, placement, offset, status]);

    /**
     * Handle enter animation
     */
    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        const raf = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(raf);
      }
      return undefined;
    }, [status]);

    /**
     * Handle exit animation
     */
    useEffect(() => {
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    /**
     * Click outside handler
     */
    useEffect(() => {
      if (!closeOnClickOutside) {return undefined;}

      const handleClickOutside = (e: MouseEvent): void => {
        const targetEl = getTargetElement();
        if (
          popconfirmRef.current &&
          !popconfirmRef.current.contains(e.target as Node) &&
          targetEl &&
          !targetEl.contains(e.target as Node)
        ) {
          onCancel();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeOnClickOutside, getTargetElement, onCancel]);

    /**
     * ESC key handler
     */
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    // Get arrow styles based on actual placement
    const arrowStyles = getArrowStyles(actualPlacement);

    // Default icon based on variant
    const displayIcon = icon ?? (
      confirmVariant === 'danger' ? (
        <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      ) : (
        <QuestionMarkCircleIcon className="w-5 h-5 text-blue-500" />
      )
    );

    return (
      <div
        ref={(node) => {
          // Merge refs
          (popconfirmRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title && testId ? `${testId}-title` : undefined}
        aria-describedby={testId ? `${testId}-message` : undefined}
        data-testid={testId}
        data-status={status}
        data-placement={actualPlacement}
        className={cn(
          'fixed z-[10000] bg-white dark:bg-gray-800 rounded-lg shadow-lg',
          'border border-gray-200 dark:border-gray-700',
          'p-4 min-w-[200px] max-w-[300px]',
          'transition-all duration-150',
          isVisible && isPositioned ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          ...style,
        }}
      >
        {/* Arrow */}
        {showArrow && (
          <div
            data-testid={testId ? `${testId}-arrow` : undefined}
            className={cn(
              'absolute w-2 h-2 bg-white dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'transform rotate-45',
              arrowStyles.className
            )}
            style={arrowStyles.style}
          />
        )}

        {/* Content */}
        <div className="flex gap-3">
          {/* Icon */}
          {displayIcon && (
            <span
              className="flex-shrink-0 mt-0.5"
              data-testid={testId ? `${testId}-icon` : undefined}
            >
              {displayIcon}
            </span>
          )}

          <div className="flex-1">
            {/* Title */}
            {title && (
              <h3
                id={testId ? `${testId}-title` : undefined}
                className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1"
                data-testid={testId ? `${testId}-title-text` : undefined}
              >
                {title}
              </h3>
            )}

            {/* Message */}
            <p
              id={testId ? `${testId}-message` : undefined}
              className="text-sm text-gray-600 dark:text-gray-400 mb-3"
              data-testid={testId ? `${testId}-message-text` : undefined}
            >
              {message}
            </p>

            {/* Buttons */}
            <div
              className="flex gap-2 justify-end"
              data-testid={testId ? `${testId}-buttons` : undefined}
            >
              <button
                type="button"
                onClick={onCancel}
                className={cn(
                  'px-3 py-1.5 text-sm rounded',
                  'border border-gray-300 dark:border-gray-600',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'transition-colors'
                )}
                data-testid={testId ? `${testId}-cancel` : undefined}
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  'px-3 py-1.5 text-sm rounded font-medium',
                  'transition-colors',
                  confirmVariant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
                data-testid={testId ? `${testId}-confirm` : undefined}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  })
);

Popconfirm.displayName = 'Popconfirm';
