/**
 * Spinner component with multiple animation variants
 * Provides visual feedback for loading states
 */

import { memo } from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import type { SpinnerType } from '../../core/types';

/**
 * Spinner component props
 */
export interface ISpinnerProps {
  /** Spinner animation type */
  type?: SpinnerType;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Default spinner - circular with spinning animation
 */
function DefaultSpinner({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      className={cn('animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      data-spinner="default"
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
  );
}

/**
 * Dots spinner - three bouncing dots
 */
function DotsSpinner({ className }: { className?: string }): React.ReactElement {
  return (
    <div className={cn('flex gap-1 items-center', className)} data-spinner="dots">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${String(i * 0.15)}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Bars spinner - vertical bars with pulse animation
 */
function BarsSpinner({ className }: { className?: string }): React.ReactElement {
  return (
    <div className={cn('flex gap-1 items-end h-full', className)} data-spinner="bars">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-1 bg-current rounded-full animate-pulse"
          style={{
            height: `${String(50 + i * 12)}%`,
            animationDelay: `${String(i * 0.15)}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Ring spinner - border-based spinning ring
 */
function RingSpinner({ className }: { className?: string }): React.ReactElement {
  return (
    <div
      className={cn(
        'border-4 border-current border-t-transparent rounded-full animate-spin',
        className
      )}
      data-spinner="ring"
    />
  );
}

/**
 * Pulse spinner - pulsing circle
 */
function PulseSpinner({ className }: { className?: string }): React.ReactElement {
  return (
    <div
      className={cn('rounded-full bg-current animate-pulse', className)}
      data-spinner="pulse"
    />
  );
}

/**
 * Spinner component
 * Renders different spinner animations based on type
 *
 * @example
 * ```tsx
 * <Spinner type="default" className="w-8 h-8 text-blue-600" />
 * <Spinner type="dots" className="w-8 h-8 text-gray-600" />
 * <Spinner type="bars" className="w-8 h-8 text-green-600" />
 * <Spinner type="ring" className="w-8 h-8 text-purple-600" />
 * <Spinner type="pulse" className="w-8 h-8 text-red-600" />
 * ```
 */
export const Spinner = memo(function Spinner({
  type = 'default',
  className,
  testId,
}: ISpinnerProps): React.ReactElement | null {
  // Pass className only if defined to satisfy exactOptionalPropertyTypes
  const spinnerClassName = className ?? '';

  const content = (() => {
    switch (type) {
      case 'default':
        return <DefaultSpinner className={spinnerClassName} />;
      case 'dots':
        return <DotsSpinner className={spinnerClassName} />;
      case 'bars':
        return <BarsSpinner className={spinnerClassName} />;
      case 'ring':
        return <RingSpinner className={spinnerClassName} />;
      case 'pulse':
        return <PulseSpinner className={spinnerClassName} />;
      default:
        return <DefaultSpinner className={spinnerClassName} />;
    }
  })();

  return (
    <div data-testid={testId} role="presentation" aria-hidden="true">
      {content}
    </div>
  );
});

Spinner.displayName = 'Spinner';
