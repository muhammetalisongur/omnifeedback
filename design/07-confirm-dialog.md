# Design: Confirm Dialog

## Overview
Implement a promise-based confirmation dialog for user decisions with customizable actions.

## Goals
- Promise-based API (await result)
- Danger variant for destructive actions
- Custom confirm/cancel text
- Loading state on confirm
- Keyboard support (Enter to confirm, ESC to cancel)
- Work with all UI library adapters

## Confirm API

### useConfirm Hook Interface

```typescript
export interface IUseConfirmReturn {
  /** Show confirm dialog and await response */
  show: (options: IConfirmShowOptions) => Promise<boolean>;
  
  /** Show danger confirm for destructive actions */
  danger: (message: string, options?: Partial<IConfirmShowOptions>) => Promise<boolean>;
  
  /** Close confirm without response */
  close: (id: string) => void;
}

export interface IConfirmShowOptions {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  icon?: React.ReactNode;
}
```

### Confirm Options (Internal)

```typescript
export interface IConfirmOptions extends IBaseFeedbackOptions {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  confirmLoading?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { confirm, toast } = useFeedback();

  // Basic confirm
  const handleBasic = async () => {
    const confirmed = await confirm.show({
      message: 'Are you sure you want to proceed?',
    });

    if (confirmed) {
      toast.success('Action confirmed!');
    }
  };

  // With title
  const handleWithTitle = async () => {
    const confirmed = await confirm.show({
      title: 'Confirm Subscription',
      message: 'You will be charged $9.99/month. Continue?',
      confirmText: 'Subscribe',
      cancelText: 'Maybe Later',
    });

    if (confirmed) {
      await subscribeUser();
    }
  };

  // Danger confirm for deletion
  const handleDelete = async () => {
    const confirmed = await confirm.danger(
      'This will permanently delete all your data. This action cannot be undone.',
      {
        title: 'Delete Account',
        confirmText: 'Delete My Account',
      }
    );

    if (confirmed) {
      await deleteAccount();
      redirect('/goodbye');
    }
  };

  // With custom icon
  const handleLogout = async () => {
    const confirmed = await confirm.show({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      icon: <LogoutIcon className="w-6 h-6 text-gray-400" />,
    });

    if (confirmed) {
      await logout();
    }
  };

  return (
    <div>
      <button onClick={handleBasic}>Basic Confirm</button>
      <button onClick={handleWithTitle}>Subscribe</button>
      <button onClick={handleDelete}>Delete Account</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useConfirm.ts

import { useCallback, useContext } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import type { IConfirmOptions } from '../core/types';

export interface IConfirmShowOptions {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  icon?: React.ReactNode;
}

export interface IUseConfirmReturn {
  show: (options: IConfirmShowOptions) => Promise<boolean>;
  danger: (message: string, options?: Partial<IConfirmShowOptions>) => Promise<boolean>;
  close: (id: string) => void;
}

export function useConfirm(): IUseConfirmReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useConfirm must be used within FeedbackProvider');
  }

  const { manager } = context;

  const show = useCallback(
    (options: IConfirmShowOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        const id = manager.add('confirm', {
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          confirmVariant: 'primary',
          ...options,
          onConfirm: () => {
            manager.remove(id);
            resolve(true);
          },
          onCancel: () => {
            manager.remove(id);
            resolve(false);
          },
        } as IConfirmOptions);
      });
    },
    [manager]
  );

  const danger = useCallback(
    (message: string, options?: Partial<IConfirmShowOptions>): Promise<boolean> => {
      return show({
        message,
        title: 'Are you sure?',
        confirmText: 'Delete',
        confirmVariant: 'danger',
        ...options,
      });
    },
    [show]
  );

  const close = useCallback(
    (id: string): void => {
      manager.remove(id);
    },
    [manager]
  );

  return {
    show,
    danger,
    close,
  };
}
```

## Component Architecture

### Confirm Component

```typescript
// src/components/Confirm/Confirm.tsx

import React, { memo, forwardRef, useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '../../utils/classNames';
import type { IConfirmOptions, FeedbackStatus } from '../../core/types';

export interface IConfirmProps extends IConfirmOptions {
  status: FeedbackStatus;
}

export const Confirm = memo(
  forwardRef<HTMLDivElement, IConfirmProps>(function Confirm(props, ref) {
    const {
      message,
      title,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      confirmLoading = false,
      icon,
      onConfirm,
      onCancel,
      status,
      className,
      testId,
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Store previous focus
    useEffect(() => {
      previousFocusRef.current = document.activeElement as HTMLElement;
      return () => {
        previousFocusRef.current?.focus();
      };
    }, []);

    // Focus confirm button on open
    useEffect(() => {
      if (status === 'visible') {
        confirmButtonRef.current?.focus();
      }
    }, [status]);

    // Handle keyboard
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleConfirm = useCallback(async () => {
      setIsLoading(true);
      try {
        await onConfirm();
      } finally {
        setIsLoading(false);
      }
    }, [onConfirm]);

    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'confirm-title' : undefined}
        aria-describedby="confirm-message"
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0',
        )}
        style={{ zIndex: 10000 }}
        onClick={onCancel}
      >
        <div
          className={cn(
            'relative w-full max-w-md bg-white rounded-lg shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          {icon && (
            <div className="flex justify-center mb-4">
              {icon}
            </div>
          )}

          {/* Title */}
          {title && (
            <h2
              id="confirm-title"
              className="text-lg font-semibold text-center mb-2"
            >
              {title}
            </h2>
          )}

          {/* Message */}
          <p
            id="confirm-message"
            className="text-gray-600 text-center mb-6"
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg',
                'border border-gray-300 text-gray-700',
                'hover:bg-gray-50 transition-colors',
                'disabled:opacity-50'
              )}
            >
              {cancelText}
            </button>

            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg',
                'font-medium transition-colors',
                'disabled:opacity-50',
                confirmVariant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner className="w-4 h-4" />
                  <span>Loading...</span>
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    );
  })
);

Confirm.displayName = 'Confirm';
```

### Confirm Container

```typescript
// src/components/Confirm/ConfirmContainer.tsx

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../providers/FeedbackProvider';
import { Z_INDEX } from '../../utils/constants';

export const ConfirmContainer = memo(function ConfirmContainer() {
  const adapter = useAdapter();
  const ConfirmComponent = adapter.ConfirmComponent;

  const confirms = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'confirm' && item.status !== 'removed'
    )
  );

  if (confirms.length === 0) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  // Only show the most recent confirm
  const latestConfirm = confirms[confirms.length - 1];

  return createPortal(
    <div style={{ zIndex: Z_INDEX.MODAL }}>
      <ConfirmComponent
        key={latestConfirm.id}
        {...latestConfirm.options}
        status={latestConfirm.status}
      />
    </div>,
    document.body
  );
});

ConfirmContainer.displayName = 'ConfirmContainer';
```

## Keyboard Support

| Key | Action |
|-----|--------|
| Enter | Confirm (when confirm button focused) |
| Escape | Cancel and close |
| Tab | Navigate between buttons |

## Accessibility Requirements

```typescript
// Confirm dialog must have:
role="alertdialog"
aria-modal="true"
aria-labelledby="confirm-title"     // References title
aria-describedby="confirm-message"  // References message
```

## Testing Checklist

### Unit Tests

```typescript
describe('useConfirm', () => {
  it('should resolve true on confirm', async () => {});
  it('should resolve false on cancel', async () => {});
  it('should show danger variant', async () => {});
  it('should apply custom text', () => {});
  it('should close on ESC', async () => {});
});

describe('Confirm', () => {
  it('should render message', () => {});
  it('should render title', () => {});
  it('should render custom icon', () => {});
  it('should show loading state', () => {});
  it('should apply danger variant', () => {});
  it('should focus confirm button', () => {});
  it('should have correct ARIA attributes', () => {});
  it('should close on backdrop click', () => {});
  it('should close on ESC key', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useConfirm.ts`
- [ ] Create `src/components/Confirm/Confirm.tsx`
- [ ] Create `src/components/Confirm/ConfirmContainer.tsx`
- [ ] Create `src/components/Confirm/index.ts`
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Promise Never Resolves
❌ **Don't:** Forget to call resolve on cancel
✅ **Do:** Always resolve with true/false

### 2. Focus Management
❌ **Don't:** Leave focus on trigger after open
✅ **Do:** Move focus to confirm button

### 3. Multiple Confirms
❌ **Don't:** Allow multiple confirms at once
✅ **Do:** Show only latest confirm (max: 1)

## Notes

- Only 1 confirm dialog visible at a time
- Promise-based API for easy async/await usage
- Danger variant uses red styling
- Loading state prevents double-submit
- ESC key cancels by default
