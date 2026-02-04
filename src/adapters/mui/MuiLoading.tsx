/**
 * MuiLoading - Material UI adapter loading component
 * Material Design circular progress and loading indicators
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterLoadingProps, SpinnerType } from '../types';

/**
 * Size styles for spinner (MUI sizing)
 */
const sizeStyles = {
  sm: 'w-5 h-5',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
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
 * Variant styles for spinner color (MUI palette)
 */
const variantStyles = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-purple-600 dark:text-purple-400',
  white: 'text-white',
};

/**
 * MUI-style Circular Progress spinner
 */
function CircularProgress({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={cn('animate-spin', className)}
      viewBox="0 0 44 44"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="22"
        cy="22"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle
        cx="22"
        cy="22"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="80, 200"
        strokeDashoffset="0"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * MUI-style dots loading
 */
function DotsProgress({ className }: { className?: string }): JSX.Element {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${String(i * 0.15)}s` }}
        />
      ))}
    </div>
  );
}

/**
 * MUI-style linear indeterminate bars
 */
function BarsProgress({ className }: { className?: string }): JSX.Element {
  return (
    <div className={cn('flex items-end gap-1', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-current rounded-sm animate-pulse"
          style={{
            height: '20px',
            animationDelay: `${String(i * 0.1)}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * MUI-style circle spinner (alternative)
 */
function CircleSpinner({ className }: { className?: string }): JSX.Element {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 border-4 border-current opacity-20 rounded-full" />
      <div className="absolute inset-0 border-4 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Get spinner component based on type
 */
const spinnerComponents: Record<SpinnerType, React.FC<{ className?: string }>> = {
  default: CircularProgress,
  dots: DotsProgress,
  bars: BarsProgress,
  ring: CircleSpinner,
  pulse: CircularProgress,
};

/**
 * MuiLoading component
 * Renders a loading indicator with Material Design styling
 */
export const MuiLoading = memo(
  forwardRef<HTMLDivElement, IAdapterLoadingProps>(function MuiLoading(props, ref): JSX.Element {
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
          'inline-flex flex-col items-center justify-center gap-4',
          'transition-opacity duration-225',
          isVisible ? 'opacity-100' : 'opacity-0',
          !fullscreen && className
        )}
        style={!fullscreen ? style : undefined}
      >
        <SpinnerComponent className={cn(sizeStyles[size], variantStyles[variant])} />

        {message && (
          <span className={cn(textSizeStyles[size], 'text-gray-600 dark:text-gray-400')}>
            {message}
          </span>
        )}

        <span className="sr-only">{message ? `Loading: ${message}` : 'Loading'}</span>
      </div>
    );

    if (fullscreen) {
      return (
        <div
          className={cn(
            'fixed inset-0 flex items-center justify-center',
            'transition-opacity duration-225',
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            className
          )}
          style={{
            zIndex: 1300,
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

MuiLoading.displayName = 'MuiLoading';
