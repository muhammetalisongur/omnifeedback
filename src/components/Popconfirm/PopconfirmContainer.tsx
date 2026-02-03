/**
 * PopconfirmContainer - Portal-based container for rendering popconfirms
 * Only one popconfirm can be visible at a time
 */

import { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { Popconfirm } from './Popconfirm';
import type { IFeedbackItem, IPopconfirmOptions } from '../../core/types';

/**
 * Build popconfirm props from feedback item
 * Handles exactOptionalPropertyTypes compliance
 */
const buildPopconfirmProps = (item: IFeedbackItem<'popconfirm'>) => {
  const options = item.options as IPopconfirmOptions;

  return {
    target: options.target,
    message: options.message,
    status: item.status,
    onConfirm: options.onConfirm,
    onCancel: options.onCancel ?? (() => {}),
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

  return createPortal(
    <Popconfirm {...buildPopconfirmProps(popconfirm)} />,
    document.body
  );
});

PopconfirmContainer.displayName = 'PopconfirmContainer';
