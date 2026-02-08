/**
 * AntdBanner - Ant Design adapter banner component
 * Implements Ant Design style sticky banner notifications
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterBannerProps } from '../types';

/**
 * Variant styles following Ant Design banner colors
 */
const variantStyles = {
  default: 'of-antd-banner-default bg-gray-100 text-gray-900',
  success: 'of-antd-banner-success bg-green-500 text-white',
  error: 'of-antd-banner-error bg-red-500 text-white',
  warning: 'of-antd-banner-warning bg-yellow-500 text-gray-900',
  info: 'of-antd-banner-info bg-blue-500 text-white',
};

/**
 * Position styles
 */
const positionStyles = {
  top: 'top-0',
  bottom: 'bottom-0',
};

/**
 * AntdBanner component
 * Renders a sticky banner notification with Ant Design styling
 */
export const AntdBanner = memo(
  forwardRef<HTMLDivElement, IAdapterBannerProps>(function AntdBanner(props, ref) {
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
        const raf = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(raf);
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
      return undefined;
    }, [status]);

    return (
      <div
        ref={ref}
        role="banner"
        aria-live="polite"
        data-testid={testId}
        className={cn(
          'of-antd-banner',
          'fixed left-0 right-0 z-[1001]',
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
        <div className="of-antd-banner-content container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="of-antd-banner-message flex items-center gap-3 flex-1 min-w-0">
              {icon && (
                <span className="of-antd-banner-icon flex-shrink-0">{icon}</span>
              )}

              <div className="flex-1 min-w-0">
                {title && (
                  <p className="of-antd-banner-title font-semibold text-sm">{title}</p>
                )}
                <p className="of-antd-banner-text text-sm truncate">{message}</p>
              </div>
            </div>

            <div className="of-antd-banner-extra flex items-center gap-3 flex-shrink-0">
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    'of-antd-banner-action px-3 py-1 text-sm font-medium rounded',
                    'bg-white/20 hover:bg-white/30 transition-colors'
                  )}
                >
                  {action.label}
                </button>
              )}

              {dismissible && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="of-antd-banner-close p-1 rounded hover:bg-black/10 transition-colors"
                  aria-label="Close banner"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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

AntdBanner.displayName = 'AntdBanner';
