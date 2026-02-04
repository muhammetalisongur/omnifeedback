/**
 * ShadcnToast - shadcn/ui adapter toast component
 * Uses Radix UI Toast primitives with shadcn styling
 */

import { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastProps } from '../types';

/**
 * Variant styles matching shadcn/ui design language
 */
const variantStyles = {
  default: 'border bg-background text-foreground',
  success:
    'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100',
  error: 'border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100',
  warning:
    'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
  info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100',
};

/**
 * Close icon component
 */
function CloseIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * ShadcnToast component
 * Renders toast with shadcn/ui styling
 */
export const ShadcnToast = memo(
  forwardRef<HTMLDivElement, IAdapterToastProps>(function ShadcnToast(props, ref): JSX.Element {
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

    useEffect((): void => {
      if (status === 'entering' || status === 'visible') {
        requestAnimationFrame((): void => setIsVisible(true));
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    const handleTransitionEnd = useCallback((): void => {
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
        data-state={isVisible ? 'open' : 'closed'}
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          'group pointer-events-auto relative flex w-full items-center justify-between',
          'space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg',
          'transition-all duration-200',
          isVisible
            ? 'animate-in slide-in-from-right-full fade-in-0'
            : 'animate-out slide-out-to-right-full fade-out-80',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        <div className="flex items-start gap-3">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <div className="grid gap-1">
            {title && <p className="text-sm font-semibold">{title}</p>}
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={cn(
              'inline-flex h-8 shrink-0 items-center justify-center rounded-md',
              'border bg-transparent px-3 text-sm font-medium',
              'transition-colors hover:bg-secondary focus:outline-none focus:ring-2'
            )}
          >
            {action.label}
          </button>
        )}

        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'absolute right-2 top-2 rounded-md p-1',
              'text-foreground/50 opacity-0 transition-opacity',
              'hover:text-foreground focus:opacity-100 focus:outline-none',
              'group-hover:opacity-100'
            )}
            aria-label="Dismiss"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  })
);

ShadcnToast.displayName = 'ShadcnToast';
