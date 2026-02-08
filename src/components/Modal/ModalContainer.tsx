/**
 * ModalContainer - Portal-based container for modal dialogs
 * Renders modals with proper z-index stacking for nested modals
 */

import { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { FeedbackManager } from '../../core/FeedbackManager';
import { useAdapter } from '../../hooks/useAdapter';
import { Z_INDEX } from '../../utils/constants';
import { Modal } from './Modal';
import type { IFeedbackItem, IModalOptions } from '../../core/types';
import type { IAdapterModalProps } from '../../adapters/types';

/**
 * ModalContainer props
 */
export interface IModalContainerProps {
  /** Custom container element (defaults to document.body) */
  container?: HTMLElement;
  /** Custom Modal component to use instead of default */
  ModalComponent?: typeof Modal;
}

/**
 * ModalContainer component
 *
 * Renders all open modals in a portal. Handles:
 * - Z-index stacking for nested modals
 * - Passing close handlers to modals
 * - Removal after exit animation
 *
 * @example
 * ```tsx
 * // In FeedbackProvider
 * <ModalContainer />
 * ```
 */
export const ModalContainer = memo(function ModalContainer({
  container,
  ModalComponent = Modal,
}: IModalContainerProps) {
  const { adapter } = useAdapter();
  // Get all modal items from store (excluding removed)
  const modals = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'modal'> =>
        item.type === 'modal' && item.status !== 'removed'
    )
  );

  // Handle modal close request
  const handleRequestClose = useCallback((id: string): void => {
    const manager = FeedbackManager.getInstance();
    const modal = manager.get(id);

    if (modal && modal.type === 'modal') {
      // Call onClose callback
      const options = modal.options as IModalOptions;
      options.onClose?.();

      // Start exit animation
      manager.remove(id);
    }
  }, []);

  // Handle removal after animation
  const handleRemove = useCallback((_id: string): void => {
    // FeedbackManager handles actual removal via status transitions
    // This callback is called after exit animation completes
  }, []);

  // SSR check - don't render on server
  if (typeof document === 'undefined') {
    return null;
  }

  // Don't render anything if no modals
  if (modals.length === 0) {
    return null;
  }

  const portalContainer = container ?? document.body;

  return createPortal(
    <>
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          style={{
            position: 'relative',
            zIndex: Z_INDEX.MODAL + index,
          }}
        >
          {adapter ? (() => {
            const AdapterModal = adapter.ModalComponent;
            const opts = modal.options;
            const adapterProps: IAdapterModalProps = {
              content: opts.content,
              size: opts.size ?? 'md',
              closable: opts.closable ?? true,
              closeOnBackdropClick: opts.closeOnBackdropClick ?? true,
              closeOnEscape: opts.closeOnEscape ?? true,
              centered: opts.centered ?? true,
              scrollBehavior: opts.scrollBehavior ?? 'inside',
              status: modal.status,
              onRequestClose: () => handleRequestClose(modal.id),
              ...(opts.title !== undefined && { title: opts.title }),
              ...(opts.header !== undefined && { header: opts.header }),
              ...(opts.footer !== undefined && { footer: opts.footer }),
              ...(opts.className !== undefined && { className: opts.className }),
              ...(opts.style !== undefined && { style: opts.style }),
              ...(opts.testId !== undefined && { testId: opts.testId }),
            };
            return <AdapterModal {...adapterProps} />;
          })() : (
            <ModalComponent
              {...modal.options}
              status={modal.status}
              onRequestClose={() => handleRequestClose(modal.id)}
              onRemove={() => handleRemove(modal.id)}
            />
          )}
        </div>
      ))}
    </>,
    portalContainer
  );
});

ModalContainer.displayName = 'ModalContainer';
