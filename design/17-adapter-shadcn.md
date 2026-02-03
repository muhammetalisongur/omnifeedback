# Design: shadcn/ui Adapter

## Overview
Implement the shadcn/ui adapter using Radix UI primitives with Tailwind CSS styling.

## Goals
- Integrate with Radix UI Toast and Dialog
- Match shadcn/ui design language
- Support dark mode via CSS variables
- Maintain shadcn component patterns
- Tree-shakeable adapter

## Dependencies

```json
{
  "peerDependencies": {
    "@radix-ui/react-toast": "^1.1.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-alert-dialog": "^1.0.0",
    "@radix-ui/react-progress": "^1.0.0"
  }
}
```

## Adapter Structure

```typescript
// src/adapters/shadcn/index.ts

import type { IFeedbackAdapter } from '../types';
import { ShadcnToast } from './Toast';
import { ShadcnToastContainer } from './ToastContainer';
import { ShadcnModal } from './Modal';
import { ShadcnLoading } from './Loading';
import { ShadcnLoadingOverlay } from './LoadingOverlay';
import { ShadcnAlert } from './Alert';
import { ShadcnProgress } from './Progress';
import { ShadcnConfirm } from './Confirm';

export const shadcnAdapter: IFeedbackAdapter = {
  name: 'shadcn',
  version: '1.0.0',
  
  // Components
  ToastComponent: ShadcnToast,
  ToastContainerComponent: ShadcnToastContainer,
  ModalComponent: ShadcnModal,
  LoadingComponent: ShadcnLoading,
  LoadingOverlayComponent: ShadcnLoadingOverlay,
  AlertComponent: ShadcnAlert,
  ProgressComponent: ShadcnProgress,
  ConfirmComponent: ShadcnConfirm,
  
  // Theme
  getThemeStyles: () => ({
    '--toast-bg': 'hsl(var(--background))',
    '--toast-fg': 'hsl(var(--foreground))',
    '--toast-border': 'hsl(var(--border))',
  }),
  
  // Dark mode detection
  isDarkMode: () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  },
  
  // Animation config
  animations: {
    enter: 'animate-in slide-in-from-right fade-in',
    exit: 'animate-out slide-out-to-right fade-out',
    duration: 200,
  },
};

export default shadcnAdapter;
```

## Toast Component

```typescript
// src/adapters/shadcn/Toast.tsx

import React, { memo, forwardRef } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '../../utils/classNames';
import type { IToastProps } from '../../components/Toast/Toast';

const variantStyles = {
  default: 'border bg-background text-foreground',
  success: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100',
  error: 'border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
  info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100',
};

export const ShadcnToast = memo(
  forwardRef<HTMLLIElement, IToastProps>(function ShadcnToast(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      dismissible = true,
      icon,
      action,
      status,
      onDismiss,
      className,
    } = props;

    const isOpen = status !== 'removed' && status !== 'exiting';

    return (
      <ToastPrimitive.Root
        ref={ref}
        open={isOpen}
        onOpenChange={(open) => !open && onDismiss?.()}
        className={cn(
          'group pointer-events-auto relative flex w-full items-center justify-between',
          'space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg',
          'transition-all',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0',
          'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
          variantStyles[variant],
          className
        )}
      >
        <div className="flex items-start gap-3">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <div className="grid gap-1">
            {title && (
              <ToastPrimitive.Title className="text-sm font-semibold">
                {title}
              </ToastPrimitive.Title>
            )}
            <ToastPrimitive.Description className="text-sm opacity-90">
              {message}
            </ToastPrimitive.Description>
          </div>
        </div>

        {action && (
          <ToastPrimitive.Action
            altText={action.label}
            onClick={action.onClick}
            className={cn(
              'inline-flex h-8 shrink-0 items-center justify-center rounded-md',
              'border bg-transparent px-3 text-sm font-medium',
              'transition-colors hover:bg-secondary focus:outline-none focus:ring-2'
            )}
          >
            {action.label}
          </ToastPrimitive.Action>
        )}

        {dismissible && (
          <ToastPrimitive.Close
            className={cn(
              'absolute right-2 top-2 rounded-md p-1',
              'text-foreground/50 opacity-0 transition-opacity',
              'hover:text-foreground focus:opacity-100 focus:outline-none',
              'group-hover:opacity-100'
            )}
          >
            <XIcon className="h-4 w-4" />
          </ToastPrimitive.Close>
        )}
      </ToastPrimitive.Root>
    );
  })
);
```

## Modal Component

```typescript
// src/adapters/shadcn/Modal.tsx

import React, { memo, forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/classNames';
import type { IModalProps } from '../../components/Modal/Modal';

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full h-full',
};

export const ShadcnModal = memo(
  forwardRef<HTMLDivElement, IModalProps>(function ShadcnModal(props, ref) {
    const {
      title,
      content,
      size = 'md',
      closable = true,
      footer,
      header,
      status,
      onRequestClose,
      className,
    } = props;

    const isOpen = status !== 'removed' && status !== 'exiting';

    return (
      <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onRequestClose()}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              'fixed inset-0 z-50 bg-black/80',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
            )}
          />
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]',
              'gap-4 border bg-background p-6 shadow-lg duration-200',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
              'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
              'sm:rounded-lg',
              sizeStyles[size],
              className
            )}
          >
            {header !== undefined ? header : (
              title && (
                <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                  {title}
                </DialogPrimitive.Title>
              )
            )}
            
            <div className="text-sm text-muted-foreground">
              {content}
            </div>

            {footer && (
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                {footer}
              </div>
            )}

            {closable && (
              <DialogPrimitive.Close
                className={cn(
                  'absolute right-4 top-4 rounded-sm opacity-70',
                  'ring-offset-background transition-opacity hover:opacity-100',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  'disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
                )}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  })
);
```

## Progress Component

```typescript
// src/adapters/shadcn/Progress.tsx

import React, { memo, forwardRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../utils/classNames';
import type { IProgressProps } from '../../components/Progress/LinearProgress';

export const ShadcnProgress = memo(
  forwardRef<HTMLDivElement, IProgressProps>(function ShadcnProgress(props, ref) {
    const {
      value,
      max = 100,
      label,
      showPercentage,
      indeterminate,
      className,
    } = props;

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="w-full">
        {(label || showPercentage) && (
          <div className="flex justify-between mb-2 text-sm">
            {label && <span className="text-muted-foreground">{label}</span>}
            {showPercentage && !indeterminate && (
              <span className="text-muted-foreground">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
            className
          )}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              'h-full bg-primary transition-all',
              indeterminate && 'animate-indeterminate'
            )}
            style={{ 
              transform: indeterminate 
                ? undefined 
                : `translateX(-${100 - percentage}%)` 
            }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  })
);
```

## Confirm Component

```typescript
// src/adapters/shadcn/Confirm.tsx

import React, { memo, forwardRef } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '../../utils/classNames';
import type { IConfirmProps } from '../../components/Confirm/Confirm';

export const ShadcnConfirm = memo(
  forwardRef<HTMLDivElement, IConfirmProps>(function ShadcnConfirm(props, ref) {
    const {
      message,
      title,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      confirmVariant = 'primary',
      icon,
      onConfirm,
      onCancel,
      status,
    } = props;

    const isOpen = status !== 'removed' && status !== 'exiting';

    return (
      <AlertDialogPrimitive.Root open={isOpen}>
        <AlertDialogPrimitive.Portal>
          <AlertDialogPrimitive.Overlay
            className={cn(
              'fixed inset-0 z-50 bg-black/80',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
            )}
          />
          <AlertDialogPrimitive.Content
            ref={ref}
            className={cn(
              'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
              'gap-4 border bg-background p-6 shadow-lg duration-200',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'sm:rounded-lg'
            )}
          >
            {icon && (
              <div className="flex justify-center mb-2">
                {icon}
              </div>
            )}
            
            <AlertDialogPrimitive.Title className="text-lg font-semibold text-center">
              {title || 'Are you sure?'}
            </AlertDialogPrimitive.Title>
            
            <AlertDialogPrimitive.Description className="text-sm text-muted-foreground text-center">
              {message}
            </AlertDialogPrimitive.Description>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
              <AlertDialogPrimitive.Cancel
                onClick={onCancel}
                className={cn(
                  'mt-2 sm:mt-0 inline-flex h-10 items-center justify-center rounded-md',
                  'border border-input bg-background px-4 py-2',
                  'text-sm font-medium ring-offset-background transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
              >
                {cancelText}
              </AlertDialogPrimitive.Cancel>
              
              <AlertDialogPrimitive.Action
                onClick={onConfirm}
                className={cn(
                  'inline-flex h-10 items-center justify-center rounded-md px-4 py-2',
                  'text-sm font-medium ring-offset-background transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  confirmVariant === 'danger'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {confirmText}
              </AlertDialogPrimitive.Action>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    );
  })
);
```

## CSS Variables

```css
/* Expected shadcn/ui CSS variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --ring: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## Implementation Checklist

- [ ] Create `src/adapters/shadcn/Toast.tsx`
- [ ] Create `src/adapters/shadcn/ToastContainer.tsx`
- [ ] Create `src/adapters/shadcn/Modal.tsx`
- [ ] Create `src/adapters/shadcn/Loading.tsx`
- [ ] Create `src/adapters/shadcn/LoadingOverlay.tsx`
- [ ] Create `src/adapters/shadcn/Alert.tsx`
- [ ] Create `src/adapters/shadcn/Progress.tsx`
- [ ] Create `src/adapters/shadcn/Confirm.tsx`
- [ ] Create `src/adapters/shadcn/index.ts`
- [ ] Write integration tests
- [ ] Test dark mode
- [ ] Update IMPLEMENTATION.md

## Notes

- Uses Radix UI primitives for accessibility
- Follows shadcn/ui animation patterns
- CSS variables must be defined in user's app
- Tailwind CSS required
