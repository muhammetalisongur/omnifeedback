/**
 * 12 - EventBus Listeners
 *
 * Demonstrates subscribing to the OmniFeedback EventBus for analytics and
 * logging purposes. Every feedback action (toast shown, modal opened, etc.)
 * is captured and displayed in a scrollable "Event Log" panel.
 *
 * Hooks used: useToast, useModal, useConfirm
 * Utilities: EventBus
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EventBus, useToast, useModal, useConfirm } from 'omnifeedback';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IEventLogEntry {
  /** Auto-incrementing identifier */
  id: number;
  /** Human-readable event name */
  type: string;
  /** ISO timestamp string */
  timestamp: string;
  /** Shortened payload summary */
  summary: string;
}

// ---------------------------------------------------------------------------
// Shared event bus instance used by OmniFeedback internally.
// We subscribe to its events purely for observation.
// ---------------------------------------------------------------------------

const feedbackBus = new EventBus<{
  'feedback:add': Record<string, unknown>;
  'feedback:remove': Record<string, unknown>;
  'feedback:update': Record<string, unknown>;
}>();

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventBusListeners(): React.ReactElement {
  const toast = useToast();
  const modal = useModal();
  const confirm = useConfirm();

  const [events, setEvents] = useState<IEventLogEntry[]>([]);
  const nextIdRef = useRef(1);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  /** Append a new entry to the visible event log. */
  const pushEvent = useCallback((type: string, payload: unknown): void => {
    const entry: IEventLogEntry = {
      id: nextIdRef.current++,
      type,
      timestamp: new Date().toISOString().slice(11, 23), // HH:mm:ss.SSS
      summary: JSON.stringify(payload ?? {}).slice(0, 80),
    };

    setEvents((prev) => [...prev.slice(-49), entry]); // Keep last 50 entries
  }, []);

  // Subscribe to EventBus events on mount; clean up on unmount.
  useEffect(() => {
    const unsubAdd = feedbackBus.on('feedback:add', (payload) => {
      pushEvent('feedback:add', payload);
    });

    const unsubRemove = feedbackBus.on('feedback:remove', (payload) => {
      pushEvent('feedback:remove', payload);
    });

    const unsubUpdate = feedbackBus.on('feedback:update', (payload) => {
      pushEvent('feedback:update', payload);
    });

    return () => {
      unsubAdd();
      unsubRemove();
      unsubUpdate();
    };
  }, [pushEvent]);

  // Auto-scroll the event log to the bottom when new entries arrive.
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  // -----------------------------------------------------------------------
  // Trigger actions that emit events
  // -----------------------------------------------------------------------

  const handleToast = useCallback((): void => {
    toast.success('Analytics-tracked toast.');
    pushEvent('toast:show', { variant: 'success', message: 'Analytics-tracked toast.' });
  }, [toast, pushEvent]);

  const handleModal = useCallback((): void => {
    modal.open({
      title: 'Tracked Modal',
      content: <p>This modal open is logged in the event panel.</p>,
    });
    pushEvent('modal:open', { title: 'Tracked Modal' });
  }, [modal, pushEvent]);

  const handleConfirm = useCallback(async (): Promise<void> => {
    pushEvent('confirm:show', { message: 'Do you agree?' });
    const result = await confirm.show({ message: 'Do you agree to the terms?' });
    pushEvent('confirm:response', { confirmed: result });
  }, [confirm, pushEvent]);

  const handleClearLog = useCallback((): void => {
    setEvents([]);
    nextIdRef.current = 1;
  }, []);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24, minHeight: 400 }}>
      {/* Left panel: action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
        <h2>Event Bus Demo</h2>
        <p style={{ fontSize: 14, color: '#555' }}>
          Trigger feedback actions and observe the event log on the right.
        </p>
        <button onClick={handleToast}>Show Toast</button>
        <button onClick={handleModal}>Open Modal</button>
        <button onClick={handleConfirm}>Show Confirm</button>
        <hr />
        <button onClick={handleClearLog}>Clear Log</button>
      </div>

      {/* Right panel: event log */}
      <div
        style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            background: '#f5f5f5',
            fontWeight: 600,
            borderBottom: '1px solid #ddd',
          }}
        >
          Event Log ({events.length})
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 8, fontFamily: 'monospace', fontSize: 13 }}>
          {events.length === 0 && (
            <div style={{ color: '#999', textAlign: 'center', paddingTop: 20 }}>
              No events recorded yet. Click a button to start.
            </div>
          )}

          {events.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: '4px 0',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                gap: 8,
              }}
            >
              <span style={{ color: '#888', minWidth: 90 }}>{entry.timestamp}</span>
              <span style={{ color: '#2563eb', fontWeight: 600, minWidth: 130 }}>{entry.type}</span>
              <span style={{ color: '#555', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {entry.summary}
              </span>
            </div>
          ))}

          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
