/**
 * PopconfirmContainer - Portal-based container for rendering popconfirms
 * Only one popconfirm can be visible at a time
 */

import { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../hooks/useAdapter';
import { Popconfirm } from './Popconfirm';
import type { IPopconfirmProps } from './Popconfirm';
import type { IFeedbackItem } from '../../core/types';
import type { IAdapterPopconfirmProps, ConfirmVariant, PopconfirmPlacement } from '../../adapters/types';

/**
 * Build popconfirm props from feedback item
 * Handles exactOptionalPropertyTypes compliance
 */
const buildPopconfirmProps = (item: IFeedbackItem<'popconfirm'>): IPopconfirmProps => {
  const options = item.options;

  return {
    target: options.target,
    message: options.message,
    status: item.status,
    onConfirm: options.onConfirm,
    onCancel: options.onCancel ?? ((): void => { /* noop */ }),
    testId: options.testId ?? `popconfirm-${item.id}`,
    // Optional props - only include if defined
    ...(options.title !== undefined && { title: options.title }),
    ...(options.confirmText !== undefined && { confirmText: options.confirmText }),
    ...(options.cancelText !== undefined && { cancelText: options.cancelText }),
    ...(options.confirmVariant !== undefined && { confirmVariant: options.confirmVariant }),
    ...(options.placement !== undefined && { placement: options.placement }),
    ...(options.icon !== undefined && { icon: options.icon }),
    ...(options.showArrow !== undefined && { showArrow: options.showArrow }),
    ...(options.offset !== undefined && { offset: options.offset }),
    ...(options.closeOnClickOutside !== undefined && { closeOnClickOutside: options.closeOnClickOutside }),
    ...(options.className !== undefined && { className: options.className }),
    ...(options.style !== undefined && { style: options.style }),
  };
};

/**
 * PopconfirmContainer component
 * Renders the active popconfirm via portal (only one at a time)
 */
export const PopconfirmContainer = memo(function PopconfirmContainer() {
  const { adapter } = useAdapter();

  // Subscribe to popconfirm items from store (only get first one)
  const popconfirm = useFeedbackStore(
    useCallback(
      (state) => {
        const items = Array.from(state.items.values()).filter(
          (item): item is IFeedbackItem<'popconfirm'> =>
            item.type === 'popconfirm' && item.status !== 'removed'
        );
        return items[0] ?? null;
      },
      []
    )
  );

  // Don't render if no popconfirm
  if (!popconfirm) {
    return null;
  }

  // SSR guard
  if (typeof document === 'undefined') {
    return null;
  }

  if (adapter) {
    const AdapterPopconfirm = adapter.PopconfirmComponent;
    const opts = popconfirm.options;
    // Convert HTMLElement target to a ref-like object for adapter compatibility
    const triggerRef = 'current' in opts.target
      ? opts.target
      : { current: opts.target } as React.RefObject<HTMLElement>;
    const adapterProps: IAdapterPopconfirmProps = {
      message: opts.message,
      confirmText: opts.confirmText ?? 'Confirm',
      cancelText: opts.cancelText ?? 'Cancel',
      confirmVariant: (opts.confirmVariant ?? 'primary') as ConfirmVariant,
      placement: (opts.placement ?? 'top') as PopconfirmPlacement,
      triggerRef,
      status: popconfirm.status,
      onConfirm: opts.onConfirm,
      onCancel: opts.onCancel ?? ((): void => { /* noop */ }),
      ...(opts.title !== undefined && { title: opts.title }),
      ...(opts.icon !== undefined && { icon: opts.icon }),
      ...(opts.className !== undefined && { className: opts.className }),
      ...(opts.style !== undefined && { style: opts.style }),
      ...(opts.testId !== undefined && { testId: opts.testId }),
    };
    return createPortal(
      <AdapterPopconfirm {...adapterProps} />,
      document.body
    );
  }

  return createPortal(
    <Popconfirm {...buildPopconfirmProps(popconfirm)} />,
    document.body
  );
});

PopconfirmContainer.displayName = 'PopconfirmContainer';
