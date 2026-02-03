/**
 * @vitest-environment jsdom
 */

/**
 * useBanner hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useBanner } from './useBanner';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IBannerOptions } from '../core/types';

/**
 * Wrapper component for renderHook
 */
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider
        renderToasts={false}
        renderModals={false}
        renderLoadings={false}
        renderConfirms={false}
        renderBanners={false}
      >
        {children}
      </FeedbackProvider>
    );
  };
}

/**
 * Mock localStorage
 */
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

describe('useBanner', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useFakeTimers();

    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    mockLocalStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('show()', () => {
    it('should add banner to store and return id', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test banner' });
      });

      expect(id!).toBeDefined();
      expect(typeof id!).toBe('string');

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners).toHaveLength(1);
      expect(banners[0]?.options).toHaveProperty('message', 'Test banner');
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({ message: 'Test message' });
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.position).toBe('top');
      expect(options?.sticky).toBe(true);
      expect(options?.dismissible).toBe(true);
      expect(options?.fullWidth).toBe(true);
      expect(options?.centered).toBe(true);
      expect(options?.variant).toBe('default');
    });

    it('should apply custom options', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.show({
          message: 'Test message',
          title: 'Custom Title',
          variant: 'warning',
          position: 'bottom',
          sticky: false,
        });
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.title).toBe('Custom Title');
      expect(options?.variant).toBe('warning');
      expect(options?.position).toBe('bottom');
      expect(options?.sticky).toBe(false);
    });

    it('should not show banner if already dismissed (rememberDismiss)', () => {
      // Set as already dismissed
      mockLocalStorage.setItem('omnifeedback_banner_dismissed_cookie-consent', 'true');

      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({
          message: 'Cookie consent',
          rememberDismiss: 'cookie-consent',
        });
      });

      expect(id!).toBe(''); // Empty string when already dismissed

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners).toHaveLength(0);
    });
  });

  describe('Variant shortcuts', () => {
    it('should show info banner', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.info('Info message');
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.message).toBe('Info message');
      expect(options?.variant).toBe('info');
    });

    it('should show success banner', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.success('Success message');
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.message).toBe('Success message');
      expect(options?.variant).toBe('success');
    });

    it('should show warning banner', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.warning('Warning message');
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.message).toBe('Warning message');
      expect(options?.variant).toBe('warning');
    });

    it('should show error banner', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.error('Error message');
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.message).toBe('Error message');
      expect(options?.variant).toBe('error');
    });

    it('should show announcement banner', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.announcement('New feature available!');
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.message).toBe('New feature available!');
      expect(options?.variant).toBe('announcement');
    });

    it('should allow custom options with variant shortcuts', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.warning('Warning with options', {
          title: 'Attention',
          position: 'bottom',
        });
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.title).toBe('Attention');
      expect(options?.position).toBe('bottom');
      expect(options?.variant).toBe('warning');
    });
  });

  describe('hide()', () => {
    it('should remove banner by id', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Test' });
      });

      // Verify banner exists
      let banners = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'banner'
      );
      expect(banners).toHaveLength(1);

      act(() => {
        result.current.hide(id!);
      });

      // Wait for removal
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify banner is removed
      banners = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'banner' && item.status !== 'removed'
      );
      expect(banners).toHaveLength(0);
    });

    it('should save dismiss state to localStorage when rememberDismiss is set', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({
          message: 'Cookie consent',
          rememberDismiss: 'cookie-consent',
        });
      });

      act(() => {
        result.current.hide(id!);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'omnifeedback_banner_dismissed_cookie-consent',
        'true'
      );
    });

    it('should call onDismiss callback when hiding', () => {
      const onDismiss = vi.fn();
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({
          message: 'Test',
          onDismiss,
        });
      });

      act(() => {
        result.current.hide(id!);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('hideAll()', () => {
    it('should remove all banners', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      // Add multiple banners
      act(() => {
        result.current.info('Banner 1');
        result.current.warning('Banner 2');
        result.current.error('Banner 3');
      });

      // Verify banners exist
      let banners = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'banner'
      );
      expect(banners).toHaveLength(3);

      act(() => {
        result.current.hideAll();
      });

      // Wait for removal
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify all banners are removed
      banners = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'banner' && item.status !== 'removed'
      );
      expect(banners).toHaveLength(0);
    });
  });

  describe('update()', () => {
    it('should update banner options', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.show({ message: 'Original message' });
      });

      act(() => {
        result.current.update(id!, { message: 'Updated message' });
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.message).toBe('Updated message');
    });

    it('should update banner variant', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.info('Info banner');
      });

      act(() => {
        result.current.update(id!, { variant: 'success' });
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.variant).toBe('success');
    });
  });

  describe('banners (reactive list)', () => {
    it('should return current banners', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      expect(result.current.banners).toHaveLength(0);

      act(() => {
        result.current.info('Banner 1');
      });

      expect(result.current.banners).toHaveLength(1);

      act(() => {
        result.current.warning('Banner 2');
      });

      expect(result.current.banners).toHaveLength(2);
    });
  });

  describe('isDismissed()', () => {
    it('should return true if banner was previously dismissed', () => {
      mockLocalStorage.setItem('omnifeedback_banner_dismissed_test-key', 'true');

      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isDismissed('test-key')).toBe(true);
    });

    it('should return false if banner was not dismissed', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isDismissed('unknown-key')).toBe(false);
    });
  });

  describe('clearDismissed()', () => {
    it('should remove dismissed state from localStorage', () => {
      mockLocalStorage.setItem('omnifeedback_banner_dismissed_test-key', 'true');

      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isDismissed('test-key')).toBe(true);

      act(() => {
        result.current.clearDismissed('test-key');
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'omnifeedback_banner_dismissed_test-key'
      );
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useBanner());
      }).toThrow('useBanner must be used within FeedbackProvider');
    });
  });

  describe('Cookie Consent Scenario', () => {
    it('should implement cookie consent flow', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      // User opens page for first time
      expect(result.current.isDismissed('cookie-consent')).toBe(false);

      // Show cookie banner
      let bannerId: string;
      act(() => {
        bannerId = result.current.show({
          message: 'This site uses cookies.',
          variant: 'info',
          position: 'bottom',
          rememberDismiss: 'cookie-consent',
          actions: [
            { label: 'Accept', onClick: () => {}, variant: 'primary' },
          ],
        });
      });

      expect(bannerId!).not.toBe('');

      // User dismisses banner
      act(() => {
        result.current.hide(bannerId!);
      });

      // localStorage should remember
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'omnifeedback_banner_dismissed_cookie-consent',
        'true'
      );
    });

    it('should not show cookie banner on subsequent visits', () => {
      // Simulate returning user
      mockLocalStorage.setItem('omnifeedback_banner_dismissed_cookie-consent', 'true');

      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      // Try to show cookie banner
      let bannerId: string;
      act(() => {
        bannerId = result.current.show({
          message: 'This site uses cookies.',
          rememberDismiss: 'cookie-consent',
        });
      });

      // Banner should not be shown
      expect(bannerId!).toBe('');
      expect(result.current.banners).toHaveLength(0);
    });
  });

  describe('Maintenance Banner Scenario', () => {
    it('should implement non-dismissible maintenance banner', () => {
      const { result } = renderHook(() => useBanner(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.warning('Scheduled maintenance: 10 PM - 2 AM', {
          title: 'Scheduled Maintenance',
          dismissible: false,
        });
      });

      const store = useFeedbackStore.getState();
      const banner = Array.from(store.items.values()).find(
        (item) => item.type === 'banner'
      );
      const options = banner?.options as IBannerOptions | undefined;

      expect(options?.dismissible).toBe(false);
      expect(options?.variant).toBe('warning');
      expect(options?.title).toBe('Scheduled Maintenance');
    });
  });
});
