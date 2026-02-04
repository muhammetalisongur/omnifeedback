/**
 * ShadcnBanner - shadcn/ui adapter banner component
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterBannerProps } from '../types';

/**
 * Variant styles
 */
const variantStyles = {
  default: 'bg-background border-b',
  success: 'bg-green-500 text-white',
  error: 'bg-destructive text-destructive-foreground',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
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
 * ShadcnBanner component
 */
export const ShadcnBanner = memo(
  forwardRef<HTMLDivElement, IAdapterBannerProps>(function ShadcnBanner(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      position = 'top',
      dismissible = true,
      icon,
      action,
      onDismiss,
      status,
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
        role="banner"
        aria-live="polite"
        data-testid={testId}
        className={cn(
          'fixed left-0 right-0 z-40',
          'transition-transform duration-300 ease-out',
          position === 'top' ? 'top-0' : 'bottom-0',
          isVisible
            ? 'translate-y-0'
            : position === 'top'
              ? '-translate-y-full'
              : 'translate-y-full',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        <div className="container flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && <span className="flex-shrink-0">{icon}</span>}

            <div className="flex-1 min-w-0">
              {title && <p className="font-semibold text-sm">{title}</p>}
              <p className="text-sm truncate">{message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  'inline-flex h-8 items-center justify-center rounded-md px-3',
                  'text-sm font-medium bg-white/20 hover:bg-white/30 transition-colors'
                )}
              >
                {action.label}
              </button>
            )}

            {dismissible && (
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Dismiss banner"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  })
);

ShadcnBanner.displayName = 'ShadcnBanner';
