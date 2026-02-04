/**
 * AntdLoading - Ant Design adapter loading component
 * Implements Ant Design spin indicator with multiple variants
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterLoadingProps } from '../types';

/**
 * Size styles for spinner following Ant Design sizes
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
 * Variant styles for spinner color following Ant Design theme
 */
const variantStyles = {
  primary: 'text-blue-500',
  secondary: 'text-gray-500',
  white: 'text-white',
};

/**
 * Ant Design style spinner SVG
 */
function AntdSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      viewBox="0 0 1024 1024"
      fill="currentColor"
    >
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 googl8 165.3c36.8 51.1 65.1 109.3 84 173.6 19.3 65.8 29.1 134.9 29.1 206.1 0 19.9-16.1 36-36 36z" />
    </svg>
  );
}

/**
 * Dots spinner following Ant Design loading dots pattern
 */
function DotsSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Bars spinner
 */
function BarsSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-end gap-1', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-current animate-pulse rounded-sm"
          style={{
            height: '16px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Circle spinner (Ant Design default style)
 */
function CircleSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 border-2 border-current opacity-20 rounded-full" />
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Map spinner types to components
 */
const spinnerComponents = {
  default: AntdSpinner,
  dots: DotsSpinner,
  bars: BarsSpinner,
  circle: CircleSpinner,
};

/**
 * AntdLoading component
 * Renders a loading indicator with Ant Design styling
 */
export const AntdLoading = memo(
  forwardRef<HTMLDivElement, IAdapterLoadingProps>(function AntdLoading(props, ref) {
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
          'of-antd-loading',
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
              'of-antd-loading-text',
              textSizeStyles[size],
              variant === 'white' ? 'text-white' : 'text-gray-600'
            )}
          >
            {message}
          </span>
        )}

        <span className="sr-only">Loading{message ? `: ${message}` : ''}</span>
      </div>
    );

    if (fullscreen) {
      return (
        <div
          className={cn(
            'of-antd-loading-fullscreen',
            'fixed inset-0 flex items-center justify-center z-[1010]',
            'transition-opacity duration-200',
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            className
          )}
          style={{
            backgroundColor: `rgba(255, 255, 255, ${backdropOpacity})`,
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

AntdLoading.displayName = 'AntdLoading';
