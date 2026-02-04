/**
 * ShadcnAlert - shadcn/ui adapter alert component
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterAlertProps } from '../types';

/**
 * Variant styles
 */
const variantStyles = {
  default: 'bg-background text-foreground',
  success:
    'border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600',
  error:
    'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
  warning:
    'border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600',
  info: 'border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600',
};

/**
 * Close icon
 */
function CloseIcon({ className }: { className?: string }) {
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
 * ShadcnAlert component
 */
export const ShadcnAlert = memo(
  forwardRef<HTMLDivElement, IAdapterAlertProps>(function ShadcnAlert(props, ref) {
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

    return (
      <div
        ref={ref}
        role="alert"
        data-testid={testId}
        className={cn(
          'relative w-full rounded-lg border p-4',
          '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]',
          '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
          'transition-all duration-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        {!hideIcon && icon && icon}

        <div>
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm [&_p]:leading-relaxed">{message}</div>

          {actions && actions.length > 0 && (
            <div className="mt-4 flex gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md text-sm font-medium',
                    'ring-offset-background transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    'h-9 px-3',
                    action.variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    action.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    action.variant === 'danger' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                    action.variant === 'link' && 'text-primary underline-offset-4 hover:underline',
                    !action.variant && 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
            className="absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  })
);

ShadcnAlert.displayName = 'ShadcnAlert';
