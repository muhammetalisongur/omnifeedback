# Design: Drawer System

## Overview
Implement a slide-out drawer/panel system that can appear from any edge of the screen. Alternative to modal for settings, navigation, and detail views.

## Goals
- Slide from left, right, top, or bottom
- Multiple size options
- Overlay backdrop support
- Push content option (not just overlay)
- Nested drawer support
- Focus trap and scroll lock
- Work with all UI library adapters

## Drawer Positions

```
     ┌─────────────────────────────────┐
     │           TOP DRAWER            │
     ├─────────────────────────────────┤
┌────┤                                 ├────┐
│ L  │                                 │ R  │
│ E  │                                 │ I  │
│ F  │         MAIN CONTENT            │ G  │
│ T  │                                 │ H  │
│    │                                 │ T  │
└────┤                                 ├────┘
     ├─────────────────────────────────┤
     │         BOTTOM DRAWER           │
     └─────────────────────────────────┘
```

## Drawer API

### useDrawer Hook Interface

```typescript
// src/hooks/useDrawer.ts

export interface IUseDrawerReturn {
  /** Open drawer with full options */
  open: (options: IDrawerOptions) => string;
  
  /** Close specific drawer */
  close: (id: string) => void;
  
  /** Close all drawers */
  closeAll: () => void;
  
  /** Update drawer content */
  update: (id: string, options: Partial<IDrawerOptions>) => void;
  
  /** Check if any drawer is open */
  isOpen: boolean;
  
  /** Get open drawer IDs */
  openDrawers: string[];
}
```

### Drawer Options

```typescript
// From src/core/types.ts

export interface IDrawerOptions extends IBaseFeedbackOptions {
  /** Drawer title */
  title?: React.ReactNode;
  /** Drawer content (required) */
  content: React.ReactNode;
  /** Position on screen */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Drawer size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Custom width/height (overrides size) */
  customSize?: string | number;
  /** Show overlay backdrop */
  overlay?: boolean;
  /** Overlay opacity */
  overlayOpacity?: number;
  /** Close when clicking overlay */
  closeOnOverlayClick?: boolean;
  /** Close when pressing ESC */
  closeOnEscape?: boolean;
  /** Show close button */
  closable?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Prevent body scroll */
  preventScroll?: boolean;
  /** Push main content instead of overlay */
  push?: boolean;
  /** Callback when closed */
  onClose?: () => void;
  /** Callback when opened */
  onOpen?: () => void;
}

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
```

## Size Definitions

```typescript
// Horizontal drawers (left/right)
const horizontalSizes = {
  sm: '280px',
  md: '400px',
  lg: '600px',
  xl: '800px',
  full: '100%',
};

// Vertical drawers (top/bottom)
const verticalSizes = {
  sm: '200px',
  md: '300px',
  lg: '400px',
  xl: '500px',
  full: '100%',
};
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { drawer } = useFeedback();

  // Right drawer (settings panel)
  const openSettings = () => {
    drawer.open({
      title: 'Ayarlar',
      position: 'right',
      size: 'md',
      content: <SettingsPanel />,
      footer: (
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => drawer.closeAll()}>
            İptal
          </Button>
          <Button onClick={saveSettings}>Kaydet</Button>
        </div>
      ),
    });
  };

  // Left drawer (navigation menu)
  const openNavigation = () => {
    drawer.open({
      position: 'left',
      size: 'sm',
      content: <NavigationMenu />,
      closable: false, // No close button, click overlay to close
      overlay: true,
      closeOnOverlayClick: true,
    });
  };

  // Bottom drawer (mobile actions)
  const openActions = () => {
    drawer.open({
      position: 'bottom',
      size: 'sm',
      content: (
        <div className="space-y-2">
          <button className="w-full p-3 text-left hover:bg-gray-100">
            📷 Fotoğraf Çek
          </button>
          <button className="w-full p-3 text-left hover:bg-gray-100">
            🖼️ Galeriden Seç
          </button>
          <button className="w-full p-3 text-left hover:bg-gray-100">
            📁 Dosya Seç
          </button>
        </div>
      ),
    });
  };

  // Full screen drawer
  const openFullDrawer = () => {
    drawer.open({
      title: 'Detaylı Görünüm',
      position: 'right',
      size: 'full',
      content: <DetailView />,
    });
  };

  // Custom size
  const openCustomSize = () => {
    drawer.open({
      title: 'Özel Boyut',
      position: 'right',
      customSize: '500px',
      content: <CustomContent />,
    });
  };

  // Push content (not overlay)
  const openPushDrawer = () => {
    drawer.open({
      title: 'Push Drawer',
      position: 'left',
      size: 'md',
      push: true, // Main content will slide
      overlay: false,
      content: <SidePanel />,
    });
  };

  // Nested drawers
  const openFirstDrawer = () => {
    const firstId = drawer.open({
      title: 'First Drawer',
      position: 'right',
      content: (
        <div>
          <p>This is the first drawer</p>
          <button onClick={() => {
            drawer.open({
              title: 'Second Drawer',
              position: 'right',
              size: 'sm',
              content: <p>This is nested!</p>,
            });
          }}>
            Open Nested
          </button>
        </div>
      ),
    });
  };

  return (
    <div>
      <button onClick={openSettings}>⚙️ Ayarlar</button>
      <button onClick={openNavigation}>☰ Menü</button>
      <button onClick={openActions}>Aksiyonlar</button>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useDrawer.ts

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IDrawerOptions } from '../core/types';

export function useDrawer(): IUseDrawerReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useDrawer must be used within FeedbackProvider');
  }

  const { manager } = context;

  const drawers = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'drawer' && item.status !== 'removed'
    )
  );

  const openDrawers = useMemo(
    () => drawers.map((d) => d.id),
    [drawers]
  );

  const isOpen = openDrawers.length > 0;

  const open = useCallback(
    (options: IDrawerOptions): string => {
      const id = manager.add('drawer', {
        position: 'right',
        size: 'md',
        overlay: true,
        overlayOpacity: 0.5,
        closeOnOverlayClick: true,
        closeOnEscape: true,
        closable: true,
        preventScroll: true,
        push: false,
        ...options,
      });

      options.onOpen?.();
      return id;
    },
    [manager]
  );

  const close = useCallback(
    (id: string): void => {
      const drawer = manager.get(id);
      if (drawer) {
        (drawer.options as IDrawerOptions).onClose?.();
        manager.remove(id);
      }
    },
    [manager]
  );

  const closeAll = useCallback((): void => {
    openDrawers.forEach((id) => close(id));
  }, [openDrawers, close]);

  const update = useCallback(
    (id: string, options: Partial<IDrawerOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  return {
    open,
    close,
    closeAll,
    update,
    isOpen,
    openDrawers,
  };
}
```

## Component Architecture

### Drawer Component (Headless)

```typescript
// src/components/Drawer/Drawer.tsx

import React, { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IDrawerOptions, FeedbackStatus } from '../../core/types';

export interface IDrawerProps extends IDrawerOptions {
  status: FeedbackStatus;
  onRequestClose: () => void;
}

const horizontalSizes = {
  sm: 'w-[280px]',
  md: 'w-[400px]',
  lg: 'w-[600px]',
  xl: 'w-[800px]',
  full: 'w-full',
};

const verticalSizes = {
  sm: 'h-[200px]',
  md: 'h-[300px]',
  lg: 'h-[400px]',
  xl: 'h-[500px]',
  full: 'h-full',
};

const positionStyles = {
  left: 'left-0 top-0 bottom-0',
  right: 'right-0 top-0 bottom-0',
  top: 'top-0 left-0 right-0',
  bottom: 'bottom-0 left-0 right-0',
};

const transformStyles = {
  left: { open: 'translate-x-0', closed: '-translate-x-full' },
  right: { open: 'translate-x-0', closed: 'translate-x-full' },
  top: { open: 'translate-y-0', closed: '-translate-y-full' },
  bottom: { open: 'translate-y-0', closed: 'translate-y-full' },
};

export const Drawer = memo(
  forwardRef<HTMLDivElement, IDrawerProps>(function Drawer(props, ref) {
    const {
      title,
      content,
      position = 'right',
      size = 'md',
      customSize,
      overlay = true,
      overlayOpacity = 0.5,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      closable = true,
      footer,
      preventScroll = true,
      status,
      onRequestClose,
      className,
      style,
      testId,
    } = props;

    const drawerRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';
    const isHorizontal = position === 'left' || position === 'right';

    useFocusTrap(drawerRef, { enabled: isVisible });
    useScrollLock(preventScroll && isVisible);

    // ESC key handler
    useEffect(() => {
      if (!closeOnEscape) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, onRequestClose]);

    // Overlay click handler
    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onRequestClose();
        }
      },
      [closeOnOverlayClick, onRequestClose]
    );

    // Determine size class
    const sizeClass = customSize
      ? ''
      : isHorizontal
        ? horizontalSizes[size]
        : verticalSizes[size];

    const sizeStyle = customSize
      ? isHorizontal
        ? { width: customSize }
        : { height: customSize }
      : {};

    return (
      <>
        {/* Overlay */}
        {overlay && (
          <div
            className={cn(
              'fixed inset-0 bg-black transition-opacity duration-300',
              isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            style={{ 
              zIndex: 9998,
              opacity: isVisible && !isExiting ? overlayOpacity : 0,
            }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* Drawer Panel */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          data-testid={testId}
          className={cn(
            'fixed bg-white dark:bg-gray-900 shadow-xl',
            'flex flex-col',
            'transition-transform duration-300 ease-out',
            positionStyles[position],
            sizeClass,
            isVisible && !isExiting
              ? transformStyles[position].open
              : transformStyles[position].closed,
            className
          )}
          style={{
            zIndex: 9999,
            ...sizeStyle,
            ...style,
          }}
        >
          {/* Header */}
          {(title || closable) && (
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              {title && (
                <h2
                  id="drawer-title"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  {title}
                </h2>
              )}
              {closable && (
                <button
                  type="button"
                  onClick={onRequestClose}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close drawer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div
            ref={drawerRef}
            className="flex-1 overflow-y-auto p-4"
          >
            {content}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {footer}
            </div>
          )}
        </div>
      </>
    );
  })
);

Drawer.displayName = 'Drawer';
```

### Drawer Container

```typescript
// src/components/Drawer/DrawerContainer.tsx

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../providers/FeedbackProvider';
import { getFeedbackManager } from '../../core/FeedbackManager';

export const DrawerContainer = memo(function DrawerContainer() {
  const adapter = useAdapter();
  const DrawerComponent = adapter.DrawerComponent;
  const manager = getFeedbackManager();

  const drawers = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'drawer' && item.status !== 'removed'
    )
  );

  if (drawers.length === 0) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      {drawers.map((drawer, index) => (
        <DrawerComponent
          key={drawer.id}
          {...drawer.options}
          status={drawer.status}
          onRequestClose={() => manager.remove(drawer.id)}
        />
      ))}
    </>,
    document.body
  );
});

DrawerContainer.displayName = 'DrawerContainer';
```

## Accessibility Requirements

### ARIA Attributes

```typescript
role="dialog"
aria-modal="true"
aria-labelledby="drawer-title"

// Close button
aria-label="Close drawer"
```

### Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Navigate focusable elements |
| Shift + Tab | Navigate backwards |
| Escape | Close drawer |

## Testing Checklist

### Unit Tests

```typescript
describe('useDrawer', () => {
  it('should open drawer with default options', () => {});
  it('should close specific drawer', () => {});
  it('should close all drawers', () => {});
  it('should update drawer content', () => {});
  it('should track open drawers', () => {});
  it('should call onOpen callback', () => {});
  it('should call onClose callback', () => {});
});

describe('Drawer', () => {
  it('should render content', () => {});
  it('should render title', () => {});
  it('should render footer', () => {});
  it('should render at left position', () => {});
  it('should render at right position', () => {});
  it('should render at top position', () => {});
  it('should render at bottom position', () => {});
  it('should apply size styles', () => {});
  it('should apply custom size', () => {});
  it('should close on ESC', () => {});
  it('should close on overlay click', () => {});
  it('should trap focus', () => {});
  it('should prevent body scroll', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useDrawer.ts`
- [ ] Create `src/components/Drawer/Drawer.tsx`
- [ ] Create `src/components/Drawer/DrawerContainer.tsx`
- [ ] Create `src/components/Drawer/index.ts`
- [ ] Add drawer to core types
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test all positions
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Transform Direction
❌ **Don't:** Use wrong transform for position
✅ **Do:** Match transform direction to position

### 2. Size Units
❌ **Don't:** Mix percentage and pixels incorrectly
✅ **Do:** Use consistent units per axis

### 3. Nested Drawers
❌ **Don't:** Forget z-index stacking for nested
✅ **Do:** Increment z-index for each drawer

### 4. Mobile Responsiveness
❌ **Don't:** Use fixed large sizes on mobile
✅ **Do:** Consider responsive sizes or full width

## Notes

- Default position is 'right'
- Supports nested drawers
- Push mode not implemented in v1 (future feature)
- Focus returns to trigger on close
- SSR safe
