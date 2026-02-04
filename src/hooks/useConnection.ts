/**
 * useConnection hook
 * Provides connection status monitoring and offline action queue
 * Automatically detects online/offline state and shows banners
 */

import { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';
import type { IConnectionOptions } from '../core/types';

/**
 * Queued action type
 */
export type QueuedAction = () => Promise<void>;

/**
 * Return type for useConnection hook
 */
export interface IUseConnectionReturn {
  /** Current connection status - true if online */
  isOnline: boolean;
  /** Is currently checking for reconnection */
  isReconnecting: boolean;
  /** Time since offline (ms), null if online */
  offlineDuration: number | null;
  /** Manually show offline banner */
  showOffline: (message?: string) => void;
  /** Manually show online banner */
  showOnline: (message?: string) => void;
  /** Manually show reconnecting state */
  showReconnecting: (message?: string) => void;
  /** Manually trigger reconnection check */
  checkConnection: () => Promise<boolean>;
  /** Queue an action to run when back online */
  queueAction: (action: QueuedAction) => void;
  /** Get current queue size */
  getQueueSize: () => number;
  /** Clear the action queue */
  clearQueue: () => void;
}

/**
 * Default connection options
 */
const DEFAULT_OPTIONS: IConnectionOptions = {
  enabled: true,
  offlineMessage: 'You are offline. Changes will be saved when connection is restored.',
  onlineMessage: 'Connection restored!',
  reconnectingMessage: 'Reconnecting...',
  position: 'top',
  onlineDismissDelay: 3000,
  showReconnecting: true,
  pingInterval: 5000,
  maxQueueSize: 100,
};

/**
 * useConnection hook
 * Monitors network connectivity and provides offline handling
 *
 * @param options - Optional connection options (merged with provider options)
 * @returns Connection management methods
 * @throws Error if used outside FeedbackProvider
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const { isOnline, queueAction } = useConnection();
 *
 *   const handleSave = async () => {
 *     if (!isOnline) {
 *       queueAction(async () => {
 *         await saveData();
 *       });
 *       return;
 *     }
 *     await saveData();
 *   };
 *
 *   return (
 *     <button onClick={handleSave}>
 *       {isOnline ? 'Save' : 'Save Offline'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useConnection(options?: Partial<IConnectionOptions>): IUseConnectionReturn {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useConnection must be used within FeedbackProvider');
  }

  const { manager } = context;

  // Merge options with defaults
  const mergedOptions: IConnectionOptions = useMemo(() => ({
    ...DEFAULT_OPTIONS,
    ...options,
  }), [options]);

  // State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    // SSR-safe initial value
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [offlineStartTime, setOfflineStartTime] = useState<number | null>(null);

  // Refs for cleanup and state persistence
  const actionQueueRef = useRef<QueuedAction[]>([]);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const offlineBannerIdRef = useRef<string | null>(null);
  const reconnectingBannerIdRef = useRef<string | null>(null);

  /**
   * Calculate offline duration
   */
  const offlineDuration = offlineStartTime ? Date.now() - offlineStartTime : null;

  /**
   * Clear ping interval
   */
  const clearPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  /**
   * Remove offline banner
   */
  const removeOfflineBanner = useCallback(() => {
    if (offlineBannerIdRef.current) {
      manager.remove(offlineBannerIdRef.current);
      offlineBannerIdRef.current = null;
    }
  }, [manager]);

  /**
   * Remove reconnecting banner
   */
  const removeReconnectingBanner = useCallback(() => {
    if (reconnectingBannerIdRef.current) {
      manager.remove(reconnectingBannerIdRef.current);
      reconnectingBannerIdRef.current = null;
    }
  }, [manager]);

  /**
   * Process queued actions
   */
  const processQueue = useCallback(async () => {
    const queue = [...actionQueueRef.current];
    actionQueueRef.current = [];

    for (const action of queue) {
      try {
        await action();
      } catch (error) {
        console.error('[useConnection] Failed to process queued action:', error);
      }
    }
  }, []);

  /**
   * Internal ping check
   */
  const checkConnectionInternal = useCallback(async (): Promise<boolean> => {
    if (mergedOptions.pingUrl) {
      try {
        const response = await fetch(mergedOptions.pingUrl, {
          method: 'HEAD',
          cache: 'no-store',
        });
        return response.ok;
      } catch {
        return false;
      }
    }
    // Fall back to navigator.onLine
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }, [mergedOptions.pingUrl]);

  /**
   * Handle going online
   */
  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setIsReconnecting(false);
    setOfflineStartTime(null);

    // Clear intervals and banners
    clearPingInterval();
    removeOfflineBanner();
    removeReconnectingBanner();

    // Show online banner if enabled
    if (mergedOptions.enabled) {
      manager.add('banner', {
        message: mergedOptions.onlineMessage ?? 'Connection restored!',
        variant: 'success',
        position: mergedOptions.position ?? 'top',
        duration: mergedOptions.onlineDismissDelay ?? 3000,
        dismissible: true,
      });
    }

    // Process queued actions
    void processQueue();

    // Callback
    mergedOptions.onOnline?.();
  }, [
    manager,
    mergedOptions,
    clearPingInterval,
    removeOfflineBanner,
    removeReconnectingBanner,
    processQueue,
  ]);

  /**
   * Start ping interval for reconnection check
   */
  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {return;}

    const interval = mergedOptions.pingInterval ?? 5000;

    pingIntervalRef.current = setInterval(() => {
      // Show reconnecting state if enabled
      if (mergedOptions.showReconnecting && !reconnectingBannerIdRef.current) {
        setIsReconnecting(true);
        mergedOptions.onReconnecting?.();
      }

      void checkConnectionInternal().then((online) => {
        if (online) {
          handleOnline();
        } else {
          setIsReconnecting(false);
        }
      });
    }, interval);
  }, [mergedOptions, checkConnectionInternal, handleOnline]);

  /**
   * Handle going offline
   */
  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setOfflineStartTime(Date.now());

    // Show offline banner if enabled
    if (mergedOptions.enabled) {
      const bannerId = manager.add('banner', {
        message: mergedOptions.offlineMessage ?? 'You are offline.',
        variant: 'warning',
        position: mergedOptions.position ?? 'top',
        dismissible: false,
        duration: 0, // Don't auto-dismiss
      });
      offlineBannerIdRef.current = bannerId;
    }

    // Start ping interval
    startPingInterval();

    // Callback
    mergedOptions.onOffline?.();
  }, [manager, mergedOptions, startPingInterval]);

  /**
   * Public connection check
   */
  const checkConnection = useCallback(async (): Promise<boolean> => {
    const online = await checkConnectionInternal();

    if (online && !isOnline) {
      handleOnline();
    } else if (!online && isOnline) {
      handleOffline();
    }

    return online;
  }, [checkConnectionInternal, isOnline, handleOnline, handleOffline]);

  /**
   * Queue action for when back online
   */
  const queueAction = useCallback(
    (action: QueuedAction): void => {
      const maxSize = mergedOptions.maxQueueSize ?? 100;

      if (actionQueueRef.current.length >= maxSize) {
        console.warn('[useConnection] Action queue is full. Oldest action removed.');
        actionQueueRef.current.shift();
      }

      actionQueueRef.current.push(action);
    },
    [mergedOptions.maxQueueSize]
  );

  /**
   * Get current queue size
   */
  const getQueueSize = useCallback((): number => {
    return actionQueueRef.current.length;
  }, []);

  /**
   * Clear the action queue
   */
  const clearQueue = useCallback((): void => {
    actionQueueRef.current = [];
  }, []);

  /**
   * Manually show offline banner
   */
  const showOffline = useCallback(
    (message?: string): void => {
      manager.add('banner', {
        message: message ?? mergedOptions.offlineMessage ?? 'You are offline.',
        variant: 'warning',
        position: mergedOptions.position ?? 'top',
        dismissible: true,
      });
    },
    [manager, mergedOptions]
  );

  /**
   * Manually show online banner
   */
  const showOnline = useCallback(
    (message?: string): void => {
      manager.add('banner', {
        message: message ?? mergedOptions.onlineMessage ?? 'Connection restored!',
        variant: 'success',
        position: mergedOptions.position ?? 'top',
        duration: mergedOptions.onlineDismissDelay ?? 3000,
        dismissible: true,
      });
    },
    [manager, mergedOptions]
  );

  /**
   * Manually show reconnecting banner
   */
  const showReconnecting = useCallback(
    (message?: string): void => {
      manager.add('banner', {
        message: message ?? mergedOptions.reconnectingMessage ?? 'Reconnecting...',
        variant: 'info',
        position: mergedOptions.position ?? 'top',
        dismissible: false,
      });
    },
    [manager, mergedOptions]
  );

  /**
   * Set up event listeners
   */
  useEffect(() => {
    if (typeof window === 'undefined') {return;}

    const onlineHandler = (): void => {
      handleOnline();
    };

    const offlineHandler = (): void => {
      handleOffline();
    };

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    // Check initial state
    if (!navigator.onLine && isOnline) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
      clearPingInterval();
      removeOfflineBanner();
      removeReconnectingBanner();
    };
  }, [handleOnline, handleOffline, clearPingInterval, removeOfflineBanner, removeReconnectingBanner, isOnline]);

  return {
    isOnline,
    isReconnecting,
    offlineDuration,
    showOffline,
    showOnline,
    showReconnecting,
    checkConnection,
    queueAction,
    getQueueSize,
    clearQueue,
  };
}
