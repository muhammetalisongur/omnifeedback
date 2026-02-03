# Design: Skeleton System

## Overview
Implement a skeleton/placeholder loading system that shows content structure while data is loading. Better UX than spinners for content-heavy pages.

## Goals
- Multiple skeleton shapes (text, avatar, card, etc.)
- Animated shimmer effect
- Composable skeleton components
- Wave and pulse animation options
- Match actual content dimensions
- Work with all UI library adapters

## Skeleton Types

```
TEXT SKELETON                    AVATAR SKELETON
░░░░░░░░░░░░░░░░░░░░░          ┌────┐
░░░░░░░░░░░░░░░                │░░░░│  ← Circle
░░░░░░░░░░░░░░░░░░             └────┘

CARD SKELETON                    TABLE SKELETON
┌─────────────────────┐         ░░░░░ │ ░░░░░░ │ ░░░░
│ ░░░░░░░░░░░░░░░░░░ │         ░░░░░ │ ░░░░░░ │ ░░░░░
│ ░░░░░░░░░░░        │         ░░░░░ │ ░░░░░░ │ ░░░
│ ░░░░░░░░░░░░░░░    │         ░░░░░ │ ░░░░░░ │ ░░░░
└─────────────────────┘
```

## Skeleton API

### useSkeleton Hook Interface

```typescript
// src/hooks/useSkeleton.ts

export interface IUseSkeletonReturn {
  /** Show skeleton with ID */
  show: (id: string, options?: ISkeletonOptions) => void;
  
  /** Hide skeleton by ID */
  hide: (id: string) => void;
  
  /** Hide all skeletons */
  hideAll: () => void;
  
  /** Check if skeleton is visible */
  isVisible: (id: string) => boolean;
  
  /** Wrap async function with skeleton */
  wrap: <T>(
    id: string,
    fn: () => Promise<T>,
    options?: ISkeletonOptions
  ) => Promise<T>;
}
```

### Skeleton Options

```typescript
// From src/core/types.ts

export interface ISkeletonOptions extends IBaseFeedbackOptions {
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
  /** Base color */
  baseColor?: string;
  /** Highlight color (for wave animation) */
  highlightColor?: string;
  /** Border radius */
  borderRadius?: string | number;
  /** Animation duration (ms) */
  duration?: number;
}
```

## Component API

### Skeleton Components

```typescript
// Individual skeleton elements

<Skeleton />                    // Basic rectangle
<Skeleton.Text />               // Text line
<Skeleton.Text lines={3} />     // Multiple lines
<Skeleton.Avatar />             // Circle
<Skeleton.Avatar size="lg" />   // Large circle
<Skeleton.Button />             // Button shape
<Skeleton.Image />              // Image placeholder
<Skeleton.Card />               // Card with content
<Skeleton.Table rows={5} />     // Table rows
```

## Usage Examples

```typescript
import { Skeleton, useFeedback } from 'omnifeedback';

// ===== DECLARATIVE USAGE (Component) =====

function UserProfile({ isLoading, user }) {
  if (isLoading) {
    return (
      <div className="flex gap-4">
        <Skeleton.Avatar size="lg" />
        <div className="flex-1">
          <Skeleton.Text width={200} />
          <Skeleton.Text width={150} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <img src={user.avatar} className="w-16 h-16 rounded-full" />
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

// ===== IMPERATIVE USAGE (Hook) =====

function DataTable() {
  const { skeleton } = useFeedback();
  const [data, setData] = useState(null);

  useEffect(() => {
    skeleton.show('table-data');
    
    fetchData()
      .then(setData)
      .finally(() => skeleton.hide('table-data'));
  }, []);

  // Or use wrap helper
  const loadData = async () => {
    const result = await skeleton.wrap('table-data', () => fetchData());
    setData(result);
  };

  return (
    <SkeletonContainer id="table-data" fallback={<Skeleton.Table rows={5} />}>
      <table>
        {data?.map(row => <tr>...</tr>)}
      </table>
    </SkeletonContainer>
  );
}

// ===== MULTIPLE TEXT LINES =====

function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={32} width="60%" />  {/* Title */}
      <Skeleton.Text lines={4} />            {/* Paragraphs */}
      <Skeleton.Text lines={3} />
    </div>
  );
}

// ===== CARD SKELETON =====

function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <Skeleton.Image height={200} />
      <div className="mt-4 space-y-2">
        <Skeleton height={20} width="80%" />
        <Skeleton height={16} width="40%" />
        <Skeleton.Button width={100} />
      </div>
    </div>
  );
}

// ===== TABLE SKELETON =====

function TableSkeleton() {
  return (
    <Skeleton.Table 
      rows={5} 
      columns={4}
      columnWidths={['20%', '30%', '30%', '20%']}
    />
  );
}

// ===== WITH CUSTOM ANIMATION =====

function CustomSkeleton() {
  return (
    <Skeleton 
      animation="wave"
      baseColor="#e0e0e0"
      highlightColor="#f5f5f5"
      duration={1500}
    />
  );
}

// ===== INLINE WITH CONTENT =====

function InlineSkeleton({ loading, text }) {
  return (
    <p>
      Toplam: {loading ? <Skeleton inline width={60} /> : text}
    </p>
  );
}
```

## Component Architecture

### Base Skeleton Component

```typescript
// src/components/Skeleton/Skeleton.tsx

import React, { memo, forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { ISkeletonOptions } from '../../core/types';

export interface ISkeletonProps extends ISkeletonOptions {
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Circle shape */
  circle?: boolean;
  /** Inline display */
  inline?: boolean;
  /** Custom className */
  className?: string;
  /** Number of skeleton items */
  count?: number;
}

export const Skeleton = memo(
  forwardRef<HTMLDivElement, ISkeletonProps>(function Skeleton(props, ref) {
    const {
      width,
      height = 16,
      circle = false,
      inline = false,
      animation = 'pulse',
      baseColor,
      highlightColor,
      borderRadius,
      duration = 1500,
      className,
      count = 1,
    } = props;

    const elements = Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        ref={i === 0 ? ref : undefined}
        className={cn(
          'skeleton-base',
          inline ? 'inline-block' : 'block',
          circle && 'rounded-full',
          animation === 'pulse' && 'animate-pulse',
          animation === 'wave' && 'skeleton-wave',
          className
        )}
        style={{
          width: width ?? (circle ? height : '100%'),
          height,
          borderRadius: circle ? '50%' : borderRadius ?? 4,
          backgroundColor: baseColor ?? 'rgb(229 231 235)', // gray-200
          '--skeleton-highlight': highlightColor ?? 'rgb(243 244 246)', // gray-100
          '--skeleton-duration': `${duration}ms`,
        } as React.CSSProperties}
        aria-hidden="true"
      />
    ));

    if (count === 1) {
      return elements[0];
    }

    return <>{elements}</>;
  })
);

Skeleton.displayName = 'Skeleton';
```

### Skeleton.Text Component

```typescript
// src/components/Skeleton/SkeletonText.tsx

import React, { memo } from 'react';
import { Skeleton } from './Skeleton';

export interface ISkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Width of last line (percentage or px) */
  lastLineWidth?: string | number;
  /** Gap between lines */
  gap?: number;
  /** Line height */
  lineHeight?: number;
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
}

export const SkeletonText = memo(function SkeletonText({
  lines = 1,
  lastLineWidth = '60%',
  gap = 8,
  lineHeight = 16,
  animation = 'pulse',
}: ISkeletonTextProps) {
  return (
    <div className="space-y-2" style={{ gap }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          animation={animation}
        />
      ))}
    </div>
  );
});

SkeletonText.displayName = 'Skeleton.Text';
```

### Skeleton.Avatar Component

```typescript
// src/components/Skeleton/SkeletonAvatar.tsx

import React, { memo } from 'react';
import { Skeleton } from './Skeleton';

export interface ISkeletonAvatarProps {
  /** Size preset or custom size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export const SkeletonAvatar = memo(function SkeletonAvatar({
  size = 'md',
  animation = 'pulse',
}: ISkeletonAvatarProps) {
  const dimension = typeof size === 'number' ? size : sizeMap[size];

  return (
    <Skeleton
      width={dimension}
      height={dimension}
      circle
      animation={animation}
    />
  );
});

SkeletonAvatar.displayName = 'Skeleton.Avatar';
```

### Skeleton.Card Component

```typescript
// src/components/Skeleton/SkeletonCard.tsx

import React, { memo } from 'react';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';

export interface ISkeletonCardProps {
  /** Show image placeholder */
  hasImage?: boolean;
  /** Image height */
  imageHeight?: number;
  /** Number of text lines */
  lines?: number;
  /** Show button */
  hasButton?: boolean;
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
}

export const SkeletonCard = memo(function SkeletonCard({
  hasImage = true,
  imageHeight = 200,
  lines = 3,
  hasButton = true,
  animation = 'pulse',
}: ISkeletonCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {hasImage && (
        <Skeleton
          height={imageHeight}
          animation={animation}
          borderRadius={0}
        />
      )}
      <div className="p-4 space-y-3">
        <Skeleton height={24} width="70%" animation={animation} />
        <SkeletonText lines={lines} animation={animation} />
        {hasButton && (
          <Skeleton height={36} width={100} animation={animation} />
        )}
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'Skeleton.Card';
```

### Skeleton.Table Component

```typescript
// src/components/Skeleton/SkeletonTable.tsx

import React, { memo } from 'react';
import { Skeleton } from './Skeleton';

export interface ISkeletonTableProps {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
  /** Column widths (percentage or px) */
  columnWidths?: (string | number)[];
  /** Row height */
  rowHeight?: number;
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
}

export const SkeletonTable = memo(function SkeletonTable({
  rows = 5,
  columns = 4,
  columnWidths,
  rowHeight = 40,
  animation = 'pulse',
}: ISkeletonTableProps) {
  const getColumnWidth = (index: number): string | number => {
    if (columnWidths && columnWidths[index]) {
      return columnWidths[index];
    }
    return `${100 / columns}%`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 p-3 border-b bg-gray-50 dark:bg-gray-800">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} style={{ width: getColumnWidth(i) }}>
            <Skeleton height={16} animation={animation} />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-3 border-b last:border-b-0"
          style={{ height: rowHeight }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <div key={colIndex} style={{ width: getColumnWidth(colIndex) }}>
              <Skeleton
                height={16}
                width={`${70 + Math.random() * 30}%`}
                animation={animation}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

SkeletonTable.displayName = 'Skeleton.Table';
```

### Skeleton Container

```typescript
// src/components/Skeleton/SkeletonContainer.tsx

import React, { memo, ReactNode } from 'react';
import { useFeedbackStore } from '../../core/FeedbackStore';

export interface ISkeletonContainerProps {
  /** Skeleton ID to check */
  id: string;
  /** Fallback skeleton content */
  fallback: ReactNode;
  /** Actual content */
  children: ReactNode;
}

export const SkeletonContainer = memo(function SkeletonContainer({
  id,
  fallback,
  children,
}: ISkeletonContainerProps) {
  const isVisible = useFeedbackStore((state) =>
    Array.from(state.items.values()).some(
      (item) => item.type === 'skeleton' && item.id === id && item.status !== 'removed'
    )
  );

  return <>{isVisible ? fallback : children}</>;
});

SkeletonContainer.displayName = 'SkeletonContainer';
```

## CSS Animations

```css
/* src/styles/skeleton-animations.css */

/* Pulse animation */
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

/* Wave animation */
@keyframes skeleton-wave {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-wave {
  background: linear-gradient(
    90deg,
    var(--skeleton-base, rgb(229 231 235)) 0px,
    var(--skeleton-highlight, rgb(243 244 246)) 50%,
    var(--skeleton-base, rgb(229 231 235)) 100%
  );
  background-size: 200px 100%;
  animation: skeleton-wave var(--skeleton-duration, 1.5s) ease-in-out infinite;
}

/* Dark mode */
.dark .skeleton-base {
  background-color: rgb(55 65 81); /* gray-700 */
  --skeleton-highlight: rgb(75 85 99); /* gray-600 */
}
```

## Accessibility

```typescript
// All skeleton elements should have:
aria-hidden="true"

// Screen reader announcement
<div role="status" aria-live="polite" className="sr-only">
  Loading content...
</div>
```

## Testing Checklist

### Unit Tests

```typescript
describe('useSkeleton', () => {
  it('should show skeleton by ID', () => {});
  it('should hide skeleton by ID', () => {});
  it('should hide all skeletons', () => {});
  it('should check visibility', () => {});
  it('should wrap async function', () => {});
});

describe('Skeleton', () => {
  it('should render with default props', () => {});
  it('should render as circle', () => {});
  it('should render inline', () => {});
  it('should apply pulse animation', () => {});
  it('should apply wave animation', () => {});
  it('should apply custom colors', () => {});
  it('should render multiple items', () => {});
});

describe('Skeleton.Text', () => {
  it('should render multiple lines', () => {});
  it('should apply last line width', () => {});
});

describe('Skeleton.Card', () => {
  it('should render with image', () => {});
  it('should render without image', () => {});
});

describe('Skeleton.Table', () => {
  it('should render correct rows and columns', () => {});
  it('should apply column widths', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useSkeleton.ts`
- [ ] Create `src/components/Skeleton/Skeleton.tsx`
- [ ] Create `src/components/Skeleton/SkeletonText.tsx`
- [ ] Create `src/components/Skeleton/SkeletonAvatar.tsx`
- [ ] Create `src/components/Skeleton/SkeletonCard.tsx`
- [ ] Create `src/components/Skeleton/SkeletonTable.tsx`
- [ ] Create `src/components/Skeleton/SkeletonContainer.tsx`
- [ ] Create `src/components/Skeleton/index.ts`
- [ ] Add skeleton animations to CSS
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Size Mismatch
❌ **Don't:** Use skeleton that doesn't match content size
✅ **Do:** Match skeleton dimensions to actual content

### 2. Missing aria-hidden
❌ **Don't:** Let screen readers announce skeleton shapes
✅ **Do:** Add aria-hidden="true" to all skeletons

### 3. Animation Performance
❌ **Don't:** Use expensive animations on many skeletons
✅ **Do:** Use CSS animations, consider reducing on low-end devices

### 4. Flash of Content
❌ **Don't:** Show skeleton for very fast loads
✅ **Do:** Add minimum display time or delay skeleton show

## Notes

- Skeleton is purely presentational (no portal)
- Hook-based API for imperative control
- Component-based API for declarative usage
- Supports both dark and light modes
- Wave animation is more visually appealing
- Pulse animation is more performant
