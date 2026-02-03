# Design: Popconfirm System

## Overview
Implement a popover-based confirmation that appears near the trigger element. Lightweight alternative to confirm modal for inline actions.

## Goals
- Appears near trigger element (not centered modal)
- Multiple placement options
- Promise-based API like confirm
- Danger variant for destructive actions
- Arrow pointing to trigger
- Auto-positioning (flip when near edge)
- Work with all UI library adapters

## Popconfirm vs Confirm

```
CONFIRM MODAL (Centered)              POPCONFIRM (Near trigger)
┌─────────────────────────┐           ┌─────────────────────────┐
│                         │           │  Item 1     [Edit][Del] │
│    ┌───────────────┐    │           │  Item 2     [Edit][Del]←─────┐
│    │ Are you sure? │    │           │  Item 3     [Edit][Del] │    │
│    │ [No]   [Yes]  │    │           └─────────────────────────┘    │
│    └───────────────┘    │                          ┌───────────────┴───┐
│                         │                          │ Delete this item? │
└─────────────────────────┘                          │  [No]    [Yes]    │
                                                     └───────────────────┘
       ↑ Full screen overlay                              ↑ Small popup near button
```

## Popconfirm API

### usePopconfirm Hook Interface

```typescript
// src/hooks/usePopconfirm.ts

export interface IUsePopconfirmReturn {
  /** Show popconfirm and await response */
  show: (options: IPopconfirmOptions) => Promise<boolean>;
  
  /** Show danger popconfirm */
  danger: (
    target: HTMLElement | React.RefObject<HTMLElement>,
    message: string,
    options?: Partial<IPopconfirmOptions>
  ) => Promise<boolean>;
  
  /** Close popconfirm without response */
  close: () => void;
  
  /** Check if popconfirm is open */
  isOpen: boolean;
}
```

### Popconfirm Options

```typescript
// From src/core/types.ts

export interface IPopconfirmOptions extends IBaseFeedbackOptions {
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
}

export type PopconfirmPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';
```

## Placement Illustration

```
              top-start    top    top-end
                   ↓        ↓        ↓
                ┌──────────────────────┐
   left-start → │                      │ ← right-start
                │                      │
         left → │       TARGET         │ ← right
                │                      │
     left-end → │                      │ ← right-end
                └──────────────────────┘
                   ↑        ↑        ↑
           bottom-start  bottom  bottom-end
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { popconfirm } = useFeedback();

  // Basic usage with event target
  const handleDelete = async (e: React.MouseEvent) => {
    const confirmed = await popconfirm.show({
      target: e.currentTarget as HTMLElement,
      message: 'Bu öğeyi silmek istediğinize emin misiniz?',
    });

    if (confirmed) {
      await deleteItem();
    }
  };

  // With ref
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleDeleteWithRef = async () => {
    const confirmed = await popconfirm.show({
      target: deleteButtonRef,
      message: 'Silmek istediğinize emin misiniz?',
      placement: 'top',
    });

    if (confirmed) {
      await deleteItem();
    }
  };

  // Danger variant (red confirm button)
  const handleDangerDelete = async (e: React.MouseEvent) => {
    const confirmed = await popconfirm.danger(
      e.currentTarget as HTMLElement,
      'Bu işlem geri alınamaz!',
      { title: 'Dikkat' }
    );

    if (confirmed) {
      await permanentDelete();
    }
  };

  // Custom placement and text
  const handleCustom = async (e: React.MouseEvent) => {
    const confirmed = await popconfirm.show({
      target: e.currentTarget as HTMLElement,
      title: 'Onay Gerekli',
      message: 'Bu kaydı arşivlemek istediğinize emin misiniz?',
      confirmText: 'Evet, Arşivle',
      cancelText: 'Hayır',
      placement: 'left',
      icon: <ArchiveIcon className="w-5 h-5 text-yellow-500" />,
    });

    if (confirmed) {
      await archiveItem();
    }
  };

  // In a table row
  return (
    <table>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              <button onClick={(e) => handleDelete(e)}>
                🗑️ Sil
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/usePopconfirm.ts

import { useCallback, useContext, useState } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import type { IPopconfirmOptions } from '../core/types';

export function usePopconfirm(): IUsePopconfirmReturn {
  const context = useContext(FeedbackContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!context) {
    throw new Error('usePopconfirm must be used within FeedbackProvider');
  }

  const { manager } = context;

  const show = useCallback(
    (options: IPopconfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setIsOpen(true);

        const id = manager.add('popconfirm', {
          confirmText: 'Evet',
          cancelText: 'Hayır',
          confirmVariant: 'primary',
          placement: 'top',
          showArrow: true,
          offset: 8,
          closeOnClickOutside: true,
          ...options,
          onConfirm: () => {
            manager.remove(id);
            setIsOpen(false);
            resolve(true);
          },
          onCancel: () => {
            manager.remove(id);
            setIsOpen(false);
            resolve(false);
          },
        });
      });
    },
    [manager]
  );

  const danger = useCallback(
    (
      target: HTMLElement | React.RefObject<HTMLElement>,
      message: string,
      options?: Partial<IPopconfirmOptions>
    ): Promise<boolean> => {
      return show({
        target,
        message,
        confirmVariant: 'danger',
        confirmText: 'Sil',
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />,
        ...options,
      });
    },
    [show]
  );

  const close = useCallback((): void => {
    manager.removeAll('popconfirm');
    setIsOpen(false);
  }, [manager]);

  return {
    show,
    danger,
    close,
    isOpen,
  };
}
```

## Component Architecture

### Popconfirm Component (Headless)

```typescript
// src/components/Popconfirm/Popconfirm.tsx

import React, { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import { calculatePosition, getArrowStyles } from '../../utils/positioning';
import type { IPopconfirmOptions, FeedbackStatus } from '../../core/types';

export interface IPopconfirmProps extends IPopconfirmOptions {
  status: FeedbackStatus;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Popconfirm = memo(
  forwardRef<HTMLDivElement, IPopconfirmProps>(function Popconfirm(props, ref) {
    const {
      target,
      message,
      title,
      confirmText = 'Evet',
      cancelText = 'Hayır',
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
      testId,
    } = props;

    const popconfirmRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [actualPlacement, setActualPlacement] = useState(placement);
    const [isVisible, setIsVisible] = useState(false);

    // Get target element
    const getTargetElement = useCallback((): HTMLElement | null => {
      if (!target) return null;
      if ('current' in target) return target.current;
      return target;
    }, [target]);

    // Calculate position
    useEffect(() => {
      const targetEl = getTargetElement();
      if (!targetEl || !popconfirmRef.current) return;

      const updatePosition = () => {
        const result = calculatePosition(
          targetEl,
          popconfirmRef.current!,
          placement,
          offset
        );
        setPosition(result.position);
        setActualPlacement(result.placement);
      };

      updatePosition();

      // Update on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [getTargetElement, placement, offset, status]);

    // Animation
    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        requestAnimationFrame(() => setIsVisible(true));
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    // Click outside handler
    useEffect(() => {
      if (!closeOnClickOutside) return;

      const handleClickOutside = (e: MouseEvent) => {
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

    // ESC key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const arrowStyles = getArrowStyles(actualPlacement);

    return (
      <div
        ref={popconfirmRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'popconfirm-title' : undefined}
        aria-describedby="popconfirm-message"
        data-testid={testId}
        className={cn(
          'fixed z-[10000] bg-white dark:bg-gray-800 rounded-lg shadow-lg',
          'border border-gray-200 dark:border-gray-700',
          'p-4 min-w-[200px] max-w-[300px]',
          'transition-all duration-150',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className
        )}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {/* Arrow */}
        {showArrow && (
          <div
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
          {icon && (
            <span className="flex-shrink-0 mt-0.5">{icon}</span>
          )}

          <div className="flex-1">
            {/* Title */}
            {title && (
              <h3
                id="popconfirm-title"
                className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1"
              >
                {title}
              </h3>
            )}

            {/* Message */}
            <p
              id="popconfirm-message"
              className="text-sm text-gray-600 dark:text-gray-400 mb-3"
            >
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-2 justify-end">
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
```

### Position Calculation Utility

```typescript
// src/utils/positioning.ts

export interface PositionResult {
  position: { top: number; left: number };
  placement: PopconfirmPlacement;
}

export function calculatePosition(
  target: HTMLElement,
  popover: HTMLElement,
  preferredPlacement: PopconfirmPlacement,
  offset: number
): PositionResult {
  const targetRect = target.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Calculate position based on placement
  let top = 0;
  let left = 0;
  let finalPlacement = preferredPlacement;

  const positions = {
    top: {
      top: targetRect.top - popoverRect.height - offset,
      left: targetRect.left + (targetRect.width - popoverRect.width) / 2,
    },
    bottom: {
      top: targetRect.bottom + offset,
      left: targetRect.left + (targetRect.width - popoverRect.width) / 2,
    },
    left: {
      top: targetRect.top + (targetRect.height - popoverRect.height) / 2,
      left: targetRect.left - popoverRect.width - offset,
    },
    right: {
      top: targetRect.top + (targetRect.height - popoverRect.height) / 2,
      left: targetRect.right + offset,
    },
  };

  // Get base placement (without -start/-end)
  const basePlacement = preferredPlacement.split('-')[0] as keyof typeof positions;
  const pos = positions[basePlacement];

  top = pos.top;
  left = pos.left;

  // Handle start/end alignment
  if (preferredPlacement.includes('-start')) {
    if (basePlacement === 'top' || basePlacement === 'bottom') {
      left = targetRect.left;
    } else {
      top = targetRect.top;
    }
  } else if (preferredPlacement.includes('-end')) {
    if (basePlacement === 'top' || basePlacement === 'bottom') {
      left = targetRect.right - popoverRect.width;
    } else {
      top = targetRect.bottom - popoverRect.height;
    }
  }

  // Flip if outside viewport
  if (top < 0 && basePlacement === 'top') {
    top = positions.bottom.top;
    finalPlacement = preferredPlacement.replace('top', 'bottom') as PopconfirmPlacement;
  }
  if (top + popoverRect.height > viewport.height && basePlacement === 'bottom') {
    top = positions.top.top;
    finalPlacement = preferredPlacement.replace('bottom', 'top') as PopconfirmPlacement;
  }

  // Constrain to viewport
  top = Math.max(8, Math.min(top, viewport.height - popoverRect.height - 8));
  left = Math.max(8, Math.min(left, viewport.width - popoverRect.width - 8));

  return {
    position: { top, left },
    placement: finalPlacement,
  };
}

export function getArrowStyles(placement: PopconfirmPlacement) {
  const base = placement.split('-')[0];

  const styles: Record<string, { className: string; style: React.CSSProperties }> = {
    top: {
      className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t-0 border-l-0',
      style: { bottom: -4 },
    },
    bottom: {
      className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0',
      style: { top: -4 },
    },
    left: {
      className: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t-0 border-r-0',
      style: { right: -4 },
    },
    right: {
      className: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b-0 border-l-0',
      style: { left: -4 },
    },
  };

  return styles[base] || styles.top;
}
```

## Accessibility Requirements

### ARIA Attributes

```typescript
role="alertdialog"
aria-modal="true"
aria-labelledby="popconfirm-title"
aria-describedby="popconfirm-message"
```

### Keyboard Support

| Key | Action |
|-----|--------|
| Enter | Confirm (when confirm button focused) |
| Escape | Cancel and close |
| Tab | Navigate between buttons |

## Testing Checklist

### Unit Tests

```typescript
describe('usePopconfirm', () => {
  it('should resolve true on confirm', async () => {});
  it('should resolve false on cancel', async () => {});
  it('should show danger variant', async () => {});
  it('should close on ESC', async () => {});
  it('should close on click outside', async () => {});
});

describe('Popconfirm', () => {
  it('should render message', () => {});
  it('should render title', () => {});
  it('should render icon', () => {});
  it('should position correctly', () => {});
  it('should flip when near edge', () => {});
  it('should show arrow', () => {});
  it('should apply danger variant', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/usePopconfirm.ts`
- [ ] Create `src/components/Popconfirm/Popconfirm.tsx`
- [ ] Create `src/components/Popconfirm/PopconfirmContainer.tsx`
- [ ] Create `src/utils/positioning.ts`
- [ ] Add popconfirm to core types
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test all placements
- [ ] Test auto-flip behavior
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Position Calculation
❌ **Don't:** Use fixed position without scroll handling
✅ **Do:** Recalculate on scroll and resize

### 2. Click Outside
❌ **Don't:** Close when clicking target element
✅ **Do:** Exclude target from click outside detection

### 3. Z-Index
❌ **Don't:** Use arbitrary z-index
✅ **Do:** Use Z_INDEX constant, higher than other overlays

### 4. Memory Leak
❌ **Don't:** Forget to remove event listeners
✅ **Do:** Clean up in useEffect return

## Notes

- Only 1 popconfirm visible at a time
- Auto-flips when near viewport edge
- Uses floating position (not portal for simplicity)
- Arrow points to trigger element
- SSR safe
