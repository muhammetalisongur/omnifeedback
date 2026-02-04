/**
 * ChakraBanner - Chakra UI adapter banner component
 * Chakra UI-specific styling for sticky announcements
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterBannerProps } from '../types';

/**
 * Variant styles for different banner types (Chakra UI color scheme)
 */
const variantStyles = {
  default: 'chakra-banner-default bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white',
  success: 'chakra-banner-success bg-green-500 text-white',
  error: 'chakra-banner-error bg-red-500 text-white',
  warning: 'chakra-banner-warning bg-orange-500 text-white',
  info: 'chakra-banner-info bg-blue-500 text-white',
};

/**
 * Position styles
 */
const positionStyles = {
  top: 'top-0',
  bottom: 'bottom-0',
};

/**
 * ChakraBanner component
 * Renders a sticky banner notification with Chakra UI styling
 */
export const ChakraBanner = memo(
  forwardRef<HTMLDivElement, IAdapterBannerProps>(function ChakraBanner(props, ref) {
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
          'chakra-banner',
          'fixed left-0 right-0 z-40',
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
        <div className="chakra-banner-container container mx-auto px-4 py-3">
          <div className="chakra-banner-content flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {icon && <span className="chakra-banner-icon flex-shrink-0">{icon}</span>}

              <div className="chakra-banner-text flex-1 min-w-0">
                {title && <p className="chakra-banner-title font-semibold text-sm">{title}</p>}
                <p className="chakra-banner-message text-sm truncate">{message}</p>
              </div>
            </div>

            <div className="chakra-banner-actions flex items-center gap-2 flex-shrink-0">
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    'chakra-banner-action',
                    'px-3 py-1.5 text-sm font-medium rounded-md',
                    'bg-white/20 hover:bg-white/30',
                    'focus:outline-none focus:ring-2 focus:ring-white/50',
                    'transition-colors'
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
                    'chakra-banner-close',
                    'p-1.5 rounded-md',
                    'hover:bg-black/10 dark:hover:bg-white/10',
                    'focus:outline-none focus:ring-2 focus:ring-white/50',
                    'transition-colors'
                  )}
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

ChakraBanner.displayName = 'ChakraBanner';
