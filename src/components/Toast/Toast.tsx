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
import type { IToastOptions, FeedbackStatus, FeedbackVariant, ToastPosition, ToastAnimation, ToastTheme } from '../../core/types';
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
 * Variant to CSS class mapping (colored theme - default)
 */
const coloredStyles: Record<FeedbackVariant | 'default' | 'loading', string> = {
  default: 'bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
  loading: 'bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
};

/**
 * Light theme styles - white background, variant color only on icon/border
 */
const lightStyles: Record<FeedbackVariant | 'default' | 'loading', string> = {
  default: 'bg-white border-gray-200 text-gray-900',
  success: 'bg-white border-gray-200 text-gray-900',
  error: 'bg-white border-gray-200 text-gray-900',
  warning: 'bg-white border-gray-200 text-gray-900',
  info: 'bg-white border-gray-200 text-gray-900',
  loading: 'bg-white border-gray-200 text-gray-900',
};

/**
 * Dark theme styles
 */
const darkStyles: Record<FeedbackVariant | 'default' | 'loading', string> = {
  default: 'bg-gray-900 border-gray-700 text-gray-100',
  success: 'bg-gray-900 border-gray-700 text-gray-100',
  error: 'bg-gray-900 border-gray-700 text-gray-100',
  warning: 'bg-gray-900 border-gray-700 text-gray-100',
  info: 'bg-gray-900 border-gray-700 text-gray-100',
  loading: 'bg-gray-900 border-gray-700 text-gray-100',
};

/**
 * Theme-based style mapping (excludes 'auto' which resolves at runtime)
 */
const themeStyles: Record<'light' | 'dark' | 'colored', Record<FeedbackVariant | 'default' | 'loading', string>> = {
  colored: coloredStyles,
  light: lightStyles,
  dark: darkStyles,
};

/**
 * Get variant styles based on theme
 * Auto theme checks Tailwind's dark class on document root, syncing with the app's theme toggle
 */
function getVariantStyles(theme: ToastTheme, variant: FeedbackVariant | 'default' | 'loading'): string {
  const resolvedTheme = theme === 'auto'
    ? (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light')
    : theme;

  return themeStyles[resolvedTheme][variant];
}

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
 * Left border color by variant
 */
const leftBorderColors: Record<FeedbackVariant | 'default' | 'loading', string> = {
  default: 'border-l-gray-400',
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  info: 'border-l-blue-500',
  loading: 'border-l-gray-400',
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
 * Get animation classes based on position and animation type
 * Slide animation includes scale effect for smoother appearance
 */
function getAnimationClasses(
  position: ToastPosition,
  animation: ToastAnimation,
  isVisible: boolean
): string {
  // No animation — instant show/hide via opacity
  if (animation === 'none') {
    return isVisible ? 'opacity-100' : 'opacity-0';
  }

  // Fade animation — slight vertical movement for visual distinction from "none"
  if (animation === 'fade') {
    return isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-2';
  }

  // Scale animation — dramatic 75% → 100% scale change
  if (animation === 'scale') {
    return isVisible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-75';
  }

  // Bounce animation — large 50% → 100% scale, combined with ease-out-back timing
  // The cubic-bezier(0.34, 1.56, 0.64, 1) on the wrapper creates overshoot effect
  if (animation === 'bounce') {
    return isVisible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-50';
  }

  // Slide animation (default) - position-based with scale effect
  if (isVisible) {
    return 'opacity-100 translate-x-0 translate-y-0 scale-100';
  }

  // Determine slide direction based on position (with scale for smoother effect)
  if (position.includes('right')) {
    return 'opacity-0 translate-x-full scale-95';
  }
  if (position.includes('left')) {
    return 'opacity-0 -translate-x-full scale-95';
  }
  if (position.startsWith('top')) {
    return 'opacity-0 -translate-y-full scale-95';
  }
  if (position.startsWith('bottom')) {
    return 'opacity-0 translate-y-full scale-95';
  }

  // Fallback
  return 'opacity-0 translate-x-full scale-95';
}

/**
 * Get transition class based on animation type
 * Bounce uses longer duration with ease-out-back for overshoot effect
 */
function getTransitionClass(animation: ToastAnimation): string {
  if (animation === 'bounce') {
    return 'transition-all duration-500';
  }
  return 'transition-all duration-300 ease-out';
}

/**
 * Toast notification component
 *
 * Features:
 * - Countdown progress bar with pause on hover/focus loss
 * - Multiple variants (success, error, warning, info)
 * - Custom icons and action buttons
 * - Accessible with ARIA attributes
 * - Smooth enter/exit animations with position-based slide
 */
export const Toast = memo(
  forwardRef<HTMLDivElement, IToastProps>(function Toast(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      duration = 4000,
      dismissible = true,
      icon,
      action,
      status,
      onDismiss,
      onRemove,
      onDismissRequest,
      position = 'top-right',
      // Progress bar options
      showProgress = false,
      progressPosition = 'bottom',
      progressColor,
      pauseOnHover = false,
      pauseOnFocusLoss = false,
      // Animation options
      animation = 'slide',
      // Styling options
      showLeftBorder = false,
      theme = 'colored',
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

    // Stable refs for callbacks — prevents timer restart when parent re-renders
    const onDismissRequestRef = useRef(onDismissRequest);
    onDismissRequestRef.current = onDismissRequest;
    const onRemoveRef = useRef(onRemove);
    onRemoveRef.current = onRemove;

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

    // ===== COUNTDOWN TIMER (handles both progress bar visual and auto-dismiss) =====
    // This effect runs when:
    // 1. pauseOnHover is true — Toast owns the dismiss timer AND progress bar
    // 2. pauseOnHover is false BUT showProgress is true — Toast owns only the progress bar visual
    // When pauseOnHover is false AND showProgress is false, FeedbackManager handles everything.
    useEffect(() => {
      if (duration === 0 || status !== 'visible') {
        return undefined;
      }

      // Skip entirely only when manager handles dismissal AND no progress bar needed
      if (!pauseOnHover && !showProgress) {
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

        // Update progress bar visual when showProgress is enabled
        if (showProgress) {
          setProgress(Math.max(0, (remaining / duration) * 100));
        }

        if (remaining > 0) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
          // Auto-dismiss only when Toast owns the timer (pauseOnHover mode)
          if (pauseOnHover) {
            onDismissRequestRef.current?.();
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }, [duration, status, isPaused, pauseOnHover, showProgress]);

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

    // Handle animation end (use ref to avoid unnecessary re-creation)
    const handleTransitionEnd = useCallback(
      (e: React.TransitionEvent): void => {
        // Only handle opacity transitions to avoid multiple calls
        if (e.propertyName === 'opacity' && status === 'exiting') {
          onRemoveRef.current();
        }
      },
      [status]
    );

    // Handle dismiss button click
    const handleDismissClick = useCallback((): void => {
      onDismiss?.();
      onDismissRequestRef.current?.();
    }, [onDismiss]);

    // Get display icon
    const displayIcon = icon ?? getDefaultIcon(variant);

    // Progress bar element (opacity-0 at 0% to avoid sub-pixel corner artifacts)
    const ProgressBar =
      showProgress && duration > 0 ? (
        <div
          className={cn(
            'absolute left-0 right-0 h-1 overflow-hidden',
            progressPosition === 'top' ? 'top-0' : 'bottom-0',
            progress <= 0 && 'opacity-0'
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
              width: `${String(Math.max(0, progress))}%`,
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
          // Animation transition (bounce uses longer duration with overshoot timing)
          getTransitionClass(animation),
          getAnimationClasses(position, animation, isVisible),
          // Variant (theme-based)
          getVariantStyles(theme, variant),
          // Left border styling
          showLeftBorder && 'border-l-4',
          showLeftBorder && leftBorderColors[variant],
          // Overflow hidden for progress bar
          'overflow-hidden',
          // Remove border on progress bar edge to prevent visible gap in light themes
          showProgress && duration > 0 && progressPosition === 'bottom' && 'border-b-0',
          showProgress && duration > 0 && progressPosition === 'top' && 'border-t-0',
          className
        )}
        style={{
          ...style,
          // Bounce uses ease-out-back for overshoot (spring) effect
          ...(animation === 'bounce' ? { transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' } : {}),
        }}
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
            className="flex-shrink-0 p-1 rounded hover:bg-black/20 dark:hover:bg-white/20 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1"
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
