/**
 * MantineBanner - Mantine adapter banner component
 * Styled with Mantine color variables for sticky announcements
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterBannerProps } from '../types';

/**
 * Variant styles for different banner types using Mantine colors
 */
const variantStyles = {
  default:
    'bg-[var(--mantine-color-gray-1)] dark:bg-[var(--mantine-color-dark-6)] text-[var(--mantine-color-gray-9)] dark:text-[var(--mantine-color-gray-0)]',
  success: 'bg-[var(--mantine-color-green-6)] text-white',
  error: 'bg-[var(--mantine-color-red-6)] text-white',
  warning: 'bg-[var(--mantine-color-yellow-5)] text-[var(--mantine-color-dark-9)]',
  info: 'bg-[var(--mantine-color-blue-6)] text-white',
};

/**
 * Position styles
 */
const positionStyles = {
  top: 'top-0',
  bottom: 'bottom-0',
};

/**
 * MantineBanner component
 * Renders a sticky banner notification
 */
export const MantineBanner = memo(
  forwardRef<HTMLDivElement, IAdapterBannerProps>(function MantineBanner(props, ref) {
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
          'fixed left-0 right-0 z-[var(--mantine-z-index-app)]',
          'transition-transform duration-300 ease-out',
          positionStyles[position],
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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {icon && <span className="flex-shrink-0">{icon}</span>}

              <div className="flex-1 min-w-0">
                {title && (
                  <p className="font-semibold text-sm font-[var(--mantine-font-family)]">{title}</p>
                )}
                <p className="text-sm truncate font-[var(--mantine-font-family)]">{message}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded',
                    'bg-white/20 hover:bg-white/30 transition-colors',
                    'font-[var(--mantine-font-family)]'
                  )}
                >
                  {action.label}
                </button>
              )}

              {dismissible && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  aria-label="Dismiss banner"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  })
);

MantineBanner.displayName = 'MantineBanner';
