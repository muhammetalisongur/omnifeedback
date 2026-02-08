/**
 * SheetContainer - Container for rendering sheets via portal
 * Subscribes to FeedbackStore and renders active sheets
 */

import { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useFeedbackContext } from '../../providers/FeedbackContext';
import { useAdapter } from '../../hooks/useAdapter';
import { Sheet } from './Sheet';
import type { ISheetOptions } from '../../core/types';
import type { IAdapterSheetProps } from '../../adapters/types';

/**
 * SheetContainer component
 * Renders all active sheets using React portal
 *
 * @example
 * ```tsx
 * // Typically used inside FeedbackProvider
 * <FeedbackProvider>
 *   <App />
 *   <SheetContainer />
 * </FeedbackProvider>
 * ```
 */
export const SheetContainer = memo(function SheetContainer() {
  const { manager } = useFeedbackContext();
  const { adapter } = useAdapter();
  const items = useFeedbackStore((state) => state.items);

  // Filter sheet items
  const sheets = Array.from(items.values()).filter(
    (item) => item.type === 'sheet' && item.status !== 'removed'
  );

  /**
   * Handle sheet close request
   */
  const handleClose = useCallback(
    (id: string, onClose?: () => void) => {
      onClose?.();
      manager.remove(id);
    },
    [manager]
  );

  // Don't render if no sheets or SSR
  if (sheets.length === 0 || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      {sheets.map((item) => {
        const options = item.options as ISheetOptions;
        if (adapter) {
          const AdapterSheet = adapter.SheetComponent;
          const adapterProps: IAdapterSheetProps = {
            content: options.content,
            snapPoints: options.snapPoints ?? [50, 90],
            defaultSnapPoint: options.defaultSnapPoint ?? 0,
            closeOnBackdropClick: options.closeOnBackdropClick ?? true,
            showHandle: options.showHandle ?? true,
            currentSnapIndex: options.defaultSnapPoint ?? 0,
            status: item.status,
            onRequestClose: () => handleClose(item.id, options.onClose),
            ...(options.title !== undefined && { title: String(options.title) }),
            ...(options.className !== undefined && { className: options.className }),
            ...(options.style !== undefined && { style: options.style }),
            ...(options.testId !== undefined && { testId: options.testId }),
          };
          return <AdapterSheet key={item.id} {...adapterProps} />;
        }

        return (
          <Sheet
            key={item.id}
            content={options.content}
            status={item.status}
            onRequestClose={() => handleClose(item.id, options.onClose)}
            testId={options.testId ?? `sheet-${item.id}`}
            {...(options.title !== undefined && { title: options.title })}
            {...(options.snapPoints !== undefined && { snapPoints: options.snapPoints })}
            {...(options.defaultSnapPoint !== undefined && { defaultSnapPoint: options.defaultSnapPoint })}
            {...(options.closeOnBackdropClick !== undefined && { closeOnBackdropClick: options.closeOnBackdropClick })}
            {...(options.showHandle !== undefined && { showHandle: options.showHandle })}
            {...(options.className !== undefined && { className: options.className })}
            {...(options.style !== undefined && { style: options.style })}
          />
        );
      })}
    </>,
    document.body
  );
});

SheetContainer.displayName = 'SheetContainer';
