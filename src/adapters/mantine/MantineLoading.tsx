/**
 * MantineLoading - Mantine adapter loading component
 * Styled with Mantine color variables and multiple spinner types
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterLoadingProps, SpinnerType } from '../types';

/**
 * Size styles for spinner
 */
const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

/**
 * Text size styles
 */
const textSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/**
 * Variant styles for spinner color using Mantine colors
 */
const variantStyles = {
  primary: 'text-[var(--mantine-color-blue-6)] dark:text-[var(--mantine-color-blue-4)]',
  secondary: 'text-[var(--mantine-color-gray-6)] dark:text-[var(--mantine-color-gray-4)]',
  white: 'text-white',
};

/**
 * Default spinner SVG
 */
function DefaultSpinner({ className }: { className?: string }): JSX.Element {
  return (
    <svg className={cn('animate-spin', className)} fill="none" viewBox="0 0 24 24">
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
  );
}

/**
 * Dots spinner
 */
function DotsSpinner({ className }: { className?: string }): JSX.Element {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${String(i * 0.15)}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Bars spinner
 */
function BarsSpinner({ className }: { className?: string }): JSX.Element {
  return (
    <div className={cn('flex items-end gap-1', className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-1 bg-current animate-pulse"
          style={{
            height: '16px',
            animationDelay: `${String(i * 0.1)}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Circle spinner
 */
function CircleSpinner({ className }: { className?: string }): JSX.Element {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 border-2 border-current opacity-25 rounded-full" />
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Get spinner component based on type
 */
const spinnerComponents: Record<SpinnerType, React.FC<{ className?: string }>> = {
  default: DefaultSpinner,
  dots: DotsSpinner,
  bars: BarsSpinner,
  ring: CircleSpinner,
  pulse: DefaultSpinner,
};

/**
 * MantineLoading component
 * Renders a loading indicator with various spinner styles
 */
export const MantineLoading = memo(
  forwardRef<HTMLDivElement, IAdapterLoadingProps>(function MantineLoading(props, ref) {
    const {
      message,
      spinner = 'default',
      size = 'md',
      variant = 'primary',
      fullscreen = false,
      backdropOpacity = 0.5,
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';
    const SpinnerComponent = spinnerComponents[spinner];

    const content = (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-testid={testId}
        className={cn(
          'inline-flex flex-col items-center justify-center gap-3',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          !fullscreen && className
        )}
        style={!fullscreen ? style : undefined}
      >
        <SpinnerComponent className={cn(sizeStyles[size], variantStyles[variant])} />

        {message && (
          <span
            className={cn(
              textSizeStyles[size],
              variantStyles[variant],
              'font-[var(--mantine-font-family)]'
            )}
          >
            {message}
          </span>
        )}

        <span className="sr-only">Loading{message ? `: ${String(message)}` : ''}</span>
      </div>
    );

    if (fullscreen) {
      return (
        <div
          className={cn(
            'fixed inset-0 flex items-center justify-center z-[var(--mantine-z-index-overlay)]',
            'transition-opacity duration-200',
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            className
          )}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${String(backdropOpacity)})`,
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

MantineLoading.displayName = 'MantineLoading';
