# Design: Toast System

## Overview
Implement the toast notification system with full customization, accessibility, and multi-library adapter support.

## Goals
- Beautiful, accessible toast notifications
- Fully customizable appearance and behavior
- Support all positions on screen
- Smooth enter/exit animations
- Action buttons and custom content
- Stack multiple toasts properly
- Promise-based toast for async operations
- Work with all UI library adapters

## Toast Positions

```
┌────────────────────────────────────────────────────────┐
│  [top-left]       [top-center]        [top-right]     │
│                                                        │
│                                                        │
│                      VIEWPORT                          │
│                                                        │
│                                                        │
│  [bottom-left]   [bottom-center]    [bottom-right]    │
└────────────────────────────────────────────────────────┘
```

## Toast API

### useToast Hook Interface

```typescript
// src/hooks/useToast.ts

export interface IUseToastReturn {
  /** Show toast with full options */
  show: (options: IToastOptions) => string;
  
  /** Show success toast */
  success: (message: string, options?: Partial<IToastOptions>) => string;
  
  /** Show error toast */
  error: (message: string, options?: Partial<IToastOptions>) => string;
  
  /** Show warning toast */
  warning: (message: string, options?: Partial<IToastOptions>) => string;
  
  /** Show info toast */
  info: (message: string, options?: Partial<IToastOptions>) => string;
  
  /** Dismiss specific toast */
  dismiss: (id: string) => void;
  
  /** Dismiss all toasts */
  dismissAll: () => void;
  
  /** Promise-based toast */
  promise: <T>(
    promise: Promise<T>,
    options: IToastPromiseOptions<T>
  ) => Promise<T>;
  
  /** Update existing toast */
  update: (id: string, options: Partial<IToastOptions>) => void;
}

export interface IToastPromiseOptions<T> {
  /** Message while loading */
  loading: string;
  /** Message on success (can be function) */
  success: string | ((data: T) => string);
  /** Message on error (can be function) */
  error: string | ((error: Error) => string);
  /** Additional options */
  options?: Partial<IToastOptions>;
}
```

### Toast Options

```typescript
// From src/core/types.ts

export interface IToastOptions extends IBaseFeedbackOptions {
  /** Toast message (required) */
  message: string;
  /** Optional title */
  title?: string;
  /** Visual variant */
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  /** Duration in ms (0 = infinite) */
  duration?: number;
  /** Screen position */
  position?: ToastPosition;
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Callback when shown */
  onShow?: () => void;
  
  // ===== COUNTDOWN PROGRESS BAR =====
  /** Show countdown progress bar */
  showProgress?: boolean;
  /** Progress bar position */
  progressPosition?: 'top' | 'bottom';
  /** Custom progress bar color (defaults to variant color) */
  progressColor?: string;
  /** Pause countdown on hover */
  pauseOnHover?: boolean;
  /** Pause countdown when window loses focus */
  pauseOnFocusLoss?: boolean;

  // ===== ANIMATION =====
  /** Animation style (default: 'slide') */
  animation?: ToastAnimation;

  // ===== STYLING =====
  /** Show left border with variant color */
  showLeftBorder?: boolean;
  /** Toast theme style (default: 'colored') */
  theme?: ToastTheme;
}

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastAnimation =
  | 'slide'   // Position-based slide animation (default)
  | 'fade'    // Fade in/out only
  | 'scale'   // Scale + fade effect
  | 'bounce'  // Bounce animation
  | 'none';   // No animation

export type ToastTheme =
  | 'light'    // White background, variant color only on icon/border
  | 'dark'     // Dark background
  | 'colored'; // Variant-colored background (default)
```

## Animation Types

Toast supports multiple animation styles:

| Animation | Description |
|-----------|-------------|
| `slide` | Position-based slide animation (default) - slides from nearest edge |
| `fade` | Simple fade in/out only |
| `scale` | Scale + fade effect |
| `bounce` | Bounce animation with scale |
| `none` | No animation - instant show/hide |

### Position-Based Slide Animation
When using `animation: 'slide'` (default), the toast slides from the nearest edge:

| Position | Direction |
|----------|-----------|
| `top-right`, `bottom-right` | Slides from right |
| `top-left`, `bottom-left` | Slides from left |
| `top-center` | Slides from top |
| `bottom-center` | Slides from bottom |

## Toast Theme

| Theme | Description |
|-------|-------------|
| `colored` | Variant-colored background (default) - green for success, red for error, etc. |
| `light` | White background with variant color only on icon and border |
| `dark` | Dark background with light text |
| `auto` | Auto-detect from Tailwind `dark` class on document root, syncing with the app's theme toggle |

## Stack Behavior

Stacking is controlled at the FeedbackProvider level via `toastStacked` prop:

| Prop | Description |
|------|-------------|
| `toastStacked` | Enable collapsed card-stack mode - auto expands on hover |
| `toastMaxVisible` | Maximum number of visible toasts per position (default: 5) |

When stacked mode is enabled:
- Background toasts get progressively smaller (5% scale reduction per step) and more transparent (8% opacity reduction per step)
- Each background toast peeks 10px below the one above (card-deck effect)
- Scale origin adapts to position: top positions shrink upward, bottom positions shrink downward
- Hovering over the stack container expands all toasts to full size with normal gap

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { toast } = useFeedback();

  // Simple variants
  const handleSuccess = () => {
    toast.success('Profile updated successfully!');
  };

  const handleError = () => {
    toast.error('Failed to save changes');
  };

  // With countdown progress bar
  const handleWithProgress = () => {
    toast.success('File uploaded!', {
      showProgress: true,           // Geri sayım çubuğu göster
      progressPosition: 'bottom',   // Alt kısımda
      pauseOnHover: true,           // Hover'da duraklat
      duration: 5000,
    });
  };

  // Progress bar with pause on focus loss
  const handlePauseOnFocus = () => {
    toast.info('New notification', {
      showProgress: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,  // Sekme değişince duraklat
    });
  };

  // Full options
  const handleCustom = () => {
    toast.show({
      message: 'File uploaded successfully',
      title: 'Upload Complete',
      variant: 'success',
      duration: 5000,
      position: 'top-right',
      dismissible: true,
      showProgress: true,
      progressPosition: 'bottom',
      progressColor: '#10B981',  // Custom yeşil
      pauseOnHover: true,
      icon: <CheckCircleIcon />,
      action: {
        label: 'View File',
        onClick: () => navigate('/files'),
      },
      onDismiss: () => console.log('Toast dismissed'),
    });
  };

  // Promise toast
  const handleUpload = async () => {
    const file = await toast.promise(
      uploadFile(selectedFile),
      {
        loading: 'Uploading file...',
        success: (data) => `Uploaded ${data.name} (${data.size}KB)`,
        error: (err) => `Upload failed: ${err.message}`,
      }
    );
  };

  // Update existing toast
  const handleProgress = () => {
    const id = toast.show({ 
      message: 'Processing: 0%', 
      duration: 0 
    });
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      toast.update(id, { message: `Processing: ${progress}%` });
      
      if (progress >= 100) {
        clearInterval(interval);
        toast.update(id, { 
          message: 'Processing complete!', 
          variant: 'success',
          duration: 3000,
        });
      }
    }, 500);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success Toast</button>
      <button onClick={handleError}>Error Toast</button>
      <button onClick={handleCustom}>Custom Toast</button>
      <button onClick={handleUpload}>Promise Toast</button>
      <button onClick={handleProgress}>Progress Toast</button>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useToast.ts

import { useCallback, useContext } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import type { IToastOptions, FeedbackVariant } from '../core/types';

export function useToast(): IUseToastReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useToast must be used within FeedbackProvider');
  }

  const { manager } = context;

  const show = useCallback(
    (options: IToastOptions): string => {
      return manager.add('toast', options);
    },
    [manager]
  );

  const createVariantToast = useCallback(
    (variant: FeedbackVariant) =>
      (message: string, options?: Partial<IToastOptions>): string => {
        return show({ message, variant, ...options });
      },
    [show]
  );

  const success = useCallback(
    (message: string, options?: Partial<IToastOptions>) =>
      show({ message, variant: 'success', ...options }),
    [show]
  );

  const error = useCallback(
    (message: string, options?: Partial<IToastOptions>) =>
      show({ message, variant: 'error', ...options }),
    [show]
  );

  const warning = useCallback(
    (message: string, options?: Partial<IToastOptions>) =>
      show({ message, variant: 'warning', ...options }),
    [show]
  );

  const info = useCallback(
    (message: string, options?: Partial<IToastOptions>) =>
      show({ message, variant: 'info', ...options }),
    [show]
  );

  const dismiss = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  const dismissAll = useCallback((): void => {
    manager.removeAll('toast');
  }, [manager]);

  const update = useCallback(
    (id: string, options: Partial<IToastOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  const promise = useCallback(
    async <T>(
      promiseToResolve: Promise<T>,
      options: IToastPromiseOptions<T>
    ): Promise<T> => {
      const loadingId = show({
        message: options.loading,
        variant: 'default',
        duration: 0,
        dismissible: false,
        ...options.options,
      });

      try {
        const result = await promiseToResolve;
        dismiss(loadingId);

        const successMessage =
          typeof options.success === 'function'
            ? options.success(result)
            : options.success;

        success(successMessage, options.options);
        return result;
      } catch (err) {
        dismiss(loadingId);

        const errorMessage =
          typeof options.error === 'function'
            ? options.error(err as Error)
            : options.error;

        error(errorMessage, options.options);
        throw err;
      }
    },
    [show, dismiss, success, error]
  );

  return {
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
    update,
    promise,
  };
}
```

## Component Architecture

### Toast Component (Headless)

```typescript
// src/components/Toast/Toast.tsx

import React, { memo, forwardRef, useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '../../utils/classNames';
import type { IToastOptions, FeedbackStatus } from '../../core/types';

export interface IToastProps extends IToastOptions {
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when dismiss animation completes */
  onRemove: () => void;
}

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
    const remainingTimeRef = useRef<number>(duration);
    const animationFrameRef = useRef<number>();

    // Handle enter animation
    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        const raf = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(raf);
      }
    }, [status]);

    // Handle exit animation
    useEffect(() => {
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    // ===== COUNTDOWN PROGRESS BAR LOGIC =====
    useEffect(() => {
      if (!showProgress || duration === 0 || status !== 'visible') return;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        if (!isPaused) {
          const elapsed = timestamp - startTimeRef.current;
          const remaining = remainingTimeRef.current - elapsed;
          const newProgress = Math.max(0, (remaining / duration) * 100);
          
          setProgress(newProgress);

          if (remaining > 0) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [showProgress, duration, status, isPaused]);

    // Pause/Resume logic
    useEffect(() => {
      if (isPaused) {
        // Save remaining time when paused
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        // Reset start time when resuming
        startTimeRef.current = 0;
      }
    }, [isPaused]);

    // Pause on focus loss
    useEffect(() => {
      if (!pauseOnFocusLoss) return;

      const handleVisibilityChange = () => {
        setIsPaused(document.hidden);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [pauseOnFocusLoss]);

    // Mouse enter/leave handlers for pause on hover
    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) {
        setIsPaused(true);
      }
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) {
        setIsPaused(false);
      }
    }, [pauseOnHover]);

    // Handle animation end
    const handleAnimationEnd = useCallback(() => {
      if (status === 'exiting') {
        onRemove();
      }
    }, [status, onRemove]);

    // Handle dismiss
    const handleDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    // Variant styles
    const variantStyles: Record<string, string> = {
      default: 'bg-white border-gray-200 text-gray-900',
      success: 'bg-green-50 border-green-200 text-green-900',
      error: 'bg-red-50 border-red-200 text-red-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      info: 'bg-blue-50 border-blue-200 text-blue-900',
    };

    // Progress bar colors (matching variants)
    const progressColors: Record<string, string> = {
      default: 'bg-gray-400',
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    };

    // Default icons
    const defaultIcons: Record<string, React.ReactNode> = {
      success: <SuccessIcon className="w-5 h-5 text-green-500" />,
      error: <ErrorIcon className="w-5 h-5 text-red-500" />,
      warning: <WarningIcon className="w-5 h-5 text-yellow-500" />,
      info: <InfoIcon className="w-5 h-5 text-blue-500" />,
    };

    const displayIcon = icon ?? defaultIcons[variant];

    // Progress bar component
    const ProgressBar = showProgress && duration > 0 && (
      <div
        className={cn(
          'absolute left-0 right-0 h-1 overflow-hidden',
          progressPosition === 'top' ? 'top-0 rounded-t-lg' : 'bottom-0 rounded-b-lg'
        )}
      >
        <div
          className={cn(
            'h-full transition-none',
            progressColor ? '' : progressColors[variant]
          )}
          style={{
            width: `${progress}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>
    );

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-testid={testId}
        onTransitionEnd={handleAnimationEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          // Base styles
          'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg',
          'pointer-events-auto max-w-sm w-full',
          // Animation
          'transition-all duration-200 ease-out',
          isVisible
            ? 'opacity-100 translate-x-0'
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
          {title && (
            <p className="font-semibold text-sm mb-1">{title}</p>
          )}
          <p className="text-sm">{message}</p>

          {/* Action Button */}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
            aria-label="Dismiss"
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
```

### Toast Container

```typescript
// src/components/Toast/ToastContainer.tsx

import React, { memo, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../providers/FeedbackProvider';
import { cn } from '../../utils/classNames';
import { Z_INDEX } from '../../utils/constants';
import type { ToastPosition, IFeedbackItem } from '../../core/types';

export interface IToastContainerProps {
  /** Default position for toasts */
  position?: ToastPosition;
  /** Gap between toasts */
  gap?: number;
  /** Custom container className */
  className?: string;
}

const positionStyles: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

export const ToastContainer = memo(function ToastContainer({
  position = 'top-right',
  gap = 12,
  className,
}: IToastContainerProps) {
  const adapter = useAdapter();
  const ToastComponent = adapter.ToastComponent;

  // Get toasts from store
  const toasts = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'toast' && item.status !== 'removed'
    )
  );

  // Group toasts by position
  const groupedToasts = useMemo(() => {
    const groups: Record<ToastPosition, IFeedbackItem[]> = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    };

    toasts.forEach((toast) => {
      const toastPosition =
        (toast.options as { position?: ToastPosition }).position ?? position;
      groups[toastPosition].push(toast);
    });

    return groups;
  }, [toasts, position]);

  // Don't render if no toasts
  if (toasts.length === 0) {
    return null;
  }

  // Check for SSR
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      {Object.entries(groupedToasts).map(([pos, positionToasts]) => {
        if (positionToasts.length === 0) return null;

        const isBottom = pos.startsWith('bottom');

        return (
          <div
            key={pos}
            className={cn(
              'fixed flex flex-col pointer-events-none',
              positionStyles[pos as ToastPosition],
              className
            )}
            style={{
              zIndex: Z_INDEX.TOAST,
              gap: `${gap}px`,
              contain: 'layout',
            }}
          >
            {/* Reverse order for bottom positions */}
            {(isBottom ? [...positionToasts].reverse() : positionToasts).map(
              (toast) => (
                <ToastComponent
                  key={toast.id}
                  {...toast.options}
                  status={toast.status}
                  onRemove={() => {
                    // Handled by manager
                  }}
                />
              )
            )}
          </div>
        );
      })}
    </>,
    document.body
  );
});

ToastContainer.displayName = 'ToastContainer';
```

## Animation Strategy

### CSS Animations

```css
/* src/styles/toast-animations.css */

/* Enter animations by position */
@keyframes toast-slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-in-top {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes toast-slide-in-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Exit animations */
@keyframes toast-fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Animation classes */
.toast-enter-right {
  animation: toast-slide-in-right 200ms ease-out;
}

.toast-enter-left {
  animation: toast-slide-in-left 200ms ease-out;
}

.toast-exit {
  animation: toast-fade-out 150ms ease-in forwards;
}
```

### Animation by Position

```typescript
// src/utils/animation.ts

export function getToastEnterAnimation(position: ToastPosition): string {
  if (position.includes('right')) return 'toast-enter-right';
  if (position.includes('left')) return 'toast-enter-left';
  if (position.includes('top')) return 'toast-enter-top';
  return 'toast-enter-bottom';
}

export function getToastExitAnimation(): string {
  return 'toast-exit';
}
```

## Accessibility Requirements

### ARIA Attributes

```typescript
// Toast must have:
role="alert"
aria-live={variant === 'error' ? 'assertive' : 'polite'}
aria-atomic="true"

// Dismiss button must have:
aria-label="Dismiss notification"
```

### Keyboard Support

```typescript
// When toast has action, it should be focusable
// Tab order: Action button → Dismiss button
// Enter/Space: Activate focused button
// Escape: Dismiss toast (optional)
```

### Screen Reader Considerations

- Success/info toasts use `aria-live="polite"` (announced after current speech)
- Error toasts use `aria-live="assertive"` (announced immediately)
- Use `aria-atomic="true"` to announce entire toast content

## Testing Checklist

### Unit Tests

```typescript
describe('useToast', () => {
  it('should show toast with default options', () => {});
  it('should show success variant', () => {});
  it('should show error variant', () => {});
  it('should show warning variant', () => {});
  it('should show info variant', () => {});
  it('should dismiss specific toast', () => {});
  it('should dismiss all toasts', () => {});
  it('should update existing toast', () => {});
  it('should handle promise success', () => {});
  it('should handle promise error', () => {});
  it('should auto-dismiss after duration', () => {});
  it('should not auto-dismiss when duration is 0', () => {});
});

describe('Toast', () => {
  it('should render message', () => {});
  it('should render title when provided', () => {});
  it('should render custom icon', () => {});
  it('should render action button', () => {});
  it('should call onDismiss when dismiss clicked', () => {});
  it('should have correct ARIA attributes', () => {});
  it('should apply variant styles', () => {});
  it('should animate on enter', () => {});
  it('should animate on exit', () => {});
});

describe('ToastContainer', () => {
  it('should render in portal', () => {});
  it('should group toasts by position', () => {});
  it('should apply correct z-index', () => {});
  it('should reverse order for bottom positions', () => {});
  it('should not render when no toasts', () => {});
});
```

### Integration Tests

```typescript
describe('Toast Integration', () => {
  it('should show and auto-dismiss toast', async () => {});
  it('should stack multiple toasts', () => {});
  it('should update toast content', () => {});
  it('should handle rapid add/remove', () => {});
  it('should work with all adapters', () => {});
});
```

### E2E Tests

```typescript
describe('Toast E2E', () => {
  it('should display toast in correct position', () => {});
  it('should animate smoothly', () => {});
  it('should be accessible', () => {});
  it('should handle multiple toasts', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useToast.ts`
- [ ] Create `src/components/Toast/Toast.tsx`
- [ ] Create `src/components/Toast/ToastContainer.tsx`
- [ ] Create `src/components/Toast/index.ts`
- [ ] Add toast animations to `src/styles/animations.css`
- [ ] Create `src/components/Toast/icons.tsx` (default icons)
- [ ] Write unit tests for useToast hook
- [ ] Write unit tests for Toast component
- [ ] Write unit tests for ToastContainer
- [ ] Write integration tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Z-Index Issues
❌ **Don't:** Use arbitrary z-index values
✅ **Do:** Use centralized Z_INDEX constants from utils

### 2. Memory Leaks
❌ **Don't:** Forget to clear timers on unmount
✅ **Do:** Manager handles all timer cleanup

### 3. Animation Jank
❌ **Don't:** Animate `height` or `width`
✅ **Do:** Use `transform` and `opacity` only

### 4. Layout Shifts
❌ **Don't:** Insert toasts in document flow
✅ **Do:** Use `position: fixed` via portal

### 5. Screen Reader Issues
❌ **Don't:** Forget ARIA attributes
✅ **Do:** Always include `role="alert"` and `aria-live`

## Notes

- Toast duration of 0 means infinite (won't auto-dismiss)
- Maximum 5 visible toasts by default (configurable)
- Oldest toasts removed when max exceeded
- Exit animation completes before removal from DOM
- SSR safe - checks for `document` before portal render
