/**
 * DrawerContainer - Portal-based container for rendering drawers
 * Supports multiple nested drawers with z-index stacking
 */

import { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { FeedbackManager } from '../../core/FeedbackManager';
import { useAdapter } from '../../hooks/useAdapter';
import { Drawer } from './Drawer';
import type { IDrawerProps } from './Drawer';
import type { IFeedbackItem } from '../../core/types';
import type { IAdapterDrawerProps, DrawerPlacement, DrawerSize } from '../../adapters/types';

/**
 * Build drawer props from feedback item
 * Handles exactOptionalPropertyTypes compliance
 */
const buildDrawerProps = (drawer: IFeedbackItem<'drawer'>, index: number): IDrawerProps => {
  const options = drawer.options;

  return {
    content: options.content,
    status: drawer.status,
    onRequestClose: () => {
      const manager = FeedbackManager.getInstance();
      // Call onClose callback if provided
      options.onClose?.();
      manager.remove(drawer.id);
    },
    testId: options.testId ?? `drawer-${drawer.id}`,
    // Optional props - only include if defined
    ...(options.title !== undefined && { title: options.title }),
    ...(options.position !== undefined && { position: options.position }),
    ...(options.size !== undefined && { size: options.size }),
    ...(options.customSize !== undefined && { customSize: options.customSize }),
    ...(options.overlay !== undefined && { overlay: options.overlay }),
    ...(options.overlayOpacity !== undefined && { overlayOpacity: options.overlayOpacity }),
    ...(options.closeOnOverlayClick !== undefined && { closeOnOverlayClick: options.closeOnOverlayClick }),
    ...(options.closeOnEscape !== undefined && { closeOnEscape: options.closeOnEscape }),
    ...(options.closable !== undefined && { closable: options.closable }),
    ...(options.footer !== undefined && { footer: options.footer }),
    ...(options.preventScroll !== undefined && { preventScroll: options.preventScroll }),
    ...(options.push !== undefined && { push: options.push }),
    ...(options.className !== undefined && { className: options.className }),
    // Increment z-index for nested drawers
    style: {
      ...options.style,
      zIndex: 9990 + index,
    },
  };
};

/**
 * DrawerContainer component
 * Renders all active drawers via portal
 */
export const DrawerContainer = memo(function DrawerContainer() {
  const { adapter } = useAdapter();

  // Subscribe to drawer items from store
  const drawers = useFeedbackStore(
    useCallback(
      (state) =>
        Array.from(state.items.values()).filter(
          (item): item is IFeedbackItem<'drawer'> =>
            item.type === 'drawer' && item.status !== 'removed'
        ),
      []
    )
  );

  // Don't render if no drawers
  if (drawers.length === 0) {
    return null;
  }

  // SSR guard
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      {drawers.map((drawer, index) => {
        if (adapter) {
          const AdapterDrawer = adapter.DrawerComponent;
          const opts = drawer.options;
          const coreProps = buildDrawerProps(drawer, index);
          const adapterProps: IAdapterDrawerProps = {
            content: opts.content,
            placement: (opts.position ?? 'right') as DrawerPlacement,
            size: (opts.size ?? 'md') as DrawerSize,
            closable: opts.closable ?? true,
            closeOnBackdropClick: opts.closeOnOverlayClick ?? true,
            closeOnEscape: opts.closeOnEscape ?? true,
            status: drawer.status,
            onRequestClose: coreProps.onRequestClose,
            ...(opts.title !== undefined && { title: opts.title }),
            ...(opts.footer !== undefined && { footer: opts.footer }),
            ...(opts.className !== undefined && { className: opts.className }),
            style: { ...opts.style, zIndex: 9990 + index },
            ...(opts.testId !== undefined && { testId: opts.testId }),
          };
          return <AdapterDrawer key={drawer.id} {...adapterProps} />;
        }
        return <Drawer key={drawer.id} {...buildDrawerProps(drawer, index)} />;
      })}
    </>,
    document.body
  );
});

DrawerContainer.displayName = 'DrawerContainer';
