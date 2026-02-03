# Design: Headless (Tailwind CSS) Adapter

## Overview
Implement a headless adapter using only Tailwind CSS with no external UI library dependencies. This is the default adapter and provides full styling customization.

## Goals
- Zero external UI library dependencies
- Pure Tailwind CSS styling
- Full customization via className props
- Accessible by default
- Small bundle size
- Reference implementation for other adapters

## Dependencies

```json
{
  "peerDependencies": {
    "tailwindcss": "^3.0.0"
  }
}
```

## Adapter Structure

```typescript
// src/adapters/headless/index.ts

import type { IFeedbackAdapter } from '../types';
import { HeadlessToast } from './Toast';
import { HeadlessToastContainer } from './ToastContainer';
import { HeadlessModal } from './Modal';
import { HeadlessLoading } from './Loading';
import { HeadlessLoadingOverlay } from './LoadingOverlay';
import { HeadlessAlert } from './Alert';
import { HeadlessProgress } from './Progress';
import { HeadlessConfirm } from './Confirm';

export const headlessAdapter: IFeedbackAdapter = {
  name: 'headless',
  version: '1.0.0',
  
  ToastComponent: HeadlessToast,
  ToastContainerComponent: HeadlessToastContainer,
  ModalComponent: HeadlessModal,
  LoadingComponent: HeadlessLoading,
  LoadingOverlayComponent: HeadlessLoadingOverlay,
  AlertComponent: HeadlessAlert,
  ProgressComponent: HeadlessProgress,
  ConfirmComponent: HeadlessConfirm,
  
  isDarkMode: () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark') ||
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  
  injectStyles: () => {
    // Animations are in the CSS file
  },
  
  animations: {
    enter: 'animate-slide-in-right',
    exit: 'animate-slide-out-right',
    duration: 200,
  },
};

export default headlessAdapter;

// Also export individual components for customization
export { HeadlessToast } from './Toast';
export { HeadlessModal } from './Modal';
export { HeadlessLoading } from './Loading';
export { HeadlessAlert } from './Alert';
export { HeadlessProgress } from './Progress';
export { HeadlessConfirm } from './Confirm';
```

## Toast Component

```typescript
// src/adapters/headless/Toast.tsx

import React, { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import type { IToastProps } from '../../components/Toast/Toast';

const variantStyles = {
  default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

const iconStyles = {
  default: 'text-gray-400',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export const HeadlessToast = memo(
  forwardRef<HTMLDivElement, IToastProps>(function HeadlessToast(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      action,
      status,
      onDismiss,
      onRemove,
      className,
      style,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        requestAnimationFrame(() => setIsVisible(true));
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    const handleTransitionEnd = useCallback(() => {
      if (status === 'exiting') {
        onRemove?.();
      }
    }, [status, onRemove]);

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-testid={testId}
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          'relative flex items-start gap-3 w-full max-w-sm p-4',
          'border rounded-lg shadow-lg',
          'pointer-events-auto',
          'transition-all duration-200 ease-out',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        {/* Icon */}
        {icon && (
          <span className={cn('flex-shrink-0 mt-0.5', iconStyles[variant])}>
            {icon}
          </span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold mb-1">{title}</p>
          )}
          <p className="text-sm">{message}</p>

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

        {/* Close Button */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded',
              'hover:bg-black/5 dark:hover:bg-white/5',
              'transition-colors'
            )}
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  })
);

HeadlessToast.displayName = 'HeadlessToast';
```

## Modal Component

```typescript
// src/adapters/headless/Modal.tsx

import React, { memo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { IModalProps } from '../../components/Modal/Modal';

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full h-full m-0 rounded-none',
};

export const HeadlessModal = memo(
  forwardRef<HTMLDivElement, IModalProps>(function HeadlessModal(props, ref) {
    const {
      title,
      content,
      size = 'md',
      closable = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
      header,
      status,
      onRequestClose,
      centered = true,
      scrollBehavior = 'inside',
      className,
      style,
      testId,
    } = props;

    const modalRef = useRef<HTMLDivElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useFocusTrap(modalRef, { enabled: isVisible });
    useScrollLock(isVisible);

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

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onRequestClose();
        }
      },
      [closeOnBackdropClick, onRequestClose]
    );

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          centered ? 'items-center justify-center' : 'items-start justify-center pt-20',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 10000 }}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={cn(
            'relative w-full bg-white dark:bg-gray-900',
            'rounded-lg shadow-xl',
            'flex flex-col',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            scrollBehavior === 'inside' && 'max-h-[90vh]',
            sizeStyles[size],
            className
          )}
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {header !== undefined ? header : title && (
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
              {closable && (
                <button
                  type="button"
                  onClick={onRequestClose}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={cn('flex-1 p-4', scrollBehavior === 'inside' && 'overflow-y-auto')}>
            {content}
          </div>

          {/* Footer */}
          {footer !== undefined && footer !== null && (
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

HeadlessModal.displayName = 'HeadlessModal';
```

## Loading Component

```typescript
// src/adapters/headless/Loading.tsx

import React, { memo, forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { ILoadingProps } from '../../components/Loading/Loading';

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const variantStyles = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  white: 'text-white',
};

export const HeadlessLoading = memo(
  forwardRef<HTMLDivElement, ILoadingProps>(function HeadlessLoading(props, ref) {
    const {
      message,
      spinner = 'default',
      size = 'md',
      variant = 'primary',
      status,
      className,
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
      >
        {/* Default Spinner */}
        <svg
          className={cn('animate-spin', sizeStyles[size], variantStyles[variant])}
          fill="none"
          viewBox="0 0 24 24"
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

        {message && (
          <span className={cn('text-sm', variantStyles[variant])}>
            {message}
          </span>
        )}

        <span className="sr-only">Loading{message ? `: ${message}` : ''}</span>
      </div>
    );
  })
);

HeadlessLoading.displayName = 'HeadlessLoading';
```

## Alert Component

```typescript
// src/adapters/headless/Alert.tsx

import React, { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/classNames';
import type { IAlertProps } from '../../components/Alert/Alert';

const variantStyles = {
  default: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

export const HeadlessAlert = memo(
  forwardRef<HTMLDivElement, IAlertProps>(function HeadlessAlert(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      hideIcon,
      actions,
      status,
      onRequestDismiss,
      className,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        requestAnimationFrame(() => setIsVisible(true));
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    return (
      <div
        ref={ref}
        role="alert"
        data-testid={testId}
        className={cn(
          'relative rounded-lg border p-4',
          'transition-all duration-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          variantStyles[variant],
          className
        )}
      >
        <div className="flex">
          {!hideIcon && icon && (
            <div className="flex-shrink-0 mr-3">{icon}</div>
          )}

          <div className="flex-1">
            {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
            <p className="text-sm">{message}</p>

            {actions && actions.length > 0 && (
              <div className="mt-3 flex gap-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'text-sm font-medium px-3 py-1.5 rounded',
                      action.variant === 'primary' && 'bg-current/10 hover:bg-current/20',
                      action.variant === 'secondary' && 'border hover:bg-current/5',
                      action.variant === 'link' && 'underline hover:no-underline'
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {dismissible && (
            <button
              type="button"
              onClick={onRequestDismiss}
              className="flex-shrink-0 ml-4 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  })
);

HeadlessAlert.displayName = 'HeadlessAlert';
```

## Progress Component

```typescript
// src/adapters/headless/Progress.tsx

import React, { memo, forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { IProgressProps } from '../../components/Progress/LinearProgress';

const variantColors = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

export const HeadlessProgress = memo(
  forwardRef<HTMLDivElement, IProgressProps>(function HeadlessProgress(props, ref) {
    const {
      value,
      max = 100,
      label,
      showPercentage,
      variant = 'default',
      indeterminate,
      size = 'md',
      status,
      className,
      testId,
    } = props;

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const isVisible = status === 'visible' || status === 'entering';

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        data-testid={testId}
        className={cn(
          'w-full transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
      >
        {(label || showPercentage) && (
          <div className="flex justify-between mb-1 text-sm">
            {label && <span className="text-gray-700 dark:text-gray-300">{label}</span>}
            {showPercentage && !indeterminate && (
              <span className="text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>
            )}
          </div>
        )}

        <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizeStyles[size])}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variantColors[variant],
              indeterminate && 'animate-indeterminate'
            )}
            style={{ width: indeterminate ? '50%' : `${percentage}%` }}
          />
        </div>
      </div>
    );
  })
);

HeadlessProgress.displayName = 'HeadlessProgress';
```

## Confirm Component

```typescript
// src/adapters/headless/Confirm.tsx

import React, { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import type { IConfirmProps } from '../../components/Confirm/Confirm';

export const HeadlessConfirm = memo(
  forwardRef<HTMLDivElement, IConfirmProps>(function HeadlessConfirm(props, ref) {
    const {
      message,
      title = 'Confirm',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      icon,
      onConfirm,
      onCancel,
      status,
      className,
      testId,
    } = props;

    const [loading, setLoading] = useState(false);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useEffect(() => {
      if (isVisible) {
        confirmButtonRef.current?.focus();
      }
    }, [isVisible]);

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
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }, [onConfirm]);

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        data-testid={testId}
        className={cn(
          'fixed inset-0 flex items-center justify-center p-4',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 10000 }}
        onClick={onCancel}
      >
        <div
          className={cn(
            'relative w-full max-w-md bg-white dark:bg-gray-900',
            'rounded-lg shadow-xl p-6',
            'transition-all duration-200',
            isVisible && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {icon && <div className="flex justify-center mb-4">{icon}</div>}

          <h2 id="confirm-title" className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h2>

          <p id="confirm-message" className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-600',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-800',
                'transition-colors disabled:opacity-50'
              )}
            >
              {cancelText}
            </button>

            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium',
                'transition-colors disabled:opacity-50',
                confirmVariant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {loading ? 'Loading...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  })
);

HeadlessConfirm.displayName = 'HeadlessConfirm';
```

## CSS Animations

```css
/* src/adapters/headless/styles.css */

/* Slide animations */
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-out-right {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

/* Indeterminate progress */
@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

.animate-slide-in-right {
  animation: slide-in-right 200ms ease-out;
}

.animate-slide-out-right {
  animation: slide-out-right 200ms ease-in;
}

.animate-indeterminate {
  animation: indeterminate 1.5s ease-in-out infinite;
}
```

## Implementation Checklist

- [ ] Create all component files in `src/adapters/headless/`
- [ ] Create `src/adapters/headless/index.ts`
- [ ] Create `src/adapters/headless/styles.css`
- [ ] Export individual components for customization
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test dark mode
- [ ] Verify accessibility
- [ ] Update IMPLEMENTATION.md

## Notes

- This is the default adapter
- Zero external dependencies (only Tailwind CSS)
- All components are exported for customization
- Full dark mode support via Tailwind classes
- Smallest bundle size of all adapters
