/**
 * ShadcnProgress - shadcn/ui adapter progress component
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterProgressProps } from '../types';

/**
 * Variant colors
 */
const variantColors = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-destructive',
};

/**
 * Size styles
 */
const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

/**
 * ShadcnProgress component
 */
export const ShadcnProgress = memo(
  forwardRef<HTMLDivElement, IAdapterProgressProps>(function ShadcnProgress(props, ref): JSX.Element {
    const {
      value,
      max = 100,
      label,
      showPercentage,
      variant = 'default',
      indeterminate,
      size = 'md',
      status,
      className,
      style,
      testId,
    } = props;

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const isVisible = status === 'visible' || status === 'entering';

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? 'Progress'}
        data-testid={testId}
        className={cn(
          'w-full transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {(label ?? showPercentage) && (
          <div className="flex justify-between mb-2 text-sm">
            {label && <span className="text-muted-foreground">{label}</span>}
            {showPercentage && !indeterminate && (
              <span className="text-muted-foreground">{Math.round(percentage)}%</span>
            )}
          </div>
        )}

        <div
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-secondary',
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              'h-full w-full flex-1 transition-all',
              variantColors[variant],
              indeterminate && 'animate-indeterminate'
            )}
            style={{
              transform: indeterminate ? undefined : `translateX(-${String(100 - percentage)}%)`,
            }}
          />
        </div>
      </div>
    );
  })
);

ShadcnProgress.displayName = 'ShadcnProgress';
