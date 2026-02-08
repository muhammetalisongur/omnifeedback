/**
 * ConfirmContainer - Renders confirm dialogs via portal
 * Only shows the most recent confirm (max: 1)
 */

import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../hooks/useAdapter';
import { Confirm } from './Confirm';
import type { IFeedbackItem } from '../../core/types';
import type { IAdapterConfirmProps, ConfirmVariant } from '../../adapters/types';

/**
 * Z-index for confirm dialogs (above modals)
 */
const Z_INDEX_CONFIRM = 10000;

/**
 * ConfirmContainer component
 * Renders confirm dialogs using portal to document body
 * Only the most recent confirm is shown at a time
 *
 * @example
 * ```tsx
 * // Used internally by FeedbackProvider
 * <FeedbackProvider>
 *   <App />
 *   <ConfirmContainer />
 * </FeedbackProvider>
 * ```
 */
export const ConfirmContainer = memo(function ConfirmContainer() {
  const { adapter } = useAdapter();

  // Get all confirm items from store
  const confirms = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'confirm'> =>
        item.type === 'confirm' && item.status !== 'removed'
    )
  );

  // Lock body scroll when confirm is visible
  useEffect(() => {
    if (confirms.length > 0) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [confirms.length]);

  // Don't render if no confirms
  if (confirms.length === 0) {
    return null;
  }

  // SSR safety check
  if (typeof document === 'undefined') {
    return null;
  }

  // Only show the most recent confirm (design spec: max 1 at a time)
  const latestConfirm = confirms[confirms.length - 1];

  // Safety check - should never happen due to length check above
  if (!latestConfirm) {
    return null;
  }

  const options = latestConfirm.options;

  // Build props with spread to handle exactOptionalPropertyTypes
  const confirmProps = {
    message: options.message,
    status: latestConfirm.status,
    onConfirm: options.onConfirm,
    testId: options.testId ?? `confirm-${latestConfirm.id}`,
    ...(options.title !== undefined && { title: options.title }),
    ...(options.confirmText !== undefined && { confirmText: options.confirmText }),
    ...(options.cancelText !== undefined && { cancelText: options.cancelText }),
    ...(options.confirmVariant !== undefined && { confirmVariant: options.confirmVariant }),
    ...(options.confirmLoading !== undefined && { confirmLoading: options.confirmLoading }),
    ...(options.onCancel !== undefined && { onCancel: options.onCancel }),
    ...(options.className !== undefined && { className: options.className }),
    ...(options.style !== undefined && { style: options.style }),
  };

  return createPortal(
    <div
      style={{ zIndex: Z_INDEX_CONFIRM }}
      data-testid="confirm-container"
    >
      {adapter ? (() => {
        const AdapterConfirm = adapter.ConfirmComponent;
        const adapterProps: IAdapterConfirmProps = {
          message: options.message,
          title: options.title ?? 'Confirm',
          confirmText: options.confirmText ?? 'Confirm',
          cancelText: options.cancelText ?? 'Cancel',
          confirmVariant: (options.confirmVariant ?? 'primary') as ConfirmVariant,
          status: latestConfirm.status,
          onConfirm: options.onConfirm,
          onCancel: options.onCancel ?? ((): void => { /* noop */ }),
          ...(options.icon !== undefined && { icon: options.icon }),
          ...(options.className !== undefined && { className: options.className }),
          ...(options.style !== undefined && { style: options.style }),
          ...(options.testId !== undefined && { testId: options.testId }),
        };
        return <AdapterConfirm key={latestConfirm.id} {...adapterProps} />;
      })() : (
        <Confirm key={latestConfirm.id} {...confirmProps} />
      )}
    </div>,
    document.body
  );
});

ConfirmContainer.displayName = 'ConfirmContainer';
