# Design: Connection Status System

## Overview
Implement an automatic connection status indicator that detects and displays network connectivity changes. Shows offline/online banners and handles reconnection.

## Goals
- Automatic online/offline detection
- Customizable offline banner
- Reconnection detection with notification
- Retry mechanism for failed requests
- Queue actions while offline
- Work with all UI library adapters

## Connection States

```
ONLINE (Normal)
┌─────────────────────────────────────────────────────────────┐
│                     (No indicator shown)                     │
│                        Normal app UI                         │
└─────────────────────────────────────────────────────────────┘

OFFLINE
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ İnternet bağlantınız kesildi. Değişiklikler              │
│    bağlantı sağlandığında kaydedilecek.                     │
├─────────────────────────────────────────────────────────────┤
│                        Normal app UI                         │
│                     (may be disabled)                        │
└─────────────────────────────────────────────────────────────┘

RECONNECTING
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Yeniden bağlanılıyor...                                  │
├─────────────────────────────────────────────────────────────┤
│                        Normal app UI                         │
└─────────────────────────────────────────────────────────────┘

BACK ONLINE
┌─────────────────────────────────────────────────────────────┐
│ ✅ Bağlantı yeniden sağlandı!                      (3s)     │
├─────────────────────────────────────────────────────────────┤
│                        Normal app UI                         │
└─────────────────────────────────────────────────────────────┘
         ↑ Auto-dismisses after 3 seconds
```

## Connection API

### useConnection Hook Interface

```typescript
// src/hooks/useConnection.ts

export interface IUseConnectionReturn {
  /** Current connection status */
  isOnline: boolean;
  
  /** Is currently reconnecting */
  isReconnecting: boolean;
  
  /** Time since offline (ms) */
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
  queueAction: (action: () => Promise<void>) => void;
}
```

### Connection Options (Provider Level)

```typescript
// FeedbackProvider props

export interface IConnectionOptions {
  /** Enable connection monitoring */
  enabled?: boolean;
  
  /** Custom offline message */
  offlineMessage?: string;
  
  /** Custom online message */
  onlineMessage?: string;
  
  /** Custom reconnecting message */
  reconnectingMessage?: string;
  
  /** Banner position */
  position?: 'top' | 'bottom';
  
  /** Auto-dismiss online banner (ms, 0 = no auto-dismiss) */
  onlineDismissDelay?: number;
  
  /** Show reconnecting state */
  showReconnecting?: boolean;
  
  /** Ping URL for connection check */
  pingUrl?: string;
  
  /** Ping interval when offline (ms) */
  pingInterval?: number;
  
  /** Callback when going offline */
  onOffline?: () => void;
  
  /** Callback when coming back online */
  onOnline?: () => void;
  
  /** Callback when reconnecting */
  onReconnecting?: () => void;
}
```

## Usage Examples

```typescript
import { useFeedback, FeedbackProvider } from 'omnifeedback';

// ===== PROVIDER CONFIGURATION =====

function App() {
  return (
    <FeedbackProvider
      connectionStatus={{
        enabled: true,
        offlineMessage: 'İnternet bağlantınız kesildi',
        onlineMessage: 'Bağlantı yeniden sağlandı!',
        position: 'top',
        onlineDismissDelay: 3000,
        onOffline: () => {
          // Pause auto-save, etc.
          pauseAutoSave();
        },
        onOnline: () => {
          // Resume operations
          resumeAutoSave();
          syncPendingChanges();
        },
      }}
    >
      <MyApp />
    </FeedbackProvider>
  );
}

// ===== USING THE HOOK =====

function SaveButton() {
  const { connection } = useFeedback();

  const handleSave = async () => {
    if (!connection.isOnline) {
      // Queue for later
      connection.queueAction(async () => {
        await saveData();
      });
      toast.info('Değişiklikler bağlantı sağlandığında kaydedilecek');
      return;
    }

    await saveData();
  };

  return (
    <button onClick={handleSave} disabled={connection.isReconnecting}>
      {connection.isOnline ? 'Kaydet' : 'Çevrimdışı Kaydet'}
    </button>
  );
}

// ===== CHECKING CONNECTION STATUS =====

function DataFetcher() {
  const { connection } = useFeedback();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (connection.isOnline) {
      fetchData().then(setData);
    }
  }, [connection.isOnline]);

  if (!connection.isOnline) {
    return <OfflineMessage />;
  }

  return <DataDisplay data={data} />;
}

// ===== MANUAL CONNECTION CONTROL =====

function DebugPanel() {
  const { connection } = useFeedback();

  return (
    <div>
      <p>Status: {connection.isOnline ? 'Online' : 'Offline'}</p>
      <p>Offline for: {connection.offlineDuration}ms</p>
      
      <button onClick={() => connection.showOffline('Test offline')}>
        Simulate Offline
      </button>
      <button onClick={() => connection.checkConnection()}>
        Check Connection
      </button>
    </div>
  );
}

// ===== OFFLINE-AWARE FORM =====

function OfflineAwareForm() {
  const { connection, toast } = useFeedback();
  const [pendingData, setPendingData] = useState(null);

  const handleSubmit = async (data) => {
    if (!connection.isOnline) {
      setPendingData(data);
      connection.queueAction(async () => {
        await submitForm(data);
        setPendingData(null);
      });
      toast.info('Form çevrimdışı kaydedildi. Bağlantı sağlandığında gönderilecek.');
      return;
    }

    await submitForm(data);
    toast.success('Form başarıyla gönderildi!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">
        {pendingData ? 'Beklemede...' : 'Gönder'}
      </button>
    </form>
  );
}
```

## Hook Implementation

```typescript
// src/hooks/useConnection.ts

import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { FeedbackContext } from '../providers/FeedbackProvider';

export function useConnection(): IUseConnectionReturn {
  const context = useContext(FeedbackContext);
  
  if (!context) {
    throw new Error('useConnection must be used within FeedbackProvider');
  }

  const { manager, connectionOptions } = context;
  
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [offlineStartTime, setOfflineStartTime] = useState<number | null>(null);
  
  const actionQueueRef = useRef<Array<() => Promise<void>>>([]);
  const pingIntervalRef = useRef<NodeJS.Timer | null>(null);

  // Calculate offline duration
  const offlineDuration = offlineStartTime
    ? Date.now() - offlineStartTime
    : null;

  // Handle online event
  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setIsReconnecting(false);
    setOfflineStartTime(null);

    // Show online banner
    if (connectionOptions?.enabled) {
      manager.add('banner', {
        message: connectionOptions.onlineMessage || 'Bağlantı yeniden sağlandı!',
        variant: 'success',
        position: connectionOptions.position || 'top',
        duration: connectionOptions.onlineDismissDelay || 3000,
        dismissible: true,
      });
    }

    // Process queued actions
    processQueue();

    // Callback
    connectionOptions?.onOnline?.();
  }, [manager, connectionOptions]);

  // Handle offline event
  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setOfflineStartTime(Date.now());

    // Show offline banner
    if (connectionOptions?.enabled) {
      manager.add('banner', {
        message: connectionOptions.offlineMessage || 'İnternet bağlantınız kesildi',
        variant: 'warning',
        position: connectionOptions.position || 'top',
        dismissible: false,
        duration: 0, // Don't auto-dismiss
      });
    }

    // Start ping interval
    startPingInterval();

    // Callback
    connectionOptions?.onOffline?.();
  }, [manager, connectionOptions]);

  // Process queued actions
  const processQueue = useCallback(async () => {
    const queue = [...actionQueueRef.current];
    actionQueueRef.current = [];

    for (const action of queue) {
      try {
        await action();
      } catch (error) {
        console.error('Failed to process queued action:', error);
      }
    }
  }, []);

  // Start ping interval for reconnection check
  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) return;

    const interval = connectionOptions?.pingInterval || 5000;
    
    pingIntervalRef.current = setInterval(async () => {
      if (connectionOptions?.showReconnecting) {
        setIsReconnecting(true);
        connectionOptions?.onReconnecting?.();
      }

      const online = await checkConnectionInternal();
      
      if (online) {
        clearInterval(pingIntervalRef.current!);
        pingIntervalRef.current = null;
        handleOnline();
      } else {
        setIsReconnecting(false);
      }
    }, interval);
  }, [connectionOptions, handleOnline]);

  // Internal connection check
  const checkConnectionInternal = useCallback(async (): Promise<boolean> => {
    try {
      const url = connectionOptions?.pingUrl || '/api/ping';
      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-store',
      });
      return response.ok;
    } catch {
      return navigator.onLine;
    }
  }, [connectionOptions]);

  // Public connection check
  const checkConnection = useCallback(async (): Promise<boolean> => {
    const online = await checkConnectionInternal();
    if (online && !isOnline) {
      handleOnline();
    } else if (!online && isOnline) {
      handleOffline();
    }
    return online;
  }, [checkConnectionInternal, isOnline, handleOnline, handleOffline]);

  // Queue action
  const queueAction = useCallback((action: () => Promise<void>) => {
    actionQueueRef.current.push(action);
  }, []);

  // Manual show methods
  const showOffline = useCallback((message?: string) => {
    manager.add('banner', {
      message: message || connectionOptions?.offlineMessage || 'Çevrimdışı',
      variant: 'warning',
      position: connectionOptions?.position || 'top',
      dismissible: true,
    });
  }, [manager, connectionOptions]);

  const showOnline = useCallback((message?: string) => {
    manager.add('banner', {
      message: message || connectionOptions?.onlineMessage || 'Çevrimiçi',
      variant: 'success',
      position: connectionOptions?.position || 'top',
      duration: 3000,
      dismissible: true,
    });
  }, [manager, connectionOptions]);

  const showReconnecting = useCallback((message?: string) => {
    manager.add('banner', {
      message: message || connectionOptions?.reconnectingMessage || 'Yeniden bağlanılıyor...',
      variant: 'info',
      position: connectionOptions?.position || 'top',
      dismissible: false,
    });
  }, [manager, connectionOptions]);

  // Set up event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [handleOnline, handleOffline]);

  return {
    isOnline,
    isReconnecting,
    offlineDuration,
    showOffline,
    showOnline,
    showReconnecting,
    checkConnection,
    queueAction,
  };
}
```

## Provider Integration

```typescript
// In FeedbackProvider

<FeedbackProvider
  connectionStatus={{
    enabled: true,
    // ... options
  }}
>
  {children}
</FeedbackProvider>
```

## Accessibility

```typescript
// Offline banner should have:
role="alert"
aria-live="assertive"

// Online banner:
role="status"
aria-live="polite"
```

## Testing Checklist

```typescript
describe('useConnection', () => {
  it('should detect online status', () => {});
  it('should detect offline status', () => {});
  it('should show offline banner when offline', () => {});
  it('should show online banner when back online', () => {});
  it('should auto-dismiss online banner', () => {});
  it('should queue actions while offline', () => {});
  it('should process queue when back online', () => {});
  it('should ping for reconnection', () => {});
  it('should call onOffline callback', () => {});
  it('should call onOnline callback', () => {});
  it('should track offline duration', () => {});
});
```

## Implementation Checklist

- [ ] Create `src/hooks/useConnection.ts`
- [ ] Add connection options to FeedbackProvider
- [ ] Implement online/offline detection
- [ ] Implement ping mechanism
- [ ] Implement action queue
- [ ] Write unit tests
- [ ] Verify accessibility
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. False Positives
❌ **Don't:** Trust navigator.onLine completely
✅ **Do:** Use ping/fetch to verify actual connectivity

### 2. Aggressive Pinging
❌ **Don't:** Ping every 500ms
✅ **Do:** Use reasonable interval (5s+)

### 3. Queue Memory Leak
❌ **Don't:** Queue unlimited actions
✅ **Do:** Limit queue size or clear on timeout

### 4. SSR Issues
❌ **Don't:** Access navigator on server
✅ **Do:** Check typeof window/navigator

## Notes

- Uses browser's online/offline events as primary detection
- Optional ping for more reliable detection
- Action queue persists in memory (not localStorage)
- Consider using Service Worker for better offline support
- Banner uses existing banner system internally
