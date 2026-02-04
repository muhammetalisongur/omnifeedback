/**
 * ChakraConnection - Chakra UI adapter connection status component
 * Chakra UI-specific styling for online/offline indicator
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterConnectionProps } from '../types';

/**
 * ChakraConnection component
 * Renders a connection status indicator with Chakra UI styling
 */
export const ChakraConnection = memo(
  forwardRef<HTMLDivElement, IAdapterConnectionProps>(function ChakraConnection(props, ref) {
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
          'chakra-connection-status',
          'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
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
            'chakra-badge',
            'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg',
            'text-sm font-medium',
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          )}
        >
          {/* Status dot */}
          <span
            className={cn(
              'chakra-connection-dot',
              'w-2 h-2 rounded-full',
              isOnline
                ? 'bg-white animate-pulse'
                : 'bg-white/70'
            )}
          />

          {/* Message */}
          <span className="chakra-connection-text">{isOnline ? onlineMessage : offlineMessage}</span>

          {/* Icon */}
          {isOnline ? (
            <svg className="chakra-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          ) : (
            <svg className="chakra-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-12.728-12.728m12.728 12.728L5.636 5.636"
              />
            </svg>
          )}
        </div>
      </div>
    );
  })
);

ChakraConnection.displayName = 'ChakraConnection';
