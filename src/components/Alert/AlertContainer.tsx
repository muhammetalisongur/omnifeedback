/**
 * AlertContainer component
 * Manages rendering of alerts from the feedback store
 */

import { memo, useCallback } from 'react';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { FeedbackManager } from '../../core/FeedbackManager';
import { useAdapter } from '../../hooks/useAdapter';
import { Alert } from './Alert';
import { cn } from '../../utils/cn';
import type { IAlertOptions } from '../../core/types';
import type { IAdapterAlertProps, FeedbackVariant } from '../../adapters/types';

/**
 * AlertContainer props
 */
export interface IAlertContainerProps {
  /** Gap between alerts (in pixels) */
  gap?: number;
  /** Additional CSS classes */
  className?: string;
  /** Maximum alerts to show */
  maxAlerts?: number;
  /** Test ID for testing */
  testId?: string;
}

/**
 * AlertContainer component
 * Renders alerts from the store where placed in the component tree
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AlertContainer />
 *
 * // With custom options
 * <AlertContainer
 *   gap={16}
 *   maxAlerts={3}
 *   className="my-4"
 * />
 * ```
 */
export const AlertContainer = memo(function AlertContainer({
  gap = 12,
  className,
  maxAlerts = 5,
  testId,
}: IAlertContainerProps) {
  const manager = FeedbackManager.getInstance();
  const { adapter } = useAdapter();

  // Get alerts from store
  const alerts = useFeedbackStore((state) =>
    Array.from(state.items.values())
      .filter((item) => item.type === 'alert' && item.status !== 'removed')
      .slice(0, maxAlerts)
  );

  // Handle alert dismissal
  const handleDismiss = useCallback(
    (id: string) => {
      const alert = manager.get(id);
      if (alert) {
        const options = alert.options as IAlertOptions;
        options.onDismiss?.();
        manager.remove(id);
      }
    },
    [manager]
  );

  // Don't render if no alerts
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{ gap: `${String(gap)}px` }}
      role="region"
      aria-label="Alerts"
      data-testid={testId}
    >
      {alerts.map((alert) => {
        const options = alert.options as IAlertOptions;

        // Build props object, only including defined values for exactOptionalPropertyTypes
        const alertProps = {
          message: options.message,
          status: alert.status,
          onRequestDismiss: () => handleDismiss(alert.id),
          ...(options.title !== undefined && { title: options.title }),
          ...(options.variant !== undefined && { variant: options.variant }),
          ...(options.dismissible !== undefined && { dismissible: options.dismissible }),
          ...(options.icon !== undefined && { icon: options.icon }),
          ...(options.hideIcon !== undefined && { hideIcon: options.hideIcon }),
          ...(options.actions !== undefined && { actions: options.actions }),
          ...(options.bordered !== undefined && { bordered: options.bordered }),
          ...(options.filled !== undefined && { filled: options.filled }),
          ...(options.testId !== undefined && { testId: options.testId }),
          ...(options.className !== undefined && { className: options.className }),
          ...(options.style !== undefined && { style: options.style }),
        };

        if (adapter) {
          const AdapterAlert = adapter.AlertComponent;
          const adapterProps: IAdapterAlertProps = {
            message: options.message,
            variant: (options.variant ?? 'info') as FeedbackVariant,
            dismissible: options.dismissible ?? false,
            status: alert.status,
            onRequestDismiss: () => handleDismiss(alert.id),
            ...(options.title !== undefined && { title: options.title }),
            ...(options.icon !== undefined && { icon: options.icon }),
            ...(options.hideIcon !== undefined && { hideIcon: options.hideIcon }),
            ...(options.actions !== undefined && { actions: options.actions }),
            ...(options.className !== undefined && { className: options.className }),
            ...(options.style !== undefined && { style: options.style }),
            ...(options.testId !== undefined && { testId: options.testId }),
          };
          return <AdapterAlert key={alert.id} {...adapterProps} />;
        }

        return <Alert key={alert.id} {...alertProps} />;
      })}
    </div>
  );
});

AlertContainer.displayName = 'AlertContainer';
