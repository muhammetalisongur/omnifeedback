# Design: Modal System

## Overview
Implement a flexible modal/dialog system with focus management, accessibility, and full customization support.

## Goals
- Fully accessible modal dialogs
- Focus trapping within modal
- Keyboard navigation (ESC to close)
- Backdrop click handling
- Prevent body scroll when open
- Support multiple sizes
- Custom header/footer
- Nested modals support
- Work with all UI library adapters

## Modal API

### useModal Hook Interface

```typescript
// src/hooks/useModal.ts

export interface IUseModalReturn {
  /** Open modal with full options */
  open: (options: IModalOptions) => string;
  
  /** Close specific modal */
  close: (id: string) => void;
  
  /** Close all modals */
  closeAll: () => void;
  
  /** Update modal content */
  update: (id: string, options: Partial<IModalOptions>) => void;
  
  /** Check if any modal is open */
  isOpen: boolean;
  
  /** Get current open modal IDs */
  openModals: string[];
}
```

### Modal Options

```typescript
// From src/core/types.ts

export interface IModalOptions extends IBaseFeedbackOptions {
  /** Modal title */
  title?: React.ReactNode;
  /** Modal content (required) */
  content: React.ReactNode;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Show close button in header */
  closable?: boolean;
  /** Close when clicking backdrop */
  closeOnBackdropClick?: boolean;
  /** Close when pressing ESC */
  closeOnEscape?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Custom header (replaces default) */
  header?: React.ReactNode;
  /** Callback when closed */
  onClose?: () => void;
  /** Callback when opened */
  onOpen?: () => void;
  /** Prevent body scroll */
  preventScroll?: boolean;
  /** Initial focus element selector */
  initialFocus?: string;
  /** Return focus element on close */
  returnFocus?: boolean;
  /** Center modal vertically */
  centered?: boolean;
  /** Allow scrolling inside modal */
  scrollBehavior?: 'inside' | 'outside';
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { modal } = useFeedback();

  // Simple modal
  const handleOpenSimple = () => {
    modal.open({
      title: 'Confirmation',
      content: <p>Are you sure you want to continue?</p>,
    });
  };

  // Modal with form
  const handleOpenForm = () => {
    const modalId = modal.open({
      title: 'Edit Profile',
      size: 'lg',
      content: <ProfileForm onSuccess={() => modal.close(modalId)} />,
      footer: null, // Form has its own buttons
      closeOnBackdropClick: false, // Prevent accidental close
    });
  };

  // Modal with footer
  const handleOpenWithFooter = () => {
    const modalId = modal.open({
      title: 'Delete Item',
      content: (
        <p>This action cannot be undone. Are you sure?</p>
      ),
      footer: (
        <div className="flex gap-2 justify-end">
          <button onClick={() => modal.close(modalId)}>
            Cancel
          </button>
          <button 
            onClick={async () => {
              await deleteItem();
              modal.close(modalId);
            }}
            className="bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      ),
    });
  };

  // Full screen modal
  const handleOpenFullscreen = () => {
    modal.open({
      title: 'Image Gallery',
      size: 'full',
      content: <ImageGallery />,
      closable: true,
    });
  };

  // Nested modals
  const handleNestedModal = () => {
    const parentId = modal.open({
      title: 'Parent Modal',
      content: (
        <div>
          <p>This is the parent modal</p>
          <button onClick={() => {
            modal.open({
              title: 'Child Modal',
              content: <p>This is a nested modal</p>,
            });
          }}>
            Open Nested Modal
          </button>
        </div>
      ),
    });
  };

  return (
    <div>
      <button onClick={handleOpenSimple}>Simple Modal</button>
      <button onClick={handleOpenForm}>Form Modal</button>
      <button onClick={handleOpenWithFooter}>Confirm Modal</button>
      <button onClick={handleOpenFullscreen}>Fullscreen Modal</button>
      <button onClick={handleNestedModal}>Nested Modal</button>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useModal.ts

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IModalOptions } from '../core/types';

export function useModal(): IUseModalReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useModal must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get open modals from store
  const modals = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'modal' && item.status !== 'removed'
    )
  );

  const openModals = useMemo(
    () => modals.map((m) => m.id),
    [modals]
  );

  const isOpen = openModals.length > 0;

  const open = useCallback(
    (options: IModalOptions): string => {
      const id = manager.add('modal', {
        closable: true,
        closeOnBackdropClick: true,
        closeOnEscape: true,
        preventScroll: true,
        returnFocus: true,
        centered: false,
        scrollBehavior: 'inside',
        size: 'md',
        ...options,
      });

      // Call onOpen callback
      options.onOpen?.();

      return id;
    },
    [manager]
  );

  const close = useCallback(
    (id: string): void => {
      const modal = manager.get(id);
      if (modal) {
        (modal.options as IModalOptions).onClose?.();
        manager.remove(id);
      }
    },
    [manager]
  );

  const closeAll = useCallback((): void => {
    openModals.forEach((id) => close(id));
  }, [openModals, close]);

  const update = useCallback(
    (id: string, options: Partial<IModalOptions>): void => {
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
    openModals,
  };
}
```

## Component Architecture

### Modal Component (Headless)

```typescript
// src/components/Modal/Modal.tsx

import React, {
  memo,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { cn } from '../../utils/classNames';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IModalOptions, FeedbackStatus } from '../../core/types';

export interface IModalProps extends IModalOptions {
  /** Current animation status */
  status: FeedbackStatus;
  /** Called to close the modal */
  onRequestClose: () => void;
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full h-full m-0 rounded-none',
};

export const Modal = memo(
  forwardRef<HTMLDivElement, IModalProps>(function Modal(props, ref) {
    const {
      title,
      content,
      size = 'md',
      closable = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
      header,
      preventScroll = true,
      initialFocus,
      returnFocus = true,
      centered = false,
      scrollBehavior = 'inside',
      status,
      onRequestClose,
      className,
      style,
      testId,
    } = props;

    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Store previous focus
    useEffect(() => {
      if (returnFocus) {
        previousFocusRef.current = document.activeElement as HTMLElement;
      }
    }, [returnFocus]);

    // Focus trap
    useFocusTrap(modalRef, {
      enabled: status === 'visible',
      initialFocus,
    });

    // Scroll lock
    useScrollLock(preventScroll && status === 'visible');

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

    // Return focus on close
    useEffect(() => {
      return () => {
        if (returnFocus && previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }, [returnFocus]);

    // Backdrop click handler
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onRequestClose();
        }
      },
      [closeOnBackdropClick, onRequestClose]
    );

    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        data-testid={testId}
        className={cn(
          // Backdrop
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          // Animation
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0',
          centered && 'items-center',
        )}
        style={{ zIndex: 10000 }}
        onClick={handleBackdropClick}
      >
        {/* Modal Panel */}
        <div
          ref={modalRef}
          className={cn(
            'relative w-full bg-white rounded-lg shadow-xl',
            'flex flex-col',
            'transition-all duration-200',
            isVisible && !isExiting
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95',
            sizeStyles[size],
            scrollBehavior === 'inside' && 'max-h-[90vh]',
            className
          )}
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {header !== undefined ? (
            header
          ) : (
            title && (
              <div className="flex items-center justify-between p-4 border-b">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold"
                >
                  {title}
                </h2>
                {closable && (
                  <button
                    type="button"
                    onClick={onRequestClose}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            )
          )}

          {/* Content */}
          <div
            className={cn(
              'flex-1 p-4',
              scrollBehavior === 'inside' && 'overflow-y-auto'
            )}
          >
            {content}
          </div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

Modal.displayName = 'Modal';
```

### Modal Container

```typescript
// src/components/Modal/ModalContainer.tsx

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../providers/FeedbackProvider';
import { getFeedbackManager } from '../../core/FeedbackManager';
import { Z_INDEX } from '../../utils/constants';

export const ModalContainer = memo(function ModalContainer() {
  const adapter = useAdapter();
  const ModalComponent = adapter.ModalComponent;
  const manager = getFeedbackManager();

  // Get modals from store
  const modals = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'modal' && item.status !== 'removed'
    )
  );

  // Don't render if no modals
  if (modals.length === 0) {
    return null;
  }

  // Check for SSR
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      style={{ zIndex: Z_INDEX.MODAL }}
      className="fixed inset-0 pointer-events-none"
    >
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          className="pointer-events-auto"
          style={{ zIndex: Z_INDEX.MODAL + index }}
        >
          <ModalComponent
            {...modal.options}
            status={modal.status}
            onRequestClose={() => manager.remove(modal.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
});

ModalContainer.displayName = 'ModalContainer';
```

## Focus Management

### useFocusTrap Hook

```typescript
// src/hooks/useFocusTrap.ts

import { useEffect, RefObject } from 'react';

interface FocusTrapOptions {
  enabled?: boolean;
  initialFocus?: string;
}

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  options: FocusTrapOptions = {}
): void {
  const { enabled = true, initialFocus } = options;

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements
    const getFocusableElements = () => {
      return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
      ).filter((el) => el.offsetParent !== null);
    };

    // Set initial focus
    const setInitialFocus = () => {
      const elements = getFocusableElements();

      if (initialFocus) {
        const target = container.querySelector<HTMLElement>(initialFocus);
        if (target) {
          target.focus();
          return;
        }
      }

      // Focus first focusable element
      if (elements.length > 0) {
        elements[0].focus();
      } else {
        // Focus container itself
        container.setAttribute('tabindex', '-1');
        container.focus();
      }
    };

    // Handle tab key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Set initial focus after render
    requestAnimationFrame(setInitialFocus);

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, containerRef, initialFocus]);
}
```

### useScrollLock Hook

```typescript
// src/hooks/useScrollLock.ts

import { useEffect } from 'react';

export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    // Save current scroll position and overflow
    const scrollY = window.scrollY;
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      // Restore original style
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [enabled]);
}
```

## Accessibility Requirements

### ARIA Attributes

```typescript
// Modal container must have:
role="dialog"
aria-modal="true"
aria-labelledby="modal-title"  // When title exists
aria-describedby="modal-desc"  // Optional

// Close button must have:
aria-label="Close modal"
```

### Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Move focus to next focusable element |
| Shift + Tab | Move focus to previous focusable element |
| Escape | Close modal (if closeOnEscape is true) |
| Enter/Space | Activate focused button |

### Focus Management

1. Focus first focusable element when modal opens
2. Trap focus within modal (Tab cycles through modal only)
3. Return focus to trigger element when modal closes

## Testing Checklist

### Unit Tests

```typescript
describe('useModal', () => {
  it('should open modal with default options', () => {});
  it('should close specific modal', () => {});
  it('should close all modals', () => {});
  it('should update modal content', () => {});
  it('should track open modals', () => {});
  it('should call onOpen callback', () => {});
  it('should call onClose callback', () => {});
});

describe('Modal', () => {
  it('should render title', () => {});
  it('should render content', () => {});
  it('should render footer', () => {});
  it('should render custom header', () => {});
  it('should close on ESC', () => {});
  it('should close on backdrop click', () => {});
  it('should not close on content click', () => {});
  it('should trap focus', () => {});
  it('should return focus on close', () => {});
  it('should prevent body scroll', () => {});
  it('should have correct ARIA attributes', () => {});
  it('should apply size styles', () => {});
});

describe('ModalContainer', () => {
  it('should render in portal', () => {});
  it('should stack nested modals', () => {});
  it('should apply correct z-index', () => {});
});
```

### Integration Tests

```typescript
describe('Modal Integration', () => {
  it('should handle modal lifecycle', async () => {});
  it('should handle nested modals', () => {});
  it('should handle rapid open/close', () => {});
  it('should work with all adapters', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useModal.ts`
- [ ] Create `src/hooks/useFocusTrap.ts`
- [ ] Create `src/hooks/useScrollLock.ts`
- [ ] Create `src/components/Modal/Modal.tsx`
- [ ] Create `src/components/Modal/ModalContainer.tsx`
- [ ] Create `src/components/Modal/index.ts`
- [ ] Add modal animations to `src/styles/animations.css`
- [ ] Write unit tests for useModal hook
- [ ] Write unit tests for Modal component
- [ ] Write unit tests for focus trap
- [ ] Write integration tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Focus Escape
❌ **Don't:** Let focus escape modal via Tab
✅ **Do:** Implement proper focus trap

### 2. Scroll Bleed
❌ **Don't:** Allow background scroll when modal open
✅ **Do:** Use scroll lock hook

### 3. Z-Index Stacking
❌ **Don't:** Use same z-index for all modals
✅ **Do:** Increment z-index for nested modals

### 4. Missing ARIA
❌ **Don't:** Forget role and aria-modal
✅ **Do:** Always include proper ARIA attributes

### 5. Memory Leaks
❌ **Don't:** Forget to clean up event listeners
✅ **Do:** Remove listeners in useEffect cleanup

## Notes

- Only 1 modal visible by default (configurable)
- Nested modals supported but discouraged
- Backdrop always present when modal open
- Focus returns to trigger element on close
- SSR safe - checks for `document` before portal render
