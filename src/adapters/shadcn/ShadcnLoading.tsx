/**
 * ShadcnLoading - shadcn/ui adapter loading component
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterLoadingProps } from '../types';

/**
 * Size styles
 */
const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/**
 * ShadcnLoading component
 */
export const ShadcnLoading = memo(
  forwardRef<HTMLDivElement, IAdapterLoadingProps>(function ShadcnLoading(props, ref) {
    const {
      message,
      size = 'md',
      fullscreen = false,
      backdropOpacity = 0.5,
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';

    const content = (
      <div
        ref={fullscreen ? undefined : ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-testid={fullscreen ? undefined : testId}
        className={cn(
          'flex flex-col items-center justify-center gap-3',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          !fullscreen && className
        )}
        style={!fullscreen ? style : undefined}
      >
        {/* Spinner */}
        <svg
          className={cn('animate-spin text-primary', sizeStyles[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>

        {message && <span className="text-sm text-muted-foreground">{message}</span>}

        <span className="sr-only">Loading{message ? `: ${message}` : ''}</span>
      </div>
    );

    if (fullscreen) {
      return (
        <div
          ref={ref}
          data-testid={testId}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            'transition-opacity duration-200',
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            className
          )}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
            ...style,
          }}
        >
          {content}
        </div>
      );
    }

    return content;
  })
);

ShadcnLoading.displayName = 'ShadcnLoading';
