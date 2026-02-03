/**
 * LoadingOverlay component - Full screen loading with backdrop
 * Renders via portal for proper stacking
 */

import { memo, forwardRef, useEffect } from 'react';
import type React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Loading } from './Loading';
import { Z_INDEX } from '../../utils/constants';
import type {
  FeedbackStatus,
  SpinnerType,
  LoadingSize,
} from '../../core/types';

/**
 * LoadingOverlay component props
 */
export interface ILoadingOverlayProps {
  /** Loading message */
  message?: string;
  /** Spinner type */
  spinner?: SpinnerType;
  /** Size of spinner */
  size?: LoadingSize;
  /** Current animation status */
  status: FeedbackStatus;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Blur background */
  blur?: boolean;
  /** Blur amount (CSS value) */
  blurAmount?: string;
  /** Can be cancelled */
  cancellable?: boolean;
  /** Cancel callback */
  onCancel?: () => void;
  /** Cancel button text */
  cancelText?: string;
  /** Callback when removed from DOM */
  onRemove?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * LoadingOverlay component
 * Full-screen loading indicator with backdrop and optional cancel button
 *
 * @example
 * ```tsx
 * // Basic overlay
 * <LoadingOverlay status="visible" message="Processing..." />
 *
 * // With blur and cancel
 * <LoadingOverlay
 *   status="visible"
 *   message="Uploading..."
 *   blur
 *   cancellable
 *   onCancel={() => console.log('Cancelled')}
 * />
 * ```
 */
export const LoadingOverlay = memo(
  forwardRef<HTMLDivElement, ILoadingOverlayProps>(function LoadingOverlay(
    props,
    ref
  ) {
    const {
      message,
      spinner = 'default',
      size = 'lg',
      status,
      overlayOpacity = 0.5,
      blur = false,
      blurAmount = '4px',
      cancellable = false,
      onCancel,
      cancelText = 'Cancel',
      onRemove,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    // Handle transition end for removal
    useEffect(() => {
      if (isExiting && onRemove) {
        const timer = setTimeout(() => {
          onRemove();
        }, 200); // Match transition duration
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [isExiting, onRemove]);

    // SSR safety check
    if (typeof document === 'undefined') {
      return null;
    }

    const content = (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-busy="true"
        aria-label={message || 'Loading'}
        data-testid={testId}
        data-status={status}
        className={cn(
          'fixed inset-0 flex flex-col items-center justify-center',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
          className
        )}
        style={{
          zIndex: Z_INDEX.LOADING,
          ...style,
        }}
        onTransitionEnd={(e) => {
          if (e.propertyName === 'opacity' && isExiting && onRemove) {
            onRemove();
          }
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-200"
          style={{
            opacity: overlayOpacity,
            backdropFilter: blur ? `blur(${blurAmount})` : undefined,
            WebkitBackdropFilter: blur ? `blur(${blurAmount})` : undefined,
          }}
          data-testid={testId ? `${testId}-backdrop` : undefined}
          data-blur={blur ? 'true' : undefined}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loading
            {...(message !== undefined && { message })}
            spinner={spinner}
            size={size}
            variant="white"
            status={status}
          />

          {/* Cancel Button */}
          {cancellable && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'px-4 py-2 rounded-md',
                'bg-white/10 text-white',
                'hover:bg-white/20 transition-colors',
                'text-sm font-medium',
                'focus:outline-none focus:ring-2 focus:ring-white/50'
              )}
              data-testid={testId ? `${testId}-cancel` : undefined}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    );

    return createPortal(content, document.body);
  })
);

LoadingOverlay.displayName = 'LoadingOverlay';
