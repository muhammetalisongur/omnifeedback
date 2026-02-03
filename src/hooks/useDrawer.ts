/**
 * useDrawer hook
 * Provides methods to open, close, and manage slide-out drawer panels
 */

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IDrawerOptions, IFeedbackItem } from '../core/types';

/**
 * Drawer item from the store
 */
export interface IDrawerItem extends IFeedbackItem<'drawer'> {
  options: IDrawerOptions;
}

/**
 * Return type for useDrawer hook
 */
export interface IUseDrawerReturn {
  /** Open drawer with full options */
  open: (options: IDrawerOptions) => string;
  /** Close specific drawer */
  close: (id: string) => void;
  /** Close all drawers */
  closeAll: () => void;
  /** Update drawer content/options */
  update: (id: string, options: Partial<IDrawerOptions>) => void;
  /** Check if any drawer is open */
  isOpen: boolean;
  /** Get all open drawer IDs */
  openDrawers: string[];
  /** Get all active drawers */
  drawers: IDrawerItem[];
}

/**
 * Default options for drawers
 */
const DEFAULT_OPTIONS: Partial<IDrawerOptions> = {
  position: 'right',
  size: 'md',
  overlay: true,
  overlayOpacity: 0.5,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  closable: true,
  preventScroll: true,
  push: false,
};

/**
 * useDrawer hook
 * Provides methods to manage slide-out drawer panels
 *
 * @returns Drawer management methods and state
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { open, close, closeAll, isOpen, openDrawers } = useDrawer();
 *
 * // Open settings drawer
 * const settingsId = open({
 *   title: 'Settings',
 *   position: 'right',
 *   size: 'md',
 *   content: <SettingsPanel />,
 *   footer: (
 *     <div className="flex gap-2 justify-end">
 *       <Button onClick={() => close(settingsId)}>Cancel</Button>
 *       <Button onClick={saveSettings}>Save</Button>
 *     </div>
 *   ),
 * });
 *
 * // Open navigation menu
 * open({
 *   position: 'left',
 *   size: 'sm',
 *   content: <NavigationMenu />,
 *   closable: false,
 * });
 *
 * // Open bottom sheet style drawer
 * open({
 *   position: 'bottom',
 *   size: 'sm',
 *   content: <ActionsList />,
 * });
 *
 * // Full screen drawer
 * open({
 *   title: 'Detail View',
 *   position: 'right',
 *   size: 'full',
 *   content: <DetailView />,
 * });
 *
 * // Custom size drawer
 * open({
 *   title: 'Custom Width',
 *   position: 'right',
 *   customSize: '500px',
 *   content: <CustomContent />,
 * });
 * ```
 */
export function useDrawer(): IUseDrawerReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useDrawer must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get drawers from store
  const drawers = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IDrawerItem =>
        item.type === 'drawer' && item.status !== 'removed'
    )
  );

  // Get open drawer IDs
  const openDrawers = useMemo(
    () => drawers.map((d) => d.id),
    [drawers]
  );

  // Check if any drawer is open
  const isOpen = openDrawers.length > 0;

  /**
   * Open drawer with full options
   */
  const open = useCallback(
    (options: IDrawerOptions): string => {
      const mergedOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
      } as IDrawerOptions;

      const id = manager.add('drawer', mergedOptions);

      // Call onOpen callback if provided
      mergedOptions.onOpen?.();

      return id;
    },
    [manager]
  );

  /**
   * Close specific drawer
   */
  const close = useCallback(
    (id: string): void => {
      const drawer = manager.get(id);
      if (drawer) {
        const options = drawer.options as IDrawerOptions;
        // Call onClose callback
        options.onClose?.();
        // Remove from manager
        manager.remove(id);
      }
    },
    [manager]
  );

  /**
   * Close all drawers
   */
  const closeAll = useCallback((): void => {
    // Close each drawer individually to trigger callbacks
    openDrawers.forEach((id) => close(id));
  }, [openDrawers, close]);

  /**
   * Update drawer content/options
   */
  const update = useCallback(
    (id: string, options: Partial<IDrawerOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  return {
    open,
    close,
    closeAll,
    update,
    isOpen,
    openDrawers,
    drawers,
  };
}
