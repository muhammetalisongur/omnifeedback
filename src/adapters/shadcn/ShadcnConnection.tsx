/**
 * ShadcnConnection - shadcn/ui adapter connection status component
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterConnectionProps } from '../types';

/**
 * ShadcnConnection component
 */
export const ShadcnConnection = memo(
  forwardRef<HTMLDivElement, IAdapterConnectionProps>(function ShadcnConnection(props, ref) {
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

    useEffect(() => {
      if (!isOnline) {
        setWasOffline(true);
        setShowBanner(true);
        return undefined;
      }

      if (wasOffline) {
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
            'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg',
            'text-sm font-medium',
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-destructive text-destructive-foreground'
          )}
        >
          {/* Status dot */}
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              isOnline ? 'bg-white animate-pulse' : 'bg-white/70'
            )}
          />

          {/* Message */}
          <span>{isOnline ? onlineMessage : offlineMessage}</span>

          {/* Icon */}
          {isOnline ? (
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-12.728-12.728m12.728 12.728L5.636 5.636"
              />
            </svg>
          )}
        </div>
      </div>
    );
  })
);

ShadcnConnection.displayName = 'ShadcnConnection';
