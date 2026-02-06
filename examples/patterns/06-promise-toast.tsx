/**
 * 06 - Promise Toast
 *
 * Demonstrates: toast.promise() for real-world async API call patterns
 * Hooks used: useToast
 *
 * Scenarios covered:
 *   1. Basic fetch with toast.promise
 *   2. POST request with dynamic success message via callback
 *   3. Error with custom error message formatter
 *   4. Multiple concurrent promise toasts
 *   5. Custom options (position, duration) on promise toast
 */

import React, { useCallback } from 'react';
import { useToast } from 'omnifeedback';

// ------------------------------------------------------------------ helpers

interface IUser {
  id: number;
  name: string;
  email: string;
}

/** Simulates a GET request that fetches a user by ID. */
function fetchUser(userId: number): Promise<IUser> {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ id: userId, name: 'Alice Johnson', email: 'alice@example.com' }),
      1500
    )
  );
}

/** Simulates a POST request that creates a new record. */
function createRecord(title: string): Promise<{ id: number; title: string }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id: Date.now(), title }), 2000)
  );
}

/** Simulates a request that always fails after a delay. */
function failingRequest(): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gateway timeout — upstream server did not respond.')), 1800)
  );
}

/** Simulates a lightweight data sync call. */
function syncData(label: string): Promise<string> {
  const delay = 1000 + Math.random() * 2000;
  return new Promise((resolve) =>
    setTimeout(() => resolve(`${label} synced successfully`), delay)
  );
}

// ------------------------------------------------------------------ component

export default function PromiseToast(): React.ReactElement {
  const toast = useToast();

  /** 1. Basic fetch — static success / error messages. */
  const handleBasicFetch = useCallback((): void => {
    void toast.promise(fetchUser(42), {
      loading: 'Fetching user profile...',
      success: 'User profile loaded!',
      error: 'Failed to load user profile.',
    });
  }, [toast]);

  /** 2. POST with dynamic success message derived from the result. */
  const handleCreateRecord = useCallback((): void => {
    void toast.promise(createRecord('Quarterly Report'), {
      loading: 'Creating record...',
      success: (data) => `Record "${data.title}" created (ID: ${data.id}).`,
      error: 'Could not create record.',
    });
  }, [toast]);

  /** 3. Error formatter — present a user-friendly error message. */
  const handleFailingRequest = useCallback((): void => {
    void toast.promise(failingRequest(), {
      loading: 'Connecting to server...',
      success: 'Connected!',
      error: (err) => `Request failed: ${err.message}`,
    }).catch(() => {
      // Error is already shown via toast; swallow the rejected promise.
    });
  }, [toast]);

  /** 4. Multiple concurrent promise toasts — each resolves independently. */
  const handleConcurrentSync = useCallback((): void => {
    void toast.promise(syncData('Contacts'), {
      loading: 'Syncing contacts...',
      success: (msg) => msg,
      error: 'Contacts sync failed.',
    });

    void toast.promise(syncData('Calendar'), {
      loading: 'Syncing calendar...',
      success: (msg) => msg,
      error: 'Calendar sync failed.',
    });

    void toast.promise(syncData('Settings'), {
      loading: 'Syncing settings...',
      success: (msg) => msg,
      error: 'Settings sync failed.',
    });
  }, [toast]);

  /** 5. Promise toast with custom position and duration. */
  const handleCustomOptions = useCallback((): void => {
    void toast.promise(fetchUser(99), {
      loading: 'Loading with custom options...',
      success: 'Done! This toast appears at bottom-left for 6 seconds.',
      error: 'Something went wrong.',
      options: {
        position: 'bottom-left',
        duration: 6000,
      },
    });
  }, [toast]);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2>Promise Toast Patterns</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Each button triggers an async operation wrapped with toast.promise().
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={handleBasicFetch}>Basic Fetch</button>
        <button onClick={handleCreateRecord}>POST with Dynamic Message</button>
        <button onClick={handleFailingRequest}>Failing Request (Error Formatter)</button>
        <button onClick={handleConcurrentSync}>Concurrent Sync (3 Toasts)</button>
        <button onClick={handleCustomOptions}>Custom Position &amp; Duration</button>
      </div>
    </div>
  );
}
