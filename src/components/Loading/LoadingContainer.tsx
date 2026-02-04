/**
 * LoadingContainer component - Renders overlay loading indicators
 * Manages overlay loadings from the feedback store
 */

import { memo, useCallback } from 'react';
import type React from 'react';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { LoadingOverlay } from './LoadingOverlay';
import type { IFeedbackItem } from '../../core/types';

/**
 * LoadingContainer component
 *
 * Renders overlay loading indicators from the feedback store.
 * Non-overlay loadings are typically rendered inline where needed.
 *
 * @example
 * ```tsx
 * // Usually included in FeedbackProvider
 * <FeedbackProvider>
 *   <App />
 *   <ToastContainer />
 *   <ModalContainer />
 *   <LoadingContainer />
 * </FeedbackProvider>
 * ```
 */
export const LoadingContainer = memo(function LoadingContainer(): React.ReactElement | null {
  // Get overlay loadings from store
  const loadings = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'loading'> =>
        item.type === 'loading' && item.status !== 'removed'
    )
  );

  const store = useFeedbackStore();

  /**
   * Handle loading removal
   */
  const handleRemove = useCallback(
    (id: string) => {
      store.remove(id);
    },
    [store]
  );

  // Filter for overlay loadings only
  const overlayLoadings = loadings.filter((loading) => {
    const options = loading.options;
    return options.overlay === true;
  });

  // Don't render if no overlay loadings
  if (overlayLoadings.length === 0) {
    return null;
  }

  return (
    <>
      {overlayLoadings.map((loading) => {
        const options = loading.options;

        // Build props object, only including defined values for exactOptionalPropertyTypes
        const overlayProps = {
          status: loading.status,
          onRemove: () => handleRemove(loading.id),
          ...(options.message !== undefined && { message: options.message }),
          ...(options.spinner !== undefined && { spinner: options.spinner }),
          ...(options.size !== undefined && { size: options.size }),
          ...(options.overlayOpacity !== undefined && { overlayOpacity: options.overlayOpacity }),
          ...(options.blur !== undefined && { blur: options.blur }),
          ...(options.blurAmount !== undefined && { blurAmount: options.blurAmount }),
          ...(options.cancellable !== undefined && { cancellable: options.cancellable }),
          ...(options.onCancel !== undefined && { onCancel: options.onCancel }),
          ...(options.cancelText !== undefined && { cancelText: options.cancelText }),
          ...(options.testId !== undefined && { testId: options.testId }),
          ...(options.className !== undefined && { className: options.className }),
          ...(options.style !== undefined && { style: options.style }),
        };

        return (
          <LoadingOverlay
            key={loading.id}
            {...overlayProps}
          />
        );
      })}
    </>
  );
});

LoadingContainer.displayName = 'LoadingContainer';
