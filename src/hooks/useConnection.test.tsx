/**
 * @vitest-environment jsdom
 */

/**
 * useConnection hook unit tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useConnection } from './useConnection';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';

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
        renderDrawers={false}
        renderPopconfirms={false}
      >
        {children}
      </FeedbackProvider>
    );
  };
}

/**
 * Mock navigator.onLine
 */
function mockOnlineStatus(online: boolean): void {
  Object.defineProperty(navigator, 'onLine', {
    value: online,
    writable: true,
    configurable: true,
  });
}

/**
 * Dispatch online/offline event
 */
function dispatchOnlineEvent(): void {
  window.dispatchEvent(new Event('online'));
}

function dispatchOfflineEvent(): void {
  window.dispatchEvent(new Event('offline'));
}

describe('useConnection', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    mockOnlineStatus(true);
    vi.useFakeTimers();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should detect online status initially', () => {
      mockOnlineStatus(true);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOnline).toBe(true);
      expect(result.current.isReconnecting).toBe(false);
      expect(result.current.offlineDuration).toBe(null);
    });

    it('should detect offline status initially', () => {
      mockOnlineStatus(false);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOnline).toBe(false);
    });
  });

  describe('Online/Offline Events', () => {
    it('should update isOnline when going offline', () => {
      mockOnlineStatus(true);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOnline).toBe(true);

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      expect(result.current.isOnline).toBe(false);
    });

    it('should update isOnline when coming back online', () => {
      mockOnlineStatus(false);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        mockOnlineStatus(true);
        dispatchOnlineEvent();
      });

      expect(result.current.isOnline).toBe(true);
    });

    it('should track offline duration', () => {
      mockOnlineStatus(true);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      // Initially should be null (online)
      expect(result.current.offlineDuration).toBe(null);

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      // After going offline, offlineDuration should be a number (>= 0)
      expect(result.current.offlineDuration).not.toBe(null);
      expect(typeof result.current.offlineDuration).toBe('number');
      expect(result.current.offlineDuration).toBeGreaterThanOrEqual(0);
    });

    it('should reset offline duration when coming back online', () => {
      mockOnlineStatus(false);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      expect(result.current.offlineDuration).not.toBe(null);

      act(() => {
        mockOnlineStatus(true);
        dispatchOnlineEvent();
      });

      expect(result.current.offlineDuration).toBe(null);
    });
  });

  describe('Action Queue', () => {
    it('should queue actions', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      const action = vi.fn().mockResolvedValue(undefined);

      act(() => {
        result.current.queueAction(action);
      });

      expect(result.current.getQueueSize()).toBe(1);
    });

    it('should process queued actions when coming back online', async () => {
      mockOnlineStatus(false);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      const action1 = vi.fn().mockResolvedValue(undefined);
      const action2 = vi.fn().mockResolvedValue(undefined);

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      act(() => {
        result.current.queueAction(action1);
        result.current.queueAction(action2);
      });

      expect(result.current.getQueueSize()).toBe(2);

      await act(async () => {
        mockOnlineStatus(true);
        dispatchOnlineEvent();
        // Allow promises to resolve
        await vi.runAllTimersAsync();
      });

      expect(action1).toHaveBeenCalledTimes(1);
      expect(action2).toHaveBeenCalledTimes(1);
      expect(result.current.getQueueSize()).toBe(0);
    });

    it('should clear queue when requested', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.queueAction(async (): Promise<void> => { /* noop */ });
        result.current.queueAction(async (): Promise<void> => { /* noop */ });
      });

      expect(result.current.getQueueSize()).toBe(2);

      act(() => {
        result.current.clearQueue();
      });

      expect(result.current.getQueueSize()).toBe(0);
    });

    it('should limit queue size', () => {
      const { result } = renderHook(() => useConnection({ maxQueueSize: 3 }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.queueAction(async (): Promise<void> => { /* noop */ });
        result.current.queueAction(async (): Promise<void> => { /* noop */ });
        result.current.queueAction(async (): Promise<void> => { /* noop */ });
        result.current.queueAction(async (): Promise<void> => { /* noop */ }); // Should remove oldest
      });

      expect(result.current.getQueueSize()).toBe(3);
    });
  });

  describe('Manual Banner Methods', () => {
    it('should show offline banner manually', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.showOffline('Custom offline message');
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners.length).toBeGreaterThan(0);
      expect(banners[0]?.options).toHaveProperty('message', 'Custom offline message');
      expect(banners[0]?.options).toHaveProperty('variant', 'warning');
    });

    it('should show online banner manually', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.showOnline('Custom online message');
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners.length).toBeGreaterThan(0);
      expect(banners[0]?.options).toHaveProperty('message', 'Custom online message');
      expect(banners[0]?.options).toHaveProperty('variant', 'success');
    });

    it('should show reconnecting banner manually', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.showReconnecting('Trying to reconnect...');
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners.length).toBeGreaterThan(0);
      expect(banners[0]?.options).toHaveProperty('message', 'Trying to reconnect...');
      expect(banners[0]?.options).toHaveProperty('variant', 'info');
    });

    it('should show offline banner with default message', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.showOffline();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners.length).toBeGreaterThan(0);
    });

    it('should show online banner with default message', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.showOnline();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners.length).toBeGreaterThan(0);
    });

    it('should show reconnecting banner with default message', () => {
      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.showReconnecting();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners.length).toBeGreaterThan(0);
    });
  });

  describe('Disabled Mode', () => {
    it('should not show banners when disabled', () => {
      renderHook(
        () => useConnection({ enabled: false }),
        { wrapper: createWrapper() }
      );

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners).toHaveLength(0);
    });

    it('should not show online banner when disabled', () => {
      mockOnlineStatus(false);

      renderHook(
        () => useConnection({ enabled: false }),
        { wrapper: createWrapper() }
      );

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      act(() => {
        mockOnlineStatus(true);
        dispatchOnlineEvent();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners).toHaveLength(0);
    });
  });

  describe('Callbacks', () => {
    it('should call onOffline callback when going offline', () => {
      const onOffline = vi.fn();

      renderHook(() => useConnection({ onOffline }), {
        wrapper: createWrapper(),
      });

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      expect(onOffline).toHaveBeenCalledTimes(1);
    });

    it('should call onOnline callback when coming back online', () => {
      mockOnlineStatus(false);
      const onOnline = vi.fn();

      renderHook(() => useConnection({ onOnline }), {
        wrapper: createWrapper(),
      });

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      act(() => {
        mockOnlineStatus(true);
        dispatchOnlineEvent();
      });

      expect(onOnline).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Options', () => {
    it('should use custom offline message', () => {
      renderHook(
        () =>
          useConnection({
            offlineMessage: 'İnternet bağlantınız kesildi',
          }),
        {
          wrapper: createWrapper(),
        }
      );

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners[0]?.options).toHaveProperty('message', 'İnternet bağlantınız kesildi');
    });

    it('should use custom online message', () => {
      mockOnlineStatus(false);

      renderHook(
        () =>
          useConnection({
            onlineMessage: 'Bağlantı yeniden sağlandı!',
          }),
        {
          wrapper: createWrapper(),
        }
      );

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      act(() => {
        mockOnlineStatus(true);
        dispatchOnlineEvent();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner' && (item.options as { variant?: string }).variant === 'success'
      );

      expect(banners[0]?.options).toHaveProperty('message', 'Bağlantı yeniden sağlandı!');
    });

    it('should use custom banner position', () => {
      renderHook(
        () =>
          useConnection({
            position: 'bottom',
          }),
        {
          wrapper: createWrapper(),
        }
      );

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      const store = useFeedbackStore.getState();
      const banners = Array.from(store.items.values()).filter(
        (item) => item.type === 'banner'
      );

      expect(banners[0]?.options).toHaveProperty('position', 'bottom');
    });
  });

  describe('checkConnection()', () => {
    it('should return current connection status', async () => {
      mockOnlineStatus(true);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      let status = false;

      await act(async () => {
        status = await result.current.checkConnection();
      });

      expect(status).toBe(true);
    });

    it('should trigger offline handling if connection lost', async () => {
      mockOnlineStatus(true);

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOnline).toBe(true);

      // Simulate connection loss
      await act(async () => {
        mockOnlineStatus(false);
        await result.current.checkConnection();
      });

      expect(result.current.isOnline).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useConnection());
      }).toThrow('useConnection must be used within FeedbackProvider');
    });

    it('should handle failed queued actions gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation((): void => { /* noop */ });

      const { result } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      const failingAction = vi.fn().mockRejectedValue(new Error('Action failed'));
      const successAction = vi.fn().mockResolvedValue(undefined);

      act(() => {
        mockOnlineStatus(false);
        dispatchOfflineEvent();
      });

      act(() => {
        result.current.queueAction(failingAction);
        result.current.queueAction(successAction);
      });

      await act(async () => {
        mockOnlineStatus(true);
        dispatchOnlineEvent();
        await vi.runAllTimersAsync();
      });

      // Both actions should have been called
      expect(failingAction).toHaveBeenCalledTimes(1);
      expect(successAction).toHaveBeenCalledTimes(1);

      // Error should have been logged
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Cleanup', () => {
    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useConnection(), {
        wrapper: createWrapper(),
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});
