# Design: Banner System

## Overview
Implement a page-level banner/announcement system for displaying important messages at the top or bottom of the page.

## Goals
- Full-width announcement banners
- Multiple variants (info, warning, success, error)
- Sticky positioning (top/bottom)
- Dismissible with remember preference
- Action buttons support
- Cookie consent ready
- Maintenance mode support
- Work with all UI library adapters

## Banner Types

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎉 Yeni özellikler eklendi! Detaylar için tıklayın.    [İncele] [X] │
└─────────────────────────────────────────────────────────────────┘
                              ↑ Announcement Banner (Top)

┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ Sistem bakımı: 22:00-02:00 arası hizmet veremeyeceğiz.    [X] │
└─────────────────────────────────────────────────────────────────┘
                              ↑ Warning Banner (Top)

┌─────────────────────────────────────────────────────────────────┐
│ 🍪 Bu site çerez kullanmaktadır.    [Kabul Et] [Ayarlar] [Reddet] │
└─────────────────────────────────────────────────────────────────┘
                              ↑ Cookie Consent Banner (Bottom)
```

## Banner API

### useBanner Hook Interface

```typescript
// src/hooks/useBanner.ts

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
  
  /** Get active banners */
  banners: IBannerItem[];
}
```

### Banner Options

```typescript
// From src/core/types.ts

export interface IBannerOptions extends IBaseFeedbackOptions {
  /** Banner message (required) */
  message: string;
  /** Banner title (optional) */
  title?: string;
  /** Visual variant */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'announcement' | 'default';
  /** Position on screen */
  position?: 'top' | 'bottom';
  /** Sticky behavior */
  sticky?: boolean;
  /** Show close button */
  dismissible?: boolean;
  /** Remember dismiss (localStorage key) */
  rememberDismiss?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Hide icon */
  hideIcon?: boolean;
  /** Action buttons */
  actions?: IBannerAction[];
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Full width or contained */
  fullWidth?: boolean;
  /** Auto dismiss duration (0 = never) */
  duration?: number;
  /** Center content */
  centered?: boolean;
}

export interface IBannerAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'link';
}
```

## Usage Examples

```typescript
import { useFeedback } from 'omnifeedback';

function MyComponent() {
  const { banner } = useFeedback();

  // Simple announcement
  const showAnnouncement = () => {
    banner.announcement('🎉 Yeni özellikler eklendi!', {
      actions: [{ label: 'İncele', onClick: () => navigate('/changelog') }],
    });
  };

  // Maintenance warning
  const showMaintenance = () => {
    banner.warning('Sistem bakımı: 22:00-02:00 arası hizmet veremeyeceğiz.', {
      position: 'top',
      sticky: true,
      dismissible: false,
    });
  };

  // Cookie consent
  const showCookieConsent = () => {
    banner.show({
      message: 'Bu site çerez kullanmaktadır. Devam ederek çerez politikamızı kabul etmiş olursunuz.',
      variant: 'info',
      position: 'bottom',
      sticky: true,
      dismissible: false,
      rememberDismiss: 'cookie-consent-accepted',
      actions: [
        { label: 'Kabul Et', onClick: acceptCookies, variant: 'primary' },
        { label: 'Ayarlar', onClick: openSettings, variant: 'secondary' },
        { label: 'Reddet', onClick: rejectCookies, variant: 'link' },
      ],
    });
  };

  // Success banner with auto-dismiss
  const showSuccess = () => {
    banner.success('Değişiklikler başarıyla kaydedildi!', {
      duration: 5000,
      dismissible: true,
    });
  };

  // Error banner
  const showError = () => {
    banner.error('Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.', {
      sticky: true,
      actions: [{ label: 'Yeniden Dene', onClick: retry }],
    });
  };

  // Remember dismiss (won't show again after dismissed)
  const showOnce = () => {
    banner.info('Yeni arayüze hoş geldiniz!', {
      rememberDismiss: 'welcome-banner-v2',
      dismissible: true,
    });
  };

  return (
    <div>
      <button onClick={showAnnouncement}>Duyuru</button>
      <button onClick={showMaintenance}>Bakım</button>
      <button onClick={showCookieConsent}>Cookie</button>
    </div>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useBanner.ts

import { useCallback, useContext, useMemo } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IBannerOptions, FeedbackVariant } from '../core/types';

const STORAGE_PREFIX = 'omnifeedback_banner_dismissed_';

export function useBanner(): IUseBannerReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useBanner must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Get banners from store
  const banners = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'banner' && item.status !== 'removed'
    )
  );

  const show = useCallback(
    (options: IBannerOptions): string => {
      // Check if already dismissed (rememberDismiss)
      if (options.rememberDismiss) {
        const isDismissed = localStorage.getItem(
          STORAGE_PREFIX + options.rememberDismiss
        );
        if (isDismissed === 'true') {
          return ''; // Don't show
        }
      }

      return manager.add('banner', {
        position: 'top',
        sticky: true,
        dismissible: true,
        fullWidth: true,
        centered: true,
        duration: 0,
        ...options,
      });
    },
    [manager]
  );

  const createVariantBanner = useCallback(
    (variant: FeedbackVariant) =>
      (message: string, options?: Partial<IBannerOptions>): string => {
        return show({ message, variant, ...options });
      },
    [show]
  );

  const info = useCallback(
    (message: string, options?: Partial<IBannerOptions>) =>
      show({ message, variant: 'info', ...options }),
    [show]
  );

  const success = useCallback(
    (message: string, options?: Partial<IBannerOptions>) =>
      show({ message, variant: 'success', ...options }),
    [show]
  );

  const warning = useCallback(
    (message: string, options?: Partial<IBannerOptions>) =>
      show({ message, variant: 'warning', ...options }),
    [show]
  );

  const error = useCallback(
    (message: string, options?: Partial<IBannerOptions>) =>
      show({ message, variant: 'error', ...options }),
    [show]
  );

  const announcement = useCallback(
    (message: string, options?: Partial<IBannerOptions>) =>
      show({ message, variant: 'announcement', ...options }),
    [show]
  );

  const hide = useCallback(
    (id: string): void => {
      const banner = manager.get(id);
      if (banner) {
        const options = banner.options as IBannerOptions;
        
        // Remember dismiss if specified
        if (options.rememberDismiss) {
          localStorage.setItem(
            STORAGE_PREFIX + options.rememberDismiss,
            'true'
          );
        }

        options.onDismiss?.();
        manager.remove(id);
      }
    },
    [manager]
  );

  const hideAll = useCallback((): void => {
    manager.removeAll('banner');
  }, [manager]);

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
  };
}
```

## Component Architecture

### Banner Component (Headless)

```typescript
// src/components/Banner/Banner.tsx

import React, { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils/classNames';
import type { IBannerOptions, FeedbackStatus } from '../../core/types';

export interface IBannerProps extends IBannerOptions {
  status: FeedbackStatus;
  onRequestDismiss: () => void;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  announcement: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent',
};

const iconMap = {
  default: <InfoIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <ExclamationTriangleIcon />,
  error: <XCircleIcon />,
  announcement: <MegaphoneIcon />,
};

export const Banner = memo(
  forwardRef<HTMLDivElement, IBannerProps>(function Banner(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      position = 'top',
      sticky = true,
      dismissible = true,
      icon,
      hideIcon = false,
      actions,
      fullWidth = true,
      centered = true,
      status,
      onRequestDismiss,
      className,
      style,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        requestAnimationFrame(() => setIsVisible(true));
      }
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    const displayIcon = hideIcon ? null : (icon ?? iconMap[variant]);

    return (
      <div
        ref={ref}
        role="banner"
        aria-live="polite"
        data-testid={testId}
        className={cn(
          'w-full border-b',
          sticky && 'sticky z-50',
          position === 'top' ? 'top-0' : 'bottom-0',
          'transition-all duration-300 ease-out',
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : position === 'top' 
              ? 'opacity-0 -translate-y-full'
              : 'opacity-0 translate-y-full',
          variantStyles[variant],
          className
        )}
        style={style}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3',
            fullWidth ? 'w-full' : 'max-w-7xl mx-auto',
            centered && 'justify-center'
          )}
        >
          {/* Icon */}
          {displayIcon && (
            <span className="flex-shrink-0">{displayIcon}</span>
          )}

          {/* Content */}
          <div className={cn('flex-1', centered && 'text-center')}>
            {title && (
              <span className="font-semibold mr-2">{title}</span>
            )}
            <span className="text-sm">{message}</span>
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    'text-sm font-medium px-3 py-1 rounded transition-colors',
                    action.variant === 'primary' && 
                      'bg-white/20 hover:bg-white/30 text-current',
                    action.variant === 'secondary' && 
                      'border border-current/30 hover:bg-current/10',
                    action.variant === 'link' && 
                      'underline hover:no-underline'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Dismiss Button */}
          {dismissible && (
            <button
              type="button"
              onClick={onRequestDismiss}
              className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
              aria-label="Dismiss banner"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  })
);

Banner.displayName = 'Banner';
```

### Banner Container

```typescript
// src/components/Banner/BannerContainer.tsx

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { useFeedbackStore } from '../../core/FeedbackStore';
import { useAdapter } from '../../providers/FeedbackProvider';
import { getFeedbackManager } from '../../core/FeedbackManager';
import { Z_INDEX } from '../../utils/constants';

export const BannerContainer = memo(function BannerContainer() {
  const adapter = useAdapter();
  const BannerComponent = adapter.BannerComponent;
  const manager = getFeedbackManager();

  const banners = useFeedbackStore((state) =>
    Array.from(state.items.values()).filter(
      (item) => item.type === 'banner' && item.status !== 'removed'
    )
  );

  if (banners.length === 0) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  // Group by position
  const topBanners = banners.filter(
    (b) => (b.options as IBannerOptions).position !== 'bottom'
  );
  const bottomBanners = banners.filter(
    (b) => (b.options as IBannerOptions).position === 'bottom'
  );

  return (
    <>
      {/* Top Banners */}
      {topBanners.length > 0 &&
        createPortal(
          <div
            className="fixed top-0 left-0 right-0 flex flex-col"
            style={{ zIndex: Z_INDEX.BANNER }}
          >
            {topBanners.map((banner) => (
              <BannerComponent
                key={banner.id}
                {...banner.options}
                status={banner.status}
                onRequestDismiss={() => manager.remove(banner.id)}
              />
            ))}
          </div>,
          document.body
        )}

      {/* Bottom Banners */}
      {bottomBanners.length > 0 &&
        createPortal(
          <div
            className="fixed bottom-0 left-0 right-0 flex flex-col-reverse"
            style={{ zIndex: Z_INDEX.BANNER }}
          >
            {bottomBanners.map((banner) => (
              <BannerComponent
                key={banner.id}
                {...banner.options}
                status={banner.status}
                onRequestDismiss={() => manager.remove(banner.id)}
              />
            ))}
          </div>,
          document.body
        )}
    </>
  );
});

BannerContainer.displayName = 'BannerContainer';
```

## Accessibility Requirements

### ARIA Attributes

```typescript
role="banner"
aria-live="polite"

// Dismiss button
aria-label="Dismiss banner"
```

## Testing Checklist

### Unit Tests

```typescript
describe('useBanner', () => {
  it('should show banner with default options', () => {});
  it('should show info variant', () => {});
  it('should show success variant', () => {});
  it('should show warning variant', () => {});
  it('should show error variant', () => {});
  it('should show announcement variant', () => {});
  it('should hide specific banner', () => {});
  it('should hide all banners', () => {});
  it('should remember dismiss in localStorage', () => {});
  it('should not show if already dismissed', () => {});
  it('should auto-dismiss after duration', () => {});
});

describe('Banner', () => {
  it('should render message', () => {});
  it('should render title', () => {});
  it('should render icon', () => {});
  it('should render action buttons', () => {});
  it('should render at top position', () => {});
  it('should render at bottom position', () => {});
  it('should be sticky', () => {});
  it('should apply variant styles', () => {});
  it('should call onDismiss', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useBanner.ts`
- [ ] Create `src/components/Banner/Banner.tsx`
- [ ] Create `src/components/Banner/BannerContainer.tsx`
- [ ] Create `src/components/Banner/index.ts`
- [ ] Add banner to core types
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test localStorage remember dismiss
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Z-Index Issues
❌ **Don't:** Use arbitrary z-index
✅ **Do:** Use Z_INDEX.BANNER constant

### 2. Layout Shift
❌ **Don't:** Insert banner without reserving space
✅ **Do:** Use sticky positioning or reserve space

### 3. Remember Dismiss
❌ **Don't:** Forget to check localStorage on show
✅ **Do:** Check rememberDismiss before showing

### 4. Multiple Banners
❌ **Don't:** Stack too many banners
✅ **Do:** Limit to 2-3 visible banners

## Notes

- Maximum 3 banners visible at a time
- Top banners stack downward
- Bottom banners stack upward
- Cookie consent should use rememberDismiss
- Announcement variant has gradient background
