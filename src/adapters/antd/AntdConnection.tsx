/**
 * AntdConnection - Ant Design adapter connection status component
 * Implements a connection indicator for online/offline status
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterConnectionProps } from '../types';

/**
 * AntdConnection component
 * Renders a connection status indicator with Ant Design styling
 */
export const AntdConnection = memo(
  forwardRef<HTMLDivElement, IAdapterConnectionProps>(function AntdConnection(props, ref) {
    const {
      isOnline,
      offlineMessage = 'You are offline',
      onlineMessage = 'Back online',
      showIndicator = true,
      status,
      className,
      style,
      testId,
    } = props;

    const [showBanner, setShowBanner] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);
    const isVisible = status === 'visible' || status === 'entering';

    // Track online/offline transitions
    useEffect(() => {
      if (!isOnline) {
        setWasOffline(true);
        setShowBanner(true);
        return undefined;
      }

      if (wasOffline) {
        // Just came back online
        setShowBanner(true);
        const timer = setTimeout(() => {
          setShowBanner(false);
          setWasOffline(false);
        }, 3000);
        return () => clearTimeout(timer);
      }

      return undefined;
    }, [isOnline, wasOffline]);

    if (!showIndicator) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-testid={testId}
        className={cn(
          'of-antd-connection',
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-[1010]',
          'transition-all duration-300',
          isVisible && showBanner
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none',
          className
        )}
        style={style}
      >
        <div
          className={cn(
            'of-antd-connection-content',
            'flex items-center gap-2 px-4 py-2 rounded shadow-lg',
            'text-sm font-medium',
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          )}
        >
          {/* Status indicator dot */}
          <span
            className={cn(
              'of-antd-connection-indicator',
              'w-2 h-2 rounded-full',
              isOnline ? 'bg-white animate-pulse' : 'bg-white/70'
            )}
          />

          {/* Message */}
          <span className="of-antd-connection-message">
            {isOnline ? onlineMessage : offlineMessage}
          </span>

          {/* Icon */}
          {isOnline ? (
            <svg
              className="of-antd-connection-icon w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
          ) : (
            <svg
              className="of-antd-connection-icon w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z" />
            </svg>
          )}
        </div>
      </div>
    );
  })
);

AntdConnection.displayName = 'AntdConnection';
