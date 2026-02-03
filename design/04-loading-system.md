# Design: Loading System

## Overview
Implement a versatile loading indicator system with inline spinners, full-screen overlays, and async operation wrappers.

## Goals
- Multiple spinner variants
- Full-screen overlay option
- Backdrop blur support
- Cancellable loading states
- Async function wrapper
- Progress integration
- Work with all UI library adapters

## Loading API

### useLoading Hook Interface

```typescript
// src/hooks/useLoading.ts

export interface IUseLoadingReturn {
  /** Show loading indicator */
  show: (options?: ILoadingOptions) => string;
  
  /** Hide specific loading indicator */
  hide: (id: string) => void;
  
  /** Hide all loading indicators */
  hideAll: () => void;
  
  /** Update loading options */
  update: (id: string, options: Partial<ILoadingOptions>) => void;
  
  /** Wrap async function with loading */
  wrap: <T>(
    fn: () => Promise<T>,
    options?: ILoadingOptions
  ) => Promise<T>;
  
  /** Check if any loading is active */
  isLoading: boolean;
  
  /** Get active loading IDs */
  activeLoadings: string[];
}
```

### Loading Options

```typescript
// From src/core/types.ts

export interface ILoadingOptions extends IBaseFeedbackOptions {
  /** Loading message */
  message?: string;
  /** Spinner type */
  spinner?: 'default' | 'dots' | 'bars' | 'ring' | 'pulse';
  /** Full screen overlay */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Blur background */
  blur?: boolean;
  /** Blur amount */
  blurAmount?: string;
  /** Can be cancelled */
  cancellable?: boolean;
  /** Cancel callback */
  onCancel?: () => void;
  /** Cancel button text */
  cancelText?: string;
  /** Size of spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'white';
}
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { loading } = useFeedback();

  // Simple loading
  const handleSimple = async () => {
    const id = loading.show();
    try {
      await doSomething();
    } finally {
      loading.hide(id);
    }
  };

  // With message
  const handleWithMessage = async () => {
    const id = loading.show({ message: 'Loading data...' });
    try {
      await fetchData();
    } finally {
      loading.hide(id);
    }
  };

  // Full screen overlay
  const handleOverlay = async () => {
    const id = loading.show({
      message: 'Processing...',
      overlay: true,
      overlayOpacity: 0.7,
      blur: true,
    });
    try {
      await processData();
    } finally {
      loading.hide(id);
    }
  };

  // Cancellable loading
  const handleCancellable = async () => {
    const abortController = new AbortController();
    
    const id = loading.show({
      message: 'Uploading file...',
      overlay: true,
      cancellable: true,
      cancelText: 'Cancel Upload',
      onCancel: () => {
        abortController.abort();
        loading.hide(id);
      },
    });

    try {
      await uploadFile({ signal: abortController.signal });
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelled');
      }
    } finally {
      loading.hide(id);
    }
  };

  // Wrap async function
  const handleWrap = async () => {
    const data = await loading.wrap(
      () => fetchUserData(),
      { message: 'Loading user data...' }
    );
    console.log('Data:', data);
  };

  // Different spinner variants
  const handleSpinners = () => {
    loading.show({ spinner: 'default' });
    loading.show({ spinner: 'dots' });
    loading.show({ spinner: 'bars' });
    loading.show({ spinner: 'ring' });
    loading.show({ spinner: 'pulse' });
  };

  // Update loading message
  const handleProgress = async () => {
    const id = loading.show({ message: 'Step 1/3: Preparing...' });
    
    await step1();
    loading.update(id, { message: 'Step 2/3: Processing...' });
    
    await step2();
    loading.update(id, { message: 'Step 3/3: Finalizing...' });
    
    await step3();
    loading.hide(id);
  };

  return (
    <div>
      <button onClick={handleSimple}>Simple Loading</button>
      <button onClick={handleWithMessage}>With Message</button>
      <button onClick={handleOverlay}>Full Overlay</button>
      <button onClick={handleCancellable}>Cancellable</button>
      <button onClick={handleWrap}>Wrapped Function</button>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useLoading.ts

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { ILoadingOptions } from '../core/types';

export function useLoading(): IUseLoadingReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useLoading must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get active loadings from store
  const loadings = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'loading' && item.status !== 'removed'
    )
  );

  const activeLoadings = useMemo(
    () => loadings.map((l) => l.id),
    [loadings]
  );

  const isLoading = activeLoadings.length > 0;

  const show = useCallback(
    (options: ILoadingOptions = {}): string => {
      return manager.add('loading', {
        spinner: 'default',
        overlay: false,
        overlayOpacity: 0.5,
        blur: false,
        blurAmount: '4px',
        cancellable: false,
        size: 'md',
        variant: 'primary',
        ...options,
      });
    },
    [manager]
  );

  const hide = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  const hideAll = useCallback((): void => {
    manager.removeAll('loading');
  }, [manager]);

  const update = useCallback(
    (id: string, options: Partial<ILoadingOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  const wrap = useCallback(
    async <T>(
      fn: () => Promise<T>,
      options: ILoadingOptions = {}
    ): Promise<T> => {
      const id = show(options);
      try {
        return await fn();
      } finally {
        hide(id);
      }
    },
    [show, hide]
  );

  return {
    show,
    hide,
    hideAll,
    update,
    wrap,
    isLoading,
    activeLoadings,
  };
}
```

## Component Architecture

### Loading Component (Headless)

```typescript
// src/components/Loading/Loading.tsx

import React, { memo, forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { ILoadingOptions, FeedbackStatus } from '../../core/types';

export interface ILoadingProps extends ILoadingOptions {
  /** Current animation status */
  status: FeedbackStatus;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const variantStyles = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
};

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
          <span className={cn('text-sm', variantStyles[variant])}>
            {message}
          </span>
        )}

        {/* Screen reader text */}
        <span className="sr-only">Loading{message ? `: ${message}` : ''}</span>
      </div>
    );
  })
);

Loading.displayName = 'Loading';
```

### Spinner Variants

```typescript
// src/components/Loading/Spinner.tsx

import React, { memo } from 'react';
import { cn } from '../../utils/classNames';

interface SpinnerProps {
  type: 'default' | 'dots' | 'bars' | 'ring' | 'pulse';
  className?: string;
}

export const Spinner = memo(function Spinner({ type, className }: SpinnerProps) {
  switch (type) {
    case 'default':
      return (
        <svg
          className={cn('animate-spin', className)}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      );

    case 'dots':
      return (
        <div className={cn('flex gap-1', className)}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-current animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      );

    case 'bars':
      return (
        <div className={cn('flex gap-1 items-end', className)}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-1 bg-current animate-pulse"
              style={{
                height: `${50 + i * 10}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      );

    case 'ring':
      return (
        <div
          className={cn(
            'border-4 border-current border-t-transparent rounded-full animate-spin',
            className
          )}
        />
      );

    case 'pulse':
      return (
        <div
          className={cn(
            'rounded-full bg-current animate-pulse',
            className
          )}
        />
      );

    default:
      return null;
  }
});

Spinner.displayName = 'Spinner';
```

### Loading Overlay

```typescript
// src/components/Loading/LoadingOverlay.tsx

import React, { memo, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/classNames';
import { Loading } from './Loading';
import { Z_INDEX } from '../../utils/constants';
import type { ILoadingProps } from './Loading';

export interface ILoadingOverlayProps extends ILoadingProps {
  /** Overlay opacity */
  overlayOpacity?: number;
  /** Blur background */
  blur?: boolean;
  /** Blur amount */
  blurAmount?: string;
  /** Cancellable */
  cancellable?: boolean;
  /** Cancel callback */
  onCancel?: () => void;
  /** Cancel button text */
  cancelText?: string;
}

export const LoadingOverlay = memo(
  forwardRef<HTMLDivElement, ILoadingOverlayProps>(function LoadingOverlay(
    props,
    ref
  ) {
    const {
      overlayOpacity = 0.5,
      blur = false,
      blurAmount = '4px',
      cancellable = false,
      onCancel,
      cancelText = 'Cancel',
      status,
      ...loadingProps
    } = props;

    const isVisible = status === 'visible' || status === 'entering';

    // Check for SSR
    if (typeof document === 'undefined') {
      return null;
    }

    return createPortal(
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 flex flex-col items-center justify-center',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: Z_INDEX.LOADING_OVERLAY }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: overlayOpacity,
            backdropFilter: blur ? `blur(${blurAmount})` : undefined,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Loading
            {...loadingProps}
            status={status}
            variant="white"
          />

          {/* Cancel Button */}
          {cancellable && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'mt-4 px-4 py-2 rounded-md',
                'bg-white/10 text-white',
                'hover:bg-white/20 transition-colors',
                'text-sm font-medium'
              )}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>,
      document.body
    );
  })
);

LoadingOverlay.displayName = 'LoadingOverlay';
```

### Loading Container

```typescript
// src/components/Loading/LoadingContainer.tsx

import React, { memo } from 'react';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../providers/FeedbackProvider';
import { LoadingOverlay } from './LoadingOverlay';

export const LoadingContainer = memo(function LoadingContainer() {
  const adapter = useAdapter();
  const LoadingComponent = adapter.LoadingComponent;
  const LoadingOverlayComponent = adapter.LoadingOverlayComponent || LoadingOverlay;

  // Get loadings from store
  const loadings = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'loading' && item.status !== 'removed'
    )
  );

  // Don't render if no loadings
  if (loadings.length === 0) {
    return null;
  }

  return (
    <>
      {loadings.map((loading) => {
        const options = loading.options as ILoadingOptions;

        // Render overlay or inline
        if (options.overlay) {
          return (
            <LoadingOverlayComponent
              key={loading.id}
              {...options}
              status={loading.status}
            />
          );
        }

        // Inline loading is typically rendered where needed
        // Container only handles overlay loadings
        return null;
      })}
    </>
  );
});

LoadingContainer.displayName = 'LoadingContainer';
```

## CSS Animations

```css
/* src/styles/loading-animations.css */

/* Default spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Bounce for dots */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25%);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
}

/* Bar loading */
@keyframes bar-pulse {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-bounce {
  animation: bounce 0.6s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
```

## Accessibility Requirements

### ARIA Attributes

```typescript
// Loading container must have:
role="status"
aria-live="polite"
aria-busy="true"

// Include screen reader text:
<span className="sr-only">Loading...</span>
```

### Keyboard Support

- Cancel button (if present) should be focusable
- ESC key can trigger cancel (optional)

## Testing Checklist

### Unit Tests

```typescript
describe('useLoading', () => {
  it('should show loading indicator', () => {});
  it('should hide specific loading', () => {});
  it('should hide all loadings', () => {});
  it('should update loading options', () => {});
  it('should wrap async function', () => {});
  it('should track active loadings', () => {});
  it('should return isLoading state', () => {});
});

describe('Loading', () => {
  it('should render spinner', () => {});
  it('should render message', () => {});
  it('should apply size styles', () => {});
  it('should apply variant styles', () => {});
  it('should have correct ARIA attributes', () => {});
});

describe('LoadingOverlay', () => {
  it('should render in portal', () => {});
  it('should apply overlay opacity', () => {});
  it('should apply blur', () => {});
  it('should render cancel button', () => {});
  it('should call onCancel', () => {});
});

describe('Spinner', () => {
  it('should render default spinner', () => {});
  it('should render dots spinner', () => {});
  it('should render bars spinner', () => {});
  it('should render ring spinner', () => {});
  it('should render pulse spinner', () => {});
});
```

### Integration Tests

```typescript
describe('Loading Integration', () => {
  it('should show and hide loading', async () => {});
  it('should wrap async function correctly', async () => {});
  it('should handle cancellation', async () => {});
  it('should work with all adapters', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useLoading.ts`
- [ ] Create `src/components/Loading/Loading.tsx`
- [ ] Create `src/components/Loading/Spinner.tsx`
- [ ] Create `src/components/Loading/LoadingOverlay.tsx`
- [ ] Create `src/components/Loading/LoadingContainer.tsx`
- [ ] Create `src/components/Loading/index.ts`
- [ ] Add loading animations to `src/styles/animations.css`
- [ ] Write unit tests for useLoading hook
- [ ] Write unit tests for Loading component
- [ ] Write unit tests for Spinner variants
- [ ] Write integration tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Blocking Interaction
❌ **Don't:** Show overlay without blur for long operations
✅ **Do:** Use blur and proper z-index to block interaction

### 2. Missing Cleanup
❌ **Don't:** Forget to hide loading on error
✅ **Do:** Always use try/finally or wrap() helper

### 3. Animation Performance
❌ **Don't:** Use heavy animations in spinners
✅ **Do:** Use simple CSS transforms and opacity

### 4. Accessibility
❌ **Don't:** Forget aria-busy and screen reader text
✅ **Do:** Always include ARIA attributes

## Notes

- Maximum 3 loading overlays visible by default
- Overlay loadings block entire page interaction
- Inline loadings can be used anywhere in component tree
- wrap() helper ensures loading is always hidden
- SSR safe - checks for `document` before portal render
