/**
 * ProgressContainer component
 * Manages rendering of progress indicators from the feedback store
 */

import { memo } from 'react';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../hooks/useAdapter';
import { Progress } from './Progress';
import { cn } from '../../utils/cn';
import type { IProgressOptions } from '../../core/types';
import type { IAdapterProgressProps, ProgressVariant, SizeVariant } from '../../adapters/types';

/**
 * ProgressContainer props
 */
export interface IProgressContainerProps {
  /** Gap between indicators (in pixels) */
  gap?: number;
  /** Additional CSS classes */
  className?: string;
  /** Maximum indicators to show */
  maxIndicators?: number;
  /** Test ID for testing */
  testId?: string;
}

/**
 * ProgressContainer component
 * Renders progress indicators from the store where placed in the component tree
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ProgressContainer />
 *
 * // With custom options
 * <ProgressContainer
 *   gap={16}
 *   maxIndicators={3}
 *   className="my-4"
 * />
 * ```
 */
export const ProgressContainer = memo(function ProgressContainer({
  gap = 12,
  className,
  maxIndicators = 5,
  testId,
}: IProgressContainerProps) {
  const { adapter } = useAdapter();

  // Get progress indicators from store
  const indicators = useFeedbackStore((state) =>
    Array.from(state.items.values())
      .filter((item) => item.type === 'progress' && item.status !== 'removed')
      .slice(0, maxIndicators)
  );

  // Don't render if no indicators
  if (indicators.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ gap: `${String(gap)}px` }}
      role="region"
      aria-label="Progress indicators"
      data-testid={testId}
    >
      {indicators.map((indicator) => {
        const options = indicator.options as IProgressOptions;

        // Build props object, only including defined values for exactOptionalPropertyTypes
        const progressProps = {
          value: options.value,
          ...(options.max !== undefined && { max: options.max }),
          ...(options.label !== undefined && { label: options.label }),
          ...(options.showPercentage !== undefined && { showPercentage: options.showPercentage }),
          ...(options.variant !== undefined && { variant: options.variant }),
          ...(options.indeterminate !== undefined && { indeterminate: options.indeterminate }),
          ...(options.size !== undefined && { size: options.size }),
          ...(options.type !== undefined && { type: options.type }),
          ...(options.animated !== undefined && { animated: options.animated }),
          ...(options.striped !== undefined && { striped: options.striped }),
          ...(options.color !== undefined && { color: options.color }),
          ...(options.testId !== undefined && { testId: options.testId }),
          ...(options.className !== undefined && { className: options.className }),
          ...(options.style !== undefined && { style: options.style }),
        };

        if (adapter) {
          const AdapterProgress = adapter.ProgressComponent;
          const adapterProps: IAdapterProgressProps = {
            value: options.value,
            max: options.max ?? 100,
            showPercentage: options.showPercentage ?? false,
            variant: (options.variant ?? 'default') as ProgressVariant,
            indeterminate: options.indeterminate ?? false,
            size: (options.size ?? 'md') as SizeVariant,
            status: indicator.status,
            ...(options.label !== undefined && { label: options.label }),
            ...(options.className !== undefined && { className: options.className }),
            ...(options.style !== undefined && { style: options.style }),
            ...(options.testId !== undefined && { testId: options.testId }),
          };
          return <AdapterProgress key={indicator.id} {...adapterProps} />;
        }

        return <Progress key={indicator.id} {...progressProps} />;
      })}
    </div>
  );
});

ProgressContainer.displayName = 'ProgressContainer';
