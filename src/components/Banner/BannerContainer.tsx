/**
 * BannerContainer - Renders banners via portal
 * Supports top and bottom positioning with separate containers
 */

import { memo, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { FeedbackContext } from '../../providers/FeedbackContext';
import { useAdapter } from '../../hooks/useAdapter';
import { Banner } from './Banner';
import type { IBannerProps } from './Banner';
import type { IFeedbackItem } from '../../core/types';
import type { IAdapterBannerProps, BannerPosition, FeedbackVariant } from '../../adapters/types';

/**
 * Z-index for banners
 */
const Z_INDEX_BANNER = 9500;

/**
 * Maximum visible banners per position
 */
const MAX_BANNERS_PER_POSITION = 3;

/**
 * BannerContainer component
 * Renders banners using portal to document body
 * Supports top and bottom positioning
 *
 * @example
 * ```tsx
 * // Used internally by FeedbackProvider
 * <FeedbackProvider>
 *   <App />
 *   <BannerContainer />
 * </FeedbackProvider>
 * ```
 */
export const BannerContainer = memo(function BannerContainer() {
  const context = useContext(FeedbackContext);
  const { adapter } = useAdapter();

  // Get all banner items from store
  const banners = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item): item is IFeedbackItem<'banner'> =>
        item.type === 'banner' && item.status !== 'removed'
    )
  );

  // Don't render if no banners or no context
  if (banners.length === 0 || !context) {
    return null;
  }

  // SSR safety check
  if (typeof document === 'undefined') {
    return null;
  }

  const { manager } = context;

  // Group by position
  const topBanners = banners
    .filter((b) => {
      const options = b.options;
      return options.position !== 'bottom';
    })
    .slice(0, MAX_BANNERS_PER_POSITION);

  const bottomBanners = banners
    .filter((b) => {
      const options = b.options;
      return options.position === 'bottom';
    })
    .slice(0, MAX_BANNERS_PER_POSITION);

  // Helper to build banner props with exactOptionalPropertyTypes compliance
  const buildBannerProps = (banner: IFeedbackItem<'banner'>): IBannerProps => {
    const options = banner.options;
    return {
      message: options.message,
      status: banner.status,
      onRequestDismiss: () => {
        // Call onDismiss callback
        options.onDismiss?.();
        // Handle rememberDismiss
        if (options.rememberDismiss) {
          try {
            localStorage.setItem(
              `omnifeedback_banner_dismissed_${options.rememberDismiss}`,
              'true'
            );
          } catch {
            // localStorage might not be available
          }
        }
        manager.remove(banner.id);
      },
      testId: options.testId ?? `banner-${banner.id}`,
      ...(options.title !== undefined && { title: options.title }),
      ...(options.variant !== undefined && { variant: options.variant }),
      ...(options.position !== undefined && { position: options.position }),
      ...(options.sticky !== undefined && { sticky: options.sticky }),
      ...(options.dismissible !== undefined && { dismissible: options.dismissible }),
      ...(options.icon !== undefined && { icon: options.icon }),
      ...(options.hideIcon !== undefined && { hideIcon: options.hideIcon }),
      ...(options.actions !== undefined && { actions: options.actions }),
      ...(options.fullWidth !== undefined && { fullWidth: options.fullWidth }),
      ...(options.centered !== undefined && { centered: options.centered }),
      ...(options.className !== undefined && { className: options.className }),
      ...(options.style !== undefined && { style: options.style }),
    };
  };

  return (
    <>
      {/* Top Banners */}
      {topBanners.length > 0 &&
        createPortal(
          <div
            className="fixed top-0 left-0 right-0 flex flex-col"
            style={{ zIndex: Z_INDEX_BANNER }}
            data-testid="banner-container-top"
          >
            {topBanners.map((banner) => {
              if (adapter) {
                const AdapterBanner = adapter.BannerComponent;
                const opts = banner.options;
                const firstAction = opts.actions?.[0];
                const adapterProps: IAdapterBannerProps = {
                  message: opts.message,
                  variant: (opts.variant ?? 'info') as FeedbackVariant,
                  position: (opts.position ?? 'top') as BannerPosition,
                  dismissible: opts.dismissible ?? true,
                  status: banner.status,
                  onDismiss: () => buildBannerProps(banner).onRequestDismiss(),
                  ...(opts.title !== undefined && { title: opts.title }),
                  ...(opts.icon !== undefined && { icon: opts.icon }),
                  ...(firstAction !== undefined && { action: firstAction }),
                  ...(opts.className !== undefined && { className: opts.className }),
                  ...(opts.style !== undefined && { style: opts.style }),
                  ...(opts.testId !== undefined && { testId: opts.testId }),
                };
                return <AdapterBanner key={banner.id} {...adapterProps} />;
              }
              return <Banner key={banner.id} {...buildBannerProps(banner)} />;
            })}
          </div>,
          document.body
        )}

      {/* Bottom Banners */}
      {bottomBanners.length > 0 &&
        createPortal(
          <div
            className="fixed bottom-0 left-0 right-0 flex flex-col-reverse"
            style={{ zIndex: Z_INDEX_BANNER }}
            data-testid="banner-container-bottom"
          >
            {bottomBanners.map((banner) => {
              if (adapter) {
                const AdapterBanner = adapter.BannerComponent;
                const opts = banner.options;
                const firstAction = opts.actions?.[0];
                const adapterProps: IAdapterBannerProps = {
                  message: opts.message,
                  variant: (opts.variant ?? 'info') as FeedbackVariant,
                  position: (opts.position ?? 'bottom') as BannerPosition,
                  dismissible: opts.dismissible ?? true,
                  status: banner.status,
                  onDismiss: () => buildBannerProps(banner).onRequestDismiss(),
                  ...(opts.title !== undefined && { title: opts.title }),
                  ...(opts.icon !== undefined && { icon: opts.icon }),
                  ...(firstAction !== undefined && { action: firstAction }),
                  ...(opts.className !== undefined && { className: opts.className }),
                  ...(opts.style !== undefined && { style: opts.style }),
                  ...(opts.testId !== undefined && { testId: opts.testId }),
                };
                return <AdapterBanner key={banner.id} {...adapterProps} />;
              }
              return <Banner key={banner.id} {...buildBannerProps(banner)} />;
            })}
          </div>,
          document.body
        )}
    </>
  );
});

BannerContainer.displayName = 'BannerContainer';
