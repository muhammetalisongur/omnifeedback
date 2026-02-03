/**
 * Toast component - Headless toast notification
 * Supports countdown progress bar, pause on hover, and accessibility
 */

import type React from 'react';
import {
  memo,
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { cn } from '../../utils/cn';
import type { IToastOptions, FeedbackStatus, FeedbackVariant } from '../../core/types';
import {
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
  CloseIcon,
  LoadingIcon,
} from './icons';

/**
 * Toast component props
 */
export interface IToastProps extends IToastOptions {
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when dismiss animation completes */
  onRemove: () => void;
  /** Callback to request dismissal */
  onDismissRequest?: () => void;
}

/**
 * Variant to CSS class mapping
 */
const variantStyles: Record<FeedbackVariant | 'default' | 'loading', string> = {
  default: 'bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100',
  loading: 'bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
};

/**
 * Progress bar color by variant
 */
const progressColors: Record<FeedbackVariant | 'default' | 'loading', string> = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  loading: 'bg-gray-400',
};

/**
 * Icon color by variant
 */
const iconColors: Record<FeedbackVariant | 'default' | 'loading', string> = {
  default: 'text-gray-500',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  loading: 'text-gray-500',
};

/**
 * Default icons by variant
 */
function getDefaultIcon(variant: FeedbackVariant | 'default' | 'loading'): React.ReactNode {
  const iconClass = cn('w-5 h-5', iconColors[variant]);

  switch (variant) {
    case 'success':
      return <SuccessIcon className={iconClass} />;
    case 'error':
      return <ErrorIcon className={iconClass} />;
    case 'warning':
      return <WarningIcon className={iconClass} />;
    case 'info':
      return <InfoIcon className={iconClass} />;
    case 'loading':
      return <LoadingIcon className={iconClass} />;
    default:
      return null;
  }
}

/**
 * Toast notification component
 *
 * Features:
 * - Countdown progress bar with pause on hover/focus loss
 * - Multiple variants (success, error, warning, info)
 * - Custom icons and action buttons
 * - Accessible with ARIA attributes
 * - Smooth enter/exit animations
 */
export const Toast = memo(
  forwardRef<HTMLDivElement, IToastProps>(function Toast(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      duration = 5000,
      dismissible = true,
      icon,
      action,
      status,
      onDismiss,
      onRemove,
      onDismissRequest,
      // Progress bar options
      showProgress = false,
      progressPosition = 'bottom',
      progressColor,
      pauseOnHover = false,
      pauseOnFocusLoss = false,
      className,
      style,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);

    const startTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number | null>(null);
    const elapsedBeforePauseRef = useRef<number>(0);

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

    // ===== COUNTDOWN PROGRESS BAR LOGIC =====
    useEffect(() => {
      if (!showProgress || duration === 0 || status !== 'visible') {
        return undefined;
      }

      if (isPaused) {
        // Cancel animation when paused
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return undefined;
      }

      // Start/resume animation
      startTimeRef.current = performance.now();

      const animate = (timestamp: number): void => {
        const elapsed = timestamp - startTimeRef.current + elapsedBeforePauseRef.current;
        const remaining = duration - elapsed;
        const newProgress = Math.max(0, (remaining / duration) * 100);

        setProgress(newProgress);

        if (remaining > 0) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }, [showProgress, duration, status, isPaused]);

    // Save elapsed time when pausing
    useEffect(() => {
      if (isPaused && startTimeRef.current > 0) {
        elapsedBeforePauseRef.current += performance.now() - startTimeRef.current;
      }
    }, [isPaused]);

    // Pause on focus loss
    useEffect(() => {
      if (!pauseOnFocusLoss) {
        return undefined;
      }

      const handleVisibilityChange = (): void => {
        setIsPaused(document.hidden);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [pauseOnFocusLoss]);

    // Mouse enter/leave handlers for pause on hover
    const handleMouseEnter = useCallback((): void => {
      if (pauseOnHover) {
        setIsPaused(true);
      }
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback((): void => {
      if (pauseOnHover) {
        setIsPaused(false);
      }
    }, [pauseOnHover]);

    // Handle animation end
    const handleTransitionEnd = useCallback(
      (e: React.TransitionEvent): void => {
        // Only handle opacity transitions to avoid multiple calls
        if (e.propertyName === 'opacity' && status === 'exiting') {
          onRemove();
        }
      },
      [status, onRemove]
    );

    // Handle dismiss button click
    const handleDismissClick = useCallback((): void => {
      onDismiss?.();
      onDismissRequest?.();
    }, [onDismiss, onDismissRequest]);

    // Get display icon
    const displayIcon = icon ?? getDefaultIcon(variant);

    // Progress bar element
    const ProgressBar =
      showProgress && duration > 0 ? (
        <div
          className={cn(
            'absolute left-0 right-0 h-1 overflow-hidden',
            progressPosition === 'top' ? 'top-0 rounded-t-lg' : 'bottom-0 rounded-b-lg'
          )}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn(
              'h-full transition-none',
              !progressColor && progressColors[variant]
            )}
            style={{
              width: `${String(progress)}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>
      ) : null;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-testid={testId}
        data-status={status}
        onTransitionEnd={handleTransitionEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          // Base styles
          'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg',
          'pointer-events-auto max-w-sm w-full',
          // Animation
          'transition-all duration-200 ease-out',
          isVisible
            ? 'opacity-100 translate-x-0 translate-y-0'
            : 'opacity-0 translate-x-4',
          // Variant
          variantStyles[variant],
          // Overflow hidden for progress bar
          'overflow-hidden',
          className
        )}
        style={style}
      >
        {/* Progress Bar (Top) */}
        {progressPosition === 'top' && ProgressBar}

        {/* Icon */}
        {displayIcon && (
          <span className="flex-shrink-0 mt-0.5">{displayIcon}</span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-sm mb-1">{title}</p>}
          <p className="text-sm">{message}</p>

          {/* Action Button */}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-1 rounded"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismissClick}
            className="flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
            aria-label="Dismiss notification"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}

        {/* Progress Bar (Bottom) */}
        {progressPosition === 'bottom' && ProgressBar}
      </div>
    );
  })
);

Toast.displayName = 'Toast';
