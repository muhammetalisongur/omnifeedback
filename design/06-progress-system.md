# Design: Progress System

## Overview
Implement a progress indicator system for tracking long-running operations with visual feedback.

## Goals
- Linear progress bars
- Circular progress indicators
- Determinate and indeterminate modes
- Multiple size variants
- Custom colors/themes
- Percentage display
- Label support
- Work with all UI library adapters

## Progress API

### useProgress Hook Interface

```typescript
export interface IUseProgressReturn {
  show: (options: IProgressOptions) => string;
  update: (id: string, value: number, options?: Partial<IProgressOptions>) => void;
  complete: (id: string) => void;
  remove: (id: string) => void;
  removeAll: () => void;
  setIndeterminate: (id: string, indeterminate: boolean) => void;
  indicators: IProgressItem[];
}
```

### Progress Options

```typescript
export interface IProgressOptions extends IBaseFeedbackOptions {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'linear' | 'circular';
  animated?: boolean;
  striped?: boolean;
  onComplete?: () => void;
  color?: string;
}
```

## Usage Examples

```typescript
const { progress } = useFeedback();

// Simple progress
const id = progress.show({ value: 0, label: 'Uploading...' });
for (let i = 0; i <= 100; i += 10) {
  await delay(200);
  progress.update(id, i);
}
progress.complete(id);

// Indeterminate
const id = progress.show({ indeterminate: true, label: 'Connecting...' });

// Circular with percentage
progress.show({ value: 75, type: 'circular', showPercentage: true });
```

## Component Architecture

### LinearProgress
- Horizontal bar with track and fill
- Striped option with CSS background
- Animated transitions

### CircularProgress  
- SVG-based circle
- Stroke-dasharray for progress
- Rotation animation for indeterminate

## CSS Animations

```css
@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

.bg-striped {
  background-image: linear-gradient(45deg, ...);
}
```

## Implementation Checklist

- [ ] Create `src/hooks/useProgress.ts`
- [ ] Create `src/components/Progress/LinearProgress.tsx`
- [ ] Create `src/components/Progress/CircularProgress.tsx`
- [ ] Create `src/components/Progress/ProgressContainer.tsx`
- [ ] Write unit tests
- [ ] Verify accessibility (aria-valuenow, aria-valuemin, aria-valuemax)
- [ ] Test with all adapters
