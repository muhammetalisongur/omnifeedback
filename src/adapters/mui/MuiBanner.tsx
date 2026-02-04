/**
 * MuiBanner - Material UI adapter banner component
 * Material Design app bar / banner style notifications
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterBannerProps } from '../types';

/**
 * Variant styles for different banner types (MUI palette)
 */
const variantStyles = {
  default: 'bg-gray-800 text-white',
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-orange-600 text-white',
  info: 'bg-blue-600 text-white',
};

/**
 * Position styles
 */
const positionStyles = {
  top: 'top-0',
  bottom: 'bottom-0',
};

/**
 * MuiBanner component
 * Renders a sticky banner notification with Material Design styling
 */
export const MuiBanner = memo(
  forwardRef<HTMLDivElement, IAdapterBannerProps>(function MuiBanner(props, ref) {
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
          'fixed left-0 right-0 z-[1400]',
          'shadow-md',
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
        <div className="max-w-screen-xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {icon && <span className="flex-shrink-0">{icon}</span>}

              <div className="flex-1 min-w-0">
                {title && (
                  <p className="font-medium text-sm">{title}</p>
                )}
                <p className="text-sm opacity-90 truncate">{message}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    // MUI Button - text variant on colored background
                    'px-3 py-1.5 text-sm font-medium uppercase tracking-wide rounded',
                    'hover:bg-white/10 transition-colors'
                  )}
                >
                  {action.label}
                </button>
              )}

              {dismissible && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
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

MuiBanner.displayName = 'MuiBanner';
