/**
 * Loading component - Headless loading indicator
 * Displays spinner with optional message
 */

import { memo, forwardRef } from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';
import type {
  FeedbackStatus,
  SpinnerType,
  LoadingSize,
  LoadingVariant,
} from '../../core/types';

/**
 * Loading component props
 */
export interface ILoadingProps {
  /** Loading message */
  message?: string;
  /** Spinner type */
  spinner?: SpinnerType;
  /** Size of spinner */
  size?: LoadingSize;
  /** Color variant */
  variant?: LoadingVariant;
  /** Current animation status */
  status: FeedbackStatus;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Size styles for spinner
 */
const sizeStyles: Record<LoadingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

/**
 * Color variant styles
 */
const variantStyles: Record<LoadingVariant, string> = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
};

/**
 * Message size based on spinner size
 */
const messageSizeStyles: Record<LoadingSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/**
 * Loading component
 * Headless component for displaying loading state with spinner and message
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Loading status="visible" />
 *
 * // With message
 * <Loading status="visible" message="Loading data..." />
 *
 * // Different spinner type
 * <Loading status="visible" spinner="dots" />
 *
 * // Different size and variant
 * <Loading status="visible" size="lg" variant="secondary" />
 * ```
 */
export const Loading = memo(
  forwardRef<HTMLDivElement, ILoadingProps>(function Loading(props, ref) {
    const {
      message,
      spinner = 'default',
      size = 'md',
      variant = 'primary',
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-testid={testId}
        data-status={status}
        className={cn(
          'inline-flex flex-col items-center justify-center gap-3',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {/* Spinner */}
        <Spinner
          type={spinner}
          className={cn(sizeStyles[size], variantStyles[variant])}
        />

        {/* Message */}
        {message && (
          <span
            className={cn(
              messageSizeStyles[size],
              variantStyles[variant],
              'text-center'
            )}
          >
            {message}
          </span>
        )}

        {/* Screen reader text */}
        <span className="sr-only">
          Loading{message ? `: ${message}` : ''}
        </span>
      </div>
    );
  })
);

Loading.displayName = 'Loading';
