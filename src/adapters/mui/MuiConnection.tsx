/**
 * MuiConnection - Material UI adapter connection status component
 * Material Design styled online/offline indicator
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterConnectionProps } from '../types';

/**
 * MuiConnection component
 * Renders a connection status indicator with Material Design styling
 */
export const MuiConnection = memo(
  forwardRef<HTMLDivElement, IAdapterConnectionProps>(function MuiConnection(props, ref) {
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
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-[1400]',
          'transition-all duration-225',
          isVisible && showBanner
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none',
          className
        )}
        style={style}
      >
        {/* MUI Snackbar/Chip styled indicator */}
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
            'text-sm font-medium',
            isOnline
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-white'
          )}
        >
          {/* Status icon */}
          {isOnline ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4c-1.29-1.29-2.84-2.13-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l2 2c1.02-1.02 2.17-1.86 3.41-2.52l2.1 2.1C7.01 11.14 5.66 12 4.5 13l2 2c1.13-1.13 2.56-1.92 4.1-2.32l2.12 2.12c-1.54.18-3.04.74-4.28 1.64L2 10.93l-.01.01-1 1-.99.99 2 2.04.52-.52c.69-.69 1.47-1.25 2.32-1.68l2.19 2.19c-.84.44-1.6 1.01-2.28 1.69l-.52.52 2 2.04 1-1 .99-.99c.67-.67 1.47-1.23 2.34-1.67l11.52 11.52 1.41-1.41L3.41 1.64 2 3.05z" />
            </svg>
          )}

          {/* Message */}
          <span>{isOnline ? onlineMessage : offlineMessage}</span>

          {/* Status dot */}
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isOnline ? 'bg-white animate-pulse' : 'bg-red-400'
            )}
          />
        </div>
      </div>
    );
  })
);

MuiConnection.displayName = 'MuiConnection';
