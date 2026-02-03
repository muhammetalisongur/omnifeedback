/**
 * useBanner hook
 * Provides methods to show, hide, and manage page-level banners
 */

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type {
  IBannerOptions,
  IFeedbackItem,
  BannerVariant,
} from '../core/types';

/**
 * localStorage prefix for remember dismiss feature
 */
const STORAGE_PREFIX = 'omnifeedback_banner_dismissed_';

/**
 * Banner item from the store
 */
export interface IBannerItem extends IFeedbackItem<'banner'> {
  options: IBannerOptions;
}

/**
 * Return type for useBanner hook
 */
export interface IUseBannerReturn {
  /** Show banner with full options */
  show: (options: IBannerOptions) => string;
  /** Show info banner */
  info: (message: string, options?: Partial<IBannerOptions>) => string;
  /** Show success banner */
  success: (message: string, options?: Partial<IBannerOptions>) => string;
  /** Show warning banner */
  warning: (message: string, options?: Partial<IBannerOptions>) => string;
  /** Show error banner */
  error: (message: string, options?: Partial<IBannerOptions>) => string;
  /** Show announcement banner */
  announcement: (message: string, options?: Partial<IBannerOptions>) => string;
  /** Hide specific banner */
  hide: (id: string) => void;
  /** Hide all banners */
  hideAll: () => void;
  /** Update banner */
  update: (id: string, options: Partial<IBannerOptions>) => void;
  /** Get all active banners */
  banners: IBannerItem[];
  /** Check if a banner was previously dismissed (rememberDismiss) */
  isDismissed: (key: string) => boolean;
  /** Clear dismissed state for a banner */
  clearDismissed: (key: string) => void;
}

/**
 * Default options for banners
 */
const DEFAULT_OPTIONS: Partial<IBannerOptions> = {
  position: 'top',
  sticky: true,
  dismissible: true,
  fullWidth: true,
  centered: true,
  duration: 0,
  variant: 'default',
};

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__omnifeedback_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * useBanner hook
 * Provides methods to manage page-level banners
 *
 * @returns Banner management methods and state
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * const { show, info, warning, announcement, hide, banners } = useBanner();
 *
 * // Cookie consent banner
 * show({
 *   message: 'This site uses cookies.',
 *   variant: 'info',
 *   position: 'bottom',
 *   rememberDismiss: 'cookie-consent',
 *   actions: [
 *     { label: 'Accept', onClick: handleAccept, variant: 'primary' },
 *     { label: 'Settings', onClick: openSettings, variant: 'secondary' },
 *   ],
 * });
 *
 * // Maintenance warning
 * warning('Scheduled maintenance: 10 PM - 2 AM', {
 *   dismissible: false,
 * });
 *
 * // New feature announcement
 * announcement('New features available! Check them out.', {
 *   actions: [{ label: 'Learn More', onClick: openChangelog }],
 * });
 * ```
 */
export function useBanner(): IUseBannerReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useBanner must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get banners from store
  const banners = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IBannerItem =>
        item.type === 'banner' && item.status !== 'removed'
    )
  );

  /**
   * Check if a banner was previously dismissed
   */
  const isDismissed = useCallback((key: string): boolean => {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    try {
      return localStorage.getItem(STORAGE_PREFIX + key) === 'true';
    } catch {
      return false;
    }
  }, []);

  /**
   * Clear dismissed state for a banner
   */
  const clearDismissed = useCallback((key: string): void => {
    if (!isLocalStorageAvailable()) {
      return;
    }
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Ignore errors
    }
  }, []);

  /**
   * Show banner with full options
   */
  const show = useCallback(
    (options: IBannerOptions): string => {
      // Check if already dismissed (rememberDismiss)
      if (options.rememberDismiss && isDismissed(options.rememberDismiss)) {
        return ''; // Don't show if already dismissed
      }

      return manager.add('banner', {
        ...DEFAULT_OPTIONS,
        ...options,
      } as IBannerOptions);
    },
    [manager, isDismissed]
  );

  /**
   * Create variant-specific show function
   */
  const createVariantShow = useCallback(
    (variant: BannerVariant) =>
      (message: string, options?: Partial<IBannerOptions>): string => {
        return show({
          message,
          variant,
          ...options,
        } as IBannerOptions);
      },
    [show]
  );

  // Variant shortcuts
  const info = useMemo(
    () => createVariantShow('info'),
    [createVariantShow]
  );

  const success = useMemo(
    () => createVariantShow('success'),
    [createVariantShow]
  );

  const warning = useMemo(
    () => createVariantShow('warning'),
    [createVariantShow]
  );

  const error = useMemo(
    () => createVariantShow('error'),
    [createVariantShow]
  );

  const announcement = useMemo(
    () => createVariantShow('announcement'),
    [createVariantShow]
  );

  /**
   * Hide specific banner
   */
  const hide = useCallback(
    (id: string): void => {
      const banner = manager.get(id);
      if (banner) {
        const options = banner.options as IBannerOptions;

        // Remember dismiss if specified
        if (options.rememberDismiss && isLocalStorageAvailable()) {
          try {
            localStorage.setItem(
              STORAGE_PREFIX + options.rememberDismiss,
              'true'
            );
          } catch {
            // Ignore errors
          }
        }

        // Call onDismiss callback
        options.onDismiss?.();

        // Remove from manager
        manager.remove(id);
      }
    },
    [manager]
  );

  /**
   * Hide all banners
   */
  const hideAll = useCallback((): void => {
    manager.removeAll('banner');
  }, [manager]);

  /**
   * Update banner
   */
  const update = useCallback(
    (id: string, options: Partial<IBannerOptions>): void => {
      manager.update(id, options);
    },
    [manager]
  );

  return {
    show,
    info,
    success,
    warning,
    error,
    announcement,
    hide,
    hideAll,
    update,
    banners,
    isDismissed,
    clearDismissed,
  };
}
