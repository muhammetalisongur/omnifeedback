/**
 * ToastContainer - Portal-based container for toast notifications
 * Renders toasts grouped by position with proper stacking
 */

import { memo, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { FeedbackManager } from '../../core/FeedbackManager';
import { cn } from '../../utils/cn';
import { Z_INDEX } from '../../utils/constants';
import { Toast } from './Toast';
import type { ToastPosition, IFeedbackItem } from '../../core/types';

/**
 * ToastContainer props
 */
export interface IToastContainerProps {
  /** Default position for toasts without explicit position */
  position?: ToastPosition;
  /** Gap between toasts in pixels */
  gap?: number;
  /** Custom container className */
  className?: string;
  /** Custom Toast component (for adapters) */
  ToastComponent?: typeof Toast;
  /** Container element to render portal into */
  container?: Element | null;
}

/**
 * Position to CSS class mapping
 */
const positionStyles: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

/**
 * ToastContainer component
 *
 * Features:
 * - Groups toasts by position
 * - Renders via portal to document.body
 * - Proper z-index layering
 * - Reverses order for bottom positions
 * - SSR safe
 */
export const ToastContainer = memo(function ToastContainer({
  position = 'top-right',
  gap = 12,
  className,
  ToastComponent = Toast,
  container,
}: IToastContainerProps) {
  // Get toasts from store
  const toasts = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'toast'> =>
        item.type === 'toast' && item.status !== 'removed'
    )
  );

  // Group toasts by position
  const groupedToasts = useMemo(() => {
    const groups: Record<ToastPosition, IFeedbackItem<'toast'>[]> = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    };

    toasts.forEach((toast) => {
      const toastPosition = toast.options.position ?? position;
      groups[toastPosition].push(toast);
    });

    return groups;
  }, [toasts, position]);

  // Handle toast removal
  const handleRemove = useCallback((_id: string): void => {
    // FeedbackManager handles actual removal
    // This is called after exit animation completes
  }, []);

  // Handle dismiss request
  const handleDismissRequest = useCallback((id: string): void => {
    const manager = FeedbackManager.getInstance();
    manager.remove(id);
  }, []);

  // Don't render if no toasts
  if (toasts.length === 0) {
    return null;
  }

  // SSR check
  if (typeof document === 'undefined') {
    return null;
  }

  const portalContainer = container ?? document.body;

  return createPortal(
    <>
      {Object.entries(groupedToasts).map(([pos, positionToasts]) => {
        if (positionToasts.length === 0) {
          return null;
        }

        const isBottom = pos.startsWith('bottom');

        return (
          <div
            key={pos}
            data-position={pos}
            className={cn(
              'fixed flex flex-col pointer-events-none',
              positionStyles[pos as ToastPosition],
              className
            )}
            style={{
              zIndex: Z_INDEX.TOAST,
              gap: `${String(gap)}px`,
            }}
          >
            {/* Reverse order for bottom positions so newest appears at bottom */}
            {(isBottom ? [...positionToasts].reverse() : positionToasts).map(
              (toast) => (
                <ToastComponent
                  key={toast.id}
                  {...toast.options}
                  status={toast.status}
                  onRemove={() => handleRemove(toast.id)}
                  onDismissRequest={() => handleDismissRequest(toast.id)}
                />
              )
            )}
          </div>
        );
      })}
    </>,
    portalContainer
  );
});

ToastContainer.displayName = 'ToastContainer';
