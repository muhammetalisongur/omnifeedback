# Design: Alert System

## Overview
Implement an inline alert/banner system for displaying important messages within the page content flow.

## Goals
- Inline alert components (not floating like toast)
- Multiple variants (success, error, warning, info)
- Optional dismissible alerts
- Action buttons support
- Auto-dismiss capability
- Icon customization
- Work with all UI library adapters

## Alert vs Toast

| Feature | Alert | Toast |
|---------|-------|-------|
| Position | Inline (document flow) | Fixed (overlay) |
| Use case | Page-level messages | Transient notifications |
| Persistence | Typically persistent | Auto-dismiss |
| Interaction | Part of page content | Floating above |

## Alert API

### useAlert Hook Interface

```typescript
// src/hooks/useAlert.ts

export interface IUseAlertReturn {
  /** Show alert with full options */
  show: (options: IAlertOptions) => string;
  
  /** Show success alert */
  success: (message: string, options?: Partial<IAlertOptions>) => string;
  
  /** Show error alert */
  error: (message: string, options?: Partial<IAlertOptions>) => string;
  
  /** Show warning alert */
  warning: (message: string, options?: Partial<IAlertOptions>) => string;
  
  /** Show info alert */
  info: (message: string, options?: Partial<IAlertOptions>) => string;
  
  /** Dismiss specific alert */
  dismiss: (id: string) => void;
  
  /** Dismiss all alerts */
  dismissAll: () => void;
  
  /** Update alert content */
  update: (id: string, options: Partial<IAlertOptions>) => void;
  
  /** Get all active alerts */
  alerts: IAlertItem[];
}
```

### Alert Options

```typescript
// From src/core/types.ts

export interface IAlertOptions extends IBaseFeedbackOptions {
  /** Alert message (required) */
  message: string;
  /** Alert title */
  title?: string;
  /** Visual variant */
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Hide icon */
  hideIcon?: boolean;
  /** Auto dismiss duration (0 = never) */
  duration?: number;
  /** Action buttons */
  actions?: IAlertAction[];
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Border style */
  bordered?: boolean;
  /** Filled background */
  filled?: boolean;
}

export interface IAlertAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button style */
  variant?: 'primary' | 'secondary' | 'link';
}
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { alert } = useFeedback();

  // Simple alerts
  const showSuccess = () => {
    alert.success('Your changes have been saved.');
  };

  const showError = () => {
    alert.error('Failed to process your request.');
  };

  // With title
  const showWithTitle = () => {
    alert.show({
      title: 'Update Available',
      message: 'A new version of the application is available.',
      variant: 'info',
    });
  };

  // With actions
  const showWithActions = () => {
    const id = alert.show({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item?',
      variant: 'warning',
      dismissible: false,
      actions: [
        {
          label: 'Cancel',
          onClick: () => alert.dismiss(id),
          variant: 'secondary',
        },
        {
          label: 'Delete',
          onClick: async () => {
            await deleteItem();
            alert.dismiss(id);
          },
          variant: 'primary',
        },
      ],
    });
  };

  // Auto-dismiss
  const showAutoDismiss = () => {
    alert.info('This message will disappear in 5 seconds.', {
      duration: 5000,
    });
  };

  // Custom icon
  const showCustomIcon = () => {
    alert.show({
      message: 'Custom notification',
      icon: <BellIcon className="w-5 h-5" />,
    });
  };

  // Render alerts in a specific location
  return (
    <div>
      {/* Alerts render here */}
      <AlertContainer />
      
      <div className="space-x-2">
        <button onClick={showSuccess}>Success</button>
        <button onClick={showError}>Error</button>
        <button onClick={showWithTitle}>With Title</button>
        <button onClick={showWithActions}>With Actions</button>
      </div>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useAlert.ts

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IAlertOptions, FeedbackVariant, IFeedbackItem } from '../core/types';

export function useAlert(): IUseAlertReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useAlert must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get alerts from store
  const alerts = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'alert' && item.status !== 'removed'
    )
  ) as IFeedbackItem<'alert'>[];

  const show = useCallback(
    (options: IAlertOptions): string => {
      return manager.add('alert', {
        dismissible: true,
        duration: 0,
        bordered: true,
        filled: false,
        hideIcon: false,
        ...options,
      });
    },
    [manager]
  );

  const createVariantAlert = useCallback(
    (variant: FeedbackVariant) =>
      (message: string, options?: Partial<IAlertOptions>): string => {
        return show({ message, variant, ...options });
      },
    [show]
  );

  const success = useCallback(
    (message: string, options?: Partial<IAlertOptions>) =>
      show({ message, variant: 'success', ...options }),
    [show]
  );

  const error = useCallback(
    (message: string, options?: Partial<IAlertOptions>) =>
      show({ message, variant: 'error', ...options }),
    [show]
  );

  const warning = useCallback(
    (message: string, options?: Partial<IAlertOptions>) =>
      show({ message, variant: 'warning', ...options }),
    [show]
  );

  const info = useCallback(
    (message: string, options?: Partial<IAlertOptions>) =>
      show({ message, variant: 'info', ...options }),
    [show]
  );

  const dismiss = useCallback(
    (id: string): void => {
      const alert = manager.get(id);
      if (alert) {
        (alert.options as IAlertOptions).onDismiss?.();
        manager.remove(id);
      }
    },
    [manager]
  );

  const dismissAll = useCallback((): void => {
    manager.removeAll('alert');
  }, [manager]);

  const update = useCallback(
    (id: string, options: Partial<IAlertOptions>): void => {
      manager.update(id, options);
    },
    [manager]
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
    alerts,
  };
}
```

## Component Architecture

### Alert Component (Headless)

```typescript
// src/components/Alert/Alert.tsx

import React, { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import type { IAlertOptions, FeedbackStatus } from '../../core/types';

export interface IAlertProps extends IAlertOptions {
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when dismiss clicked */
  onRequestDismiss: () => void;
}

const variantStyles = {
  default: {
    base: 'bg-gray-50 border-gray-200 text-gray-800',
    filled: 'bg-gray-100 text-gray-800',
    icon: 'text-gray-500',
  },
  success: {
    base: 'bg-green-50 border-green-200 text-green-800',
    filled: 'bg-green-100 text-green-800',
    icon: 'text-green-500',
  },
  error: {
    base: 'bg-red-50 border-red-200 text-red-800',
    filled: 'bg-red-100 text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    base: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    filled: 'bg-yellow-100 text-yellow-800',
    icon: 'text-yellow-500',
  },
  info: {
    base: 'bg-blue-50 border-blue-200 text-blue-800',
    filled: 'bg-blue-100 text-blue-800',
    icon: 'text-blue-500',
  },
};

const defaultIcons: Record<string, React.ReactNode> = {
  success: <CheckCircleIcon className="w-5 h-5" />,
  error: <XCircleIcon className="w-5 h-5" />,
  warning: <ExclamationTriangleIcon className="w-5 h-5" />,
  info: <InfoCircleIcon className="w-5 h-5" />,
  default: <InfoCircleIcon className="w-5 h-5" />,
};

export const Alert = memo(
  forwardRef<HTMLDivElement, IAlertProps>(function Alert(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      hideIcon = false,
      actions,
      bordered = true,
      filled = false,
      status,
      onRequestDismiss,
      className,
      style,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);

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

    const styles = variantStyles[variant];
    const displayIcon = hideIcon ? null : (icon ?? defaultIcons[variant]);

    return (
      <div
        ref={ref}
        role="alert"
        data-testid={testId}
        className={cn(
          'relative rounded-lg p-4',
          bordered && 'border',
          filled ? styles.filled : styles.base,
          // Animation
          'transition-all duration-200 ease-out',
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2',
          className
        )}
        style={style}
      >
        <div className="flex">
          {/* Icon */}
          {displayIcon && (
            <div className={cn('flex-shrink-0', styles.icon)}>
              {displayIcon}
            </div>
          )}

          {/* Content */}
          <div className={cn('flex-1', displayIcon && 'ml-3')}>
            {/* Title */}
            {title && (
              <h3 className="text-sm font-semibold mb-1">{title}</h3>
            )}

            {/* Message */}
            <p className="text-sm">{message}</p>

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div className="mt-3 flex gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'text-sm font-medium',
                      action.variant === 'primary' &&
                        'px-3 py-1.5 rounded bg-current/10 hover:bg-current/20',
                      action.variant === 'secondary' &&
                        'px-3 py-1.5 rounded border hover:bg-current/5',
                      action.variant === 'link' &&
                        'underline hover:no-underline'
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <button
              type="button"
              onClick={onRequestDismiss}
              className="flex-shrink-0 ml-4 p-1 rounded hover:bg-current/10 transition-colors"
              aria-label="Dismiss"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  })
);

Alert.displayName = 'Alert';
```

### Alert Container

```typescript
// src/components/Alert/AlertContainer.tsx

import React, { memo } from 'react';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../providers/FeedbackProvider';
import { getFeedbackManager } from '../../core/FeedbackManager';
import { cn } from '../../utils/classNames';

export interface IAlertContainerProps {
  /** Gap between alerts */
  gap?: number;
  /** Custom className */
  className?: string;
  /** Max alerts to show */
  maxAlerts?: number;
}

export const AlertContainer = memo(function AlertContainer({
  gap = 12,
  className,
  maxAlerts = 5,
}: IAlertContainerProps) {
  const adapter = useAdapter();
  const AlertComponent = adapter.AlertComponent;
  const manager = getFeedbackManager();

  // Get alerts from store
  const alerts = useFeedbackStore((state) =>
    Array.from(state.items.values())
      .filter((item) => item.type === 'alert' && item.status !== 'removed')
      .slice(0, maxAlerts)
  );

  // Don't render if no alerts
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ gap: `${gap}px` }}
      role="region"
      aria-label="Alerts"
    >
      {alerts.map((alert) => (
        <AlertComponent
          key={alert.id}
          {...alert.options}
          status={alert.status}
          onRequestDismiss={() => manager.remove(alert.id)}
        />
      ))}
    </div>
  );
});

AlertContainer.displayName = 'AlertContainer';
```

## Accessibility Requirements

### ARIA Attributes

```typescript
// Alert must have:
role="alert"

// Container should have:
role="region"
aria-label="Alerts"

// Dismiss button must have:
aria-label="Dismiss"
```

### Keyboard Support

- Dismiss button should be focusable
- Enter/Space should trigger dismiss
- Tab should navigate between action buttons

## Testing Checklist

### Unit Tests

```typescript
describe('useAlert', () => {
  it('should show alert with default options', () => {});
  it('should show success variant', () => {});
  it('should show error variant', () => {});
  it('should show warning variant', () => {});
  it('should show info variant', () => {});
  it('should dismiss specific alert', () => {});
  it('should dismiss all alerts', () => {});
  it('should update alert content', () => {});
  it('should auto-dismiss after duration', () => {});
  it('should call onDismiss callback', () => {});
  it('should return active alerts', () => {});
});

describe('Alert', () => {
  it('should render message', () => {});
  it('should render title', () => {});
  it('should render icon', () => {});
  it('should hide icon when hideIcon is true', () => {});
  it('should render custom icon', () => {});
  it('should render action buttons', () => {});
  it('should call action onClick', () => {});
  it('should show dismiss button when dismissible', () => {});
  it('should apply variant styles', () => {});
  it('should apply bordered style', () => {});
  it('should apply filled style', () => {});
  it('should have correct ARIA attributes', () => {});
});

describe('AlertContainer', () => {
  it('should render alerts', () => {});
  it('should apply gap between alerts', () => {});
  it('should limit alerts to maxAlerts', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useAlert.ts`
- [ ] Create `src/components/Alert/Alert.tsx`
- [ ] Create `src/components/Alert/AlertContainer.tsx`
- [ ] Create `src/components/Alert/index.ts`
- [ ] Create `src/components/Alert/icons.tsx`
- [ ] Write unit tests for useAlert hook
- [ ] Write unit tests for Alert component
- [ ] Write unit tests for AlertContainer
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Alert vs Toast Confusion
❌ **Don't:** Use alerts for transient notifications
✅ **Do:** Use alerts for persistent, inline messages

### 2. Too Many Alerts
❌ **Don't:** Show unlimited alerts
✅ **Do:** Limit to maxAlerts (default 5)

### 3. Missing Role
❌ **Don't:** Forget role="alert"
✅ **Do:** Always include proper ARIA role

### 4. Action Button Focus
❌ **Don't:** Make action buttons unfocusable
✅ **Do:** Ensure all buttons are keyboard accessible

## Notes

- Alerts are inline, not overlay (unlike toasts)
- Auto-dismiss is optional (default: off)
- Maximum 5 alerts visible by default
- AlertContainer renders where placed in component tree
- Use toast for transient notifications instead
