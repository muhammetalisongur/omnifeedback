/**
 * 09 - Connection-Aware Save
 *
 * Demonstrates: Offline-aware auto-save using useConnection
 * Hooks used: useToast, useLoading, useConnection
 *
 * Scenarios covered:
 *   1. Form with debounced auto-save
 *   2. Check isOnline before performing a save
 *   3. If offline: queue the save action and show info toast
 *   4. Display queue size indicator in the UI
 *   5. Queued actions execute automatically when back online
 *   6. Manual "Check Connection" button via checkConnection()
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useToast, useLoading, useConnection } from 'omnifeedback';

// ------------------------------------------------------------------ helpers

/** Simulates persisting note content to a remote server. */
function saveNote(content: string): Promise<{ savedAt: string }> {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ savedAt: new Date().toLocaleTimeString() }),
      800
    )
  );
}

// ------------------------------------------------------------------ component

export default function ConnectionAwareSave(): React.ReactElement {
  const toast = useToast();
  const loading = useLoading();
  const connection = useConnection();

  const [content, setContent] = useState('Start typing your note here...');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [queueSize, setQueueSize] = useState(0);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Refresh the displayed queue size from the hook. */
  const refreshQueueSize = useCallback((): void => {
    setQueueSize(connection.getQueueSize());
  }, [connection]);

  /** Core save logic — invoked both online and when queued actions replay. */
  const performSave = useCallback(
    async (text: string): Promise<void> => {
      const result = await saveNote(text);
      setLastSaved(result.savedAt);
    },
    []
  );

  /** Determine whether to save immediately or queue the action. */
  const handleSave = useCallback(async (): Promise<void> => {
    if (connection.isOnline) {
      try {
        await loading.wrap(() => performSave(content), {
          message: 'Saving note...',
        });
        toast.success('Note saved.');
      } catch {
        toast.error('Failed to save note.');
      }
    } else {
      // Capture the current content for the queued closure.
      const snapshot = content;
      connection.queueAction(async () => {
        await performSave(snapshot);
      });
      toast.info('You are offline. Save has been queued.');
      refreshQueueSize();
    }
  }, [connection, loading, performSave, content, toast, refreshQueueSize]);

  /** Auto-save on content change with a 2-second debounce. */
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const value = e.target.value;
      setContent(value);

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        void handleSave();
      }, 2000);
    },
    [handleSave]
  );

  /** Manual connection check via the hook. */
  const handleCheckConnection = useCallback(async (): Promise<void> => {
    const online = await connection.checkConnection();
    if (online) {
      toast.success('Connection is active. Queued actions will process now.');
    } else {
      toast.warning('Still offline. Actions remain queued.');
    }
    refreshQueueSize();
  }, [connection, toast, refreshQueueSize]);

  /** Cleanup auto-save timer on unmount. */
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // -------- Render --------

  const statusColor = connection.isOnline ? '#16a34a' : '#dc2626';
  const statusLabel = connection.isOnline ? 'Online' : 'Offline';

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 24 }}>
      <h2>Connection-Aware Note</h2>

      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          marginBottom: 16,
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          fontSize: 13,
        }}
      >
        <span>
          Status:{' '}
          <strong style={{ color: statusColor }}>{statusLabel}</strong>
        </span>

        {queueSize > 0 && (
          <span style={{ color: '#b45309' }}>
            Queued saves: <strong>{queueSize}</strong>
          </span>
        )}

        {lastSaved && (
          <span style={{ color: '#6b7280' }}>Last saved: {lastSaved}</span>
        )}
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleContentChange}
        rows={8}
        style={{
          display: 'block',
          width: '100%',
          padding: 12,
          border: '1px solid #ccc',
          borderRadius: 6,
          fontSize: 14,
          resize: 'vertical',
          marginBottom: 12,
        }}
      />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => void handleSave()} style={{ padding: '8px 20px' }}>
          Save Now
        </button>
        <button onClick={() => void handleCheckConnection()} style={{ padding: '8px 20px' }}>
          Check Connection
        </button>
      </div>
    </div>
  );
}
