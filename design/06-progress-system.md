# Design: Progress System

## Overview
Implement a progress indicator system for tracking long-running operations with visual feedback. The system provides both linear (horizontal bar) and circular (SVG ring) progress components, supporting determinate and indeterminate modes with full customization of colors, sizes, labels, and animations.

## Goals
- Linear progress bars with track and fill
- Circular SVG-based progress indicators
- Determinate and indeterminate modes
- Multiple size variants (sm, md, lg)
- Custom colors and variant themes
- Percentage display support
- Label support with flexible positioning
- Striped and animated patterns (linear)
- Custom stroke width (circular)
- Managed via `useProgress` hook
- Inline `<ProgressContainer />` placement (not portal-based)
- Work with all UI library adapters

## Visual Layout

### Linear Progress

```
Label Text                     75%
┌──────────────────────────────────┐
│████████████████████████░░░░░░░░░░│
└──────────────────────────────────┘

Indeterminate:
┌──────────────────────────────────┐
│░░░░░░█████████░░░░░░░░░░░░░░░░░░│  ← animating
└──────────────────────────────────┘

Striped + Animated:
┌──────────────────────────────────┐
│▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒░░░░░░░░░░░░░░│  ← stripes move
└──────────────────────────────────┘
```

### Circular Progress

```
    ╭───╮
   ╱  75% ╲       ← percentage in center
  │         │
   ╲       ╱
    ╰───╯
   Label Text      ← label below

Indeterminate:
    ╭───╮
   ╱     ╲        ← spinning animation
  │       │
   ╲     ╱
    ╰───╯
```

## Progress API

### useProgress Hook Interface

```typescript
// src/hooks/useProgress.ts

export interface IUseProgressReturn {
  /** Show progress indicator with options */
  show: (options: IProgressOptions) => string;
  /** Update progress value and optionally other options */
  update: (id: string, value: number, options?: Partial<IProgressOptions>) => void;
  /** Mark progress as complete (sets to 100% then removes after delay) */
  complete: (id: string) => void;
  /** Remove progress indicator immediately */
  remove: (id: string) => void;
  /** Remove all progress indicators */
  removeAll: () => void;
  /** Toggle indeterminate mode on an existing indicator */
  setIndeterminate: (id: string, indeterminate: boolean) => void;
  /** Get all active progress indicators */
  indicators: IProgressItem[];
}

export interface IProgressItem extends IFeedbackItem<'progress'> {
  options: IProgressOptions;
}
```

### Progress Options

```typescript
// From src/core/types.ts

export interface IProgressOptions extends IBaseFeedbackOptions {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Progress label text */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Visual variant */
  variant?: FeedbackVariant; // 'default' | 'success' | 'error' | 'warning' | 'info'
  /** Indeterminate mode (unknown duration) */
  indeterminate?: boolean;
  /** Size variant */
  size?: ProgressSize; // 'sm' | 'md' | 'lg'
  /** Progress type */
  type?: ProgressType; // 'linear' | 'circular'
  /** Enable animation (linear striped only) */
  animated?: boolean;
  /** Show striped pattern (linear only) */
  striped?: boolean;
  /** Custom color (overrides variant) */
  color?: string;
  /** Callback when value reaches max */
  onComplete?: () => void;
}
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function UploadComponent() {
  const { progress } = useFeedback();

  // Simple linear progress
  const handleUpload = async () => {
    const id = progress.show({ value: 0, label: 'Uploading...' });

    for (let i = 0; i <= 100; i += 10) {
      await delay(200);
      progress.update(id, i);
    }

    progress.complete(id);
  };

  // Indeterminate loading (unknown duration)
  const handleConnect = async () => {
    const id = progress.show({
      value: 0,
      indeterminate: true,
      label: 'Connecting to server...',
    });

    await connectToServer();
    progress.complete(id);
  };

  // Circular progress with percentage
  const handleProcess = () => {
    progress.show({
      value: 75,
      type: 'circular',
      showPercentage: true,
      variant: 'success',
    });
  };

  // Striped animated progress bar
  const handleBuild = async () => {
    const id = progress.show({
      value: 0,
      label: 'Building project...',
      striped: true,
      animated: true,
      showPercentage: true,
      variant: 'info',
    });

    for (let i = 0; i <= 100; i += 5) {
      await delay(100);
      progress.update(id, i, {
        label: i < 100 ? `Building... Step ${i / 5}/20` : 'Build complete!',
      });
    }

    progress.complete(id);
  };

  // Custom color progress
  const handleCustom = () => {
    progress.show({
      value: 60,
      color: '#8B5CF6', // Custom purple
      label: 'Processing...',
      showPercentage: true,
    });
  };

  // Multiple progress indicators
  const handleMultiple = async () => {
    const file1 = progress.show({ value: 0, label: 'file-1.jpg' });
    const file2 = progress.show({ value: 0, label: 'file-2.png' });
    const file3 = progress.show({ value: 0, label: 'file-3.pdf' });

    // Update each independently
    progress.update(file1, 50);
    progress.update(file2, 30);
    progress.update(file3, 80);
  };

  // Switch from indeterminate to determinate
  const handleDynamicMode = async () => {
    const id = progress.show({
      value: 0,
      indeterminate: true,
      label: 'Calculating...',
    });

    const total = await calculateTotal();
    progress.setIndeterminate(id, false);
    progress.update(id, 0, { label: 'Processing items...' });

    for (let i = 0; i <= total; i++) {
      await processItem(i);
      progress.update(id, (i / total) * 100);
    }

    progress.complete(id);
  };

  return (
    <div>
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleConnect}>Connect</button>
      <ProgressContainer />
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useProgress.ts

import { useCallback, useContext } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IProgressOptions, IFeedbackItem } from '../core/types';

export interface IProgressItem extends IFeedbackItem<'progress'> {
  options: IProgressOptions;
}

const DEFAULT_OPTIONS: Partial<IProgressOptions> = {
  max: 100,
  indeterminate: false,
  size: 'md',
  type: 'linear',
  animated: false,
  striped: false,
  showPercentage: false,
  variant: 'info',
};

export function useProgress(): IUseProgressReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useProgress must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get progress indicators from store
  const indicators = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IProgressItem =>
        item.type === 'progress' && item.status !== 'removed'
    )
  );

  // Show progress indicator
  const show = useCallback(
    (options: IProgressOptions): string => {
      return manager.add('progress', {
        ...DEFAULT_OPTIONS,
        ...options,
      } as IProgressOptions);
    },
    [manager]
  );

  // Update progress value
  const update = useCallback(
    (id: string, value: number, options?: Partial<IProgressOptions>): void => {
      const indicator = manager.get(id);
      if (indicator) {
        const currentOptions = indicator.options as IProgressOptions;
        const max = options?.max ?? currentOptions.max ?? 100;

        manager.update(id, { value, ...options });

        // Call onComplete if value reaches max
        if (value >= max && currentOptions.onComplete) {
          currentOptions.onComplete();
        }
      }
    },
    [manager]
  );

  // Complete progress (set to 100% and remove after delay)
  const complete = useCallback(
    (id: string): void => {
      const indicator = manager.get(id);
      if (indicator) {
        const options = indicator.options as IProgressOptions;
        const max = options.max ?? 100;

        manager.update(id, { value: max, indeterminate: false });
        options.onComplete?.();

        // Remove after a short delay for visual feedback
        setTimeout(() => {
          manager.remove(id);
        }, 500);
      }
    },
    [manager]
  );

  // Remove progress indicator
  const remove = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  // Remove all progress indicators
  const removeAll = useCallback((): void => {
    manager.removeAll('progress');
  }, [manager]);

  // Toggle indeterminate mode
  const setIndeterminate = useCallback(
    (id: string, indeterminate: boolean): void => {
      manager.update(id, { indeterminate });
    },
    [manager]
  );

  return {
    show,
    update,
    complete,
    remove,
    removeAll,
    setIndeterminate,
    indicators,
  };
}
```

## Component Architecture

### Progress (Unified Wrapper)

```typescript
// src/components/Progress/Progress.tsx

export interface IProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Progress label */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Visual variant */
  variant?: FeedbackVariant;
  /** Indeterminate mode */
  indeterminate?: boolean;
  /** Size */
  size?: ProgressSize;
  /** Progress type (linear or circular) */
  type?: ProgressType;
  /** Enable animation (linear only) */
  animated?: boolean;
  /** Show striped pattern (linear only) */
  striped?: boolean;
  /** Custom color */
  color?: string;
  /** Stroke width (circular only) */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

export const Progress = memo(
  forwardRef<HTMLDivElement, IProgressProps>(function Progress(props, ref) {
    const { type = 'linear', animated, striped, strokeWidth, ...commonProps } = props;

    if (type === 'circular') {
      return (
        <CircularProgress
          ref={ref}
          {...commonProps}
          {...(strokeWidth !== undefined && { strokeWidth })}
        />
      );
    }

    return (
      <LinearProgress
        ref={ref}
        {...commonProps}
        {...(animated !== undefined && { animated })}
        {...(striped !== undefined && { striped })}
      />
    );
  })
);
```

### LinearProgress

```typescript
// src/components/Progress/LinearProgress.tsx

export interface ILinearProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: FeedbackVariant;
  indeterminate?: boolean;
  size?: ProgressSize;
  animated?: boolean;
  striped?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

// Size-specific track heights
const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

// Variant-specific fill colors
const variantStyles: Record<FeedbackVariant, string> = {
  default: 'bg-gray-600',
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export const LinearProgress = memo(
  forwardRef<HTMLDivElement, ILinearProgressProps>(function LinearProgress(props, ref) {
    const {
      value, max = 100, label, showPercentage = false,
      variant = 'info', indeterminate = false, size = 'md',
      animated = false, striped = false, color,
      className, style, testId,
    } = props;

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayPercentage = Math.round(percentage);

    const fillStyle: React.CSSProperties = {
      width: indeterminate ? '50%' : `${percentage}%`,
      ...(color && { backgroundColor: color }),
    };

    return (
      <div ref={ref} className={cn('w-full', className)} style={style} data-testid={testId}>
        {/* Label and percentage row */}
        {(label ?? showPercentage) && (
          <div className="flex justify-between items-center mb-1">
            {label && <span className="text-sm text-gray-700">{label}</span>}
            {showPercentage && !indeterminate && (
              <span className="text-sm text-gray-600">{displayPercentage}%</span>
            )}
          </div>
        )}

        {/* Progress track */}
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label ?? 'Progress'}
          className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeStyles[size])}
        >
          {/* Progress fill */}
          <div
            className={cn(
              'h-full rounded-full',
              !color && variantStyles[variant],
              !indeterminate && 'transition-all duration-300 ease-out',
              indeterminate && 'animate-indeterminate',
              striped && 'bg-striped',
              striped && animated && 'animate-striped'
            )}
            style={fillStyle}
          />
        </div>
      </div>
    );
  })
);
```

### CircularProgress

```typescript
// src/components/Progress/CircularProgress.tsx

export interface ICircularProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: FeedbackVariant;
  indeterminate?: boolean;
  size?: ProgressSize;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

// Size configurations (width/height in pixels)
const sizeConfig: Record<ProgressSize, { size: number; strokeWidth: number; fontSize: string }> = {
  sm: { size: 32, strokeWidth: 3, fontSize: 'text-xs' },
  md: { size: 48, strokeWidth: 4, fontSize: 'text-sm' },
  lg: { size: 64, strokeWidth: 5, fontSize: 'text-base' },
};

// Variant-specific stroke colors
const variantStyles: Record<FeedbackVariant, string> = {
  default: 'stroke-gray-600',
  success: 'stroke-green-500',
  error: 'stroke-red-500',
  warning: 'stroke-yellow-500',
  info: 'stroke-blue-500',
};

export const CircularProgress = memo(
  forwardRef<HTMLDivElement, ICircularProgressProps>(function CircularProgress(props, ref) {
    const {
      value, max = 100, label, showPercentage = false,
      variant = 'info', indeterminate = false, size = 'md',
      color, strokeWidth: customStrokeWidth,
      className, style, testId,
    } = props;

    const config = sizeConfig[size];
    const svgSize = config.size;
    const strokeWidth = customStrokeWidth ?? config.strokeWidth;

    // SVG geometry
    const radius = (svgSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const center = svgSize / 2;

    return (
      <div ref={ref} className={cn('inline-flex flex-col items-center', className)} style={style}>
        <div className="relative" style={{ width: svgSize, height: svgSize }}>
          <svg
            width={svgSize} height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : value}
            aria-valuemin={0} aria-valuemax={max}
            aria-label={label ?? 'Progress'}
            className={cn(indeterminate && 'animate-spin')}
          >
            {/* Background track circle */}
            <circle cx={center} cy={center} r={radius}
              fill="none" stroke="currentColor" strokeWidth={strokeWidth}
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle cx={center} cy={center} r={radius}
              fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
              className={cn(!color && variantStyles[variant],
                !indeterminate && 'transition-all duration-300 ease-out')}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: indeterminate ? circumference * 0.75 : strokeDashoffset,
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
                ...(color && { stroke: color }),
              }}
            />
          </svg>

          {/* Center percentage text */}
          {showPercentage && !indeterminate && (
            <div className={cn('absolute inset-0 flex items-center justify-center',
              config.fontSize, 'font-medium text-gray-700')}>
              {Math.round(percentage)}%
            </div>
          )}
        </div>

        {/* Label below */}
        {label && <span className="mt-2 text-sm text-gray-700">{label}</span>}
      </div>
    );
  })
);
```

### ProgressContainer

```typescript
// src/components/Progress/ProgressContainer.tsx

export interface IProgressContainerProps {
  /** Gap between indicators (in pixels) */
  gap?: number;
  /** Additional CSS classes */
  className?: string;
  /** Maximum indicators to show */
  maxIndicators?: number;
  /** Test ID for testing */
  testId?: string;
}

export const ProgressContainer = memo(function ProgressContainer({
  gap = 12,
  className,
  maxIndicators = 5,
  testId,
}: IProgressContainerProps) {
  const indicators = useFeedbackStore((state) =>
    Array.from(state.items.values())
      .filter((item) => item.type === 'progress' && item.status !== 'removed')
      .slice(0, maxIndicators)
  );

  if (indicators.length === 0) return null;

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ gap: `${gap}px` }}
      role="region"
      aria-label="Progress indicators"
      data-testid={testId}
    >
      {indicators.map((indicator) => {
        const options = indicator.options as IProgressOptions;
        return <Progress key={indicator.id} {...options} />;
      })}
    </div>
  );
});
```

## CSS Animations

```css
/* src/styles/progress-animations.css */

/* Indeterminate linear animation - slides across */
@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

.animate-indeterminate {
  animation: indeterminate 1.5s infinite linear;
}

/* Striped background pattern */
.bg-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

/* Animated stripes - movement */
@keyframes striped {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}

.animate-striped {
  animation: striped 1s linear infinite;
}
```

## Module Exports

```typescript
// src/components/Progress/index.ts

// Components
export { Progress } from './Progress';
export { LinearProgress } from './LinearProgress';
export { CircularProgress } from './CircularProgress';
export { ProgressContainer } from './ProgressContainer';

// Types
export type { IProgressProps } from './Progress';
export type { ILinearProgressProps } from './LinearProgress';
export type { ICircularProgressProps } from './CircularProgress';
export type { IProgressContainerProps } from './ProgressContainer';
```

## Accessibility Requirements

### ARIA Attributes

```typescript
// LinearProgress and CircularProgress both use:
role="progressbar"
aria-valuenow={indeterminate ? undefined : value}  // omitted when indeterminate
aria-valuemin={0}
aria-valuemax={max}
aria-label={label ?? 'Progress'}

// ProgressContainer uses:
role="region"
aria-label="Progress indicators"
```

### Key Accessibility Notes

- `aria-valuenow` is **omitted** in indeterminate mode (per WAI-ARIA spec)
- `aria-valuemin` and `aria-valuemax` are always present
- `aria-label` falls back to "Progress" when no label prop is provided
- Percentage text is visible to screen readers through the DOM
- The `ProgressContainer` wraps indicators in a `role="region"` for landmark navigation

## Testing Checklist

### Unit Tests

```typescript
describe('useProgress', () => {
  it('should show progress with default options', () => {});
  it('should update progress value', () => {});
  it('should complete progress (set to max and remove)', () => {});
  it('should remove progress indicator', () => {});
  it('should remove all progress indicators', () => {});
  it('should toggle indeterminate mode', () => {});
  it('should call onComplete when value reaches max', () => {});
  it('should track indicators in return value', () => {});
  it('should throw when used outside FeedbackProvider', () => {});
});

describe('LinearProgress', () => {
  it('should render with default props', () => {});
  it('should display correct percentage width', () => {});
  it('should show label text', () => {});
  it('should show percentage text', () => {});
  it('should hide percentage in indeterminate mode', () => {});
  it('should apply variant styles', () => {});
  it('should apply custom color', () => {});
  it('should apply size classes (sm, md, lg)', () => {});
  it('should render striped pattern', () => {});
  it('should animate striped pattern', () => {});
  it('should clamp value between 0 and max', () => {});
  it('should have correct ARIA attributes', () => {});
  it('should omit aria-valuenow in indeterminate mode', () => {});
});

describe('CircularProgress', () => {
  it('should render SVG with correct viewBox', () => {});
  it('should calculate strokeDashoffset correctly', () => {});
  it('should show percentage in center', () => {});
  it('should hide percentage in indeterminate mode', () => {});
  it('should spin in indeterminate mode', () => {});
  it('should apply variant stroke colors', () => {});
  it('should apply custom color', () => {});
  it('should apply custom strokeWidth', () => {});
  it('should render label below circle', () => {});
  it('should have correct ARIA attributes', () => {});
});

describe('Progress (wrapper)', () => {
  it('should render LinearProgress by default', () => {});
  it('should render CircularProgress when type is circular', () => {});
  it('should pass animated/striped only to LinearProgress', () => {});
  it('should pass strokeWidth only to CircularProgress', () => {});
});

describe('ProgressContainer', () => {
  it('should render indicators from store', () => {});
  it('should respect maxIndicators limit', () => {});
  it('should apply custom gap', () => {});
  it('should not render when no indicators', () => {});
  it('should have region role with aria-label', () => {});
});
```

### Integration Tests

```typescript
describe('Progress Integration', () => {
  it('should show and update progress through hook', async () => {});
  it('should complete and auto-remove after delay', async () => {});
  it('should handle multiple concurrent indicators', () => {});
  it('should switch from indeterminate to determinate', () => {});
  it('should work with all adapter variants', () => {});
  it('should fire onComplete callback at max value', () => {});
});
```

## Implementation Checklist

- [x] Create `src/hooks/useProgress.ts`
- [x] Create `src/components/Progress/Progress.tsx`
- [x] Create `src/components/Progress/LinearProgress.tsx`
- [x] Create `src/components/Progress/CircularProgress.tsx`
- [x] Create `src/components/Progress/ProgressContainer.tsx`
- [x] Create `src/components/Progress/index.ts`
- [x] Add progress types to `src/core/types.ts`
- [x] Write unit tests for LinearProgress
- [x] Write unit tests for CircularProgress
- [x] Write unit tests for Progress wrapper
- [ ] Write integration tests for useProgress hook
- [x] Verify accessibility (aria-valuenow, aria-valuemin, aria-valuemax)
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Indeterminate ARIA
- **Don't:** Set `aria-valuenow={0}` in indeterminate mode
- **Do:** Omit `aria-valuenow` entirely when indeterminate (per WAI-ARIA spec)

### 2. Value Clamping
- **Don't:** Allow values below 0 or above max
- **Do:** Clamp with `Math.min(Math.max((value / max) * 100, 0), 100)`

### 3. SVG Coordinate System
- **Don't:** Forget the -90deg rotation for circular progress (SVG starts at 3 o'clock)
- **Do:** Apply `transform: rotate(-90deg)` with `transformOrigin: center` on the progress circle

### 4. Striped Animation Performance
- **Don't:** Animate `background-position` with large values
- **Do:** Use small `background-size` values (1rem) for smooth striped animation

### 5. Memory Leaks with Complete
- **Don't:** Forget the 500ms delay timer cleanup
- **Do:** The `complete()` method uses `setTimeout` which is cleaned up by the manager lifecycle

## Notes

- Progress indicators render **inline** via `<ProgressContainer />` (not via portal like toasts)
- The container respects `maxIndicators` (default: 5) to prevent overflow
- `complete()` sets value to max, calls `onComplete`, then removes after 500ms delay
- Circular progress uses SVG `stroke-dasharray` / `stroke-dashoffset` for arc rendering
- Default variant is `'info'` (blue) for both linear and circular
- Custom `color` prop overrides variant color for both types
- SSR-safe: no `document` or `window` access in components
