/**
 * 03 - Loading & Wrap Async
 *
 * Demonstrates loading indicator capabilities provided by the useLoading hook:
 *   - Manual show() / hide() pattern for fine-grained control
 *   - Automatic wrap() pattern that handles show/hide around a promise
 *   - Loading with a message and a full-screen overlay
 *   - Cancellable loading with an onCancel callback
 *   - Reactive isLoading state for conditional UI rendering
 */

import React, { useRef } from 'react';
import { useLoading, useToast } from 'omnifeedback';

/** Simulates a network request that takes a given number of milliseconds. */
function simulateRequest(ms: number): Promise<string> {
  return new Promise((resolve) =>
    setTimeout(() => resolve('Operation completed'), ms)
  );
}

export default function LoadingWrapAsync(): React.ReactElement {
  const loading = useLoading();
  const toast = useToast();
  const abortRef = useRef(false);

  /**
   * Manual pattern: explicitly call show() before the async work
   * and hide() inside a finally block to guarantee cleanup.
   */
  const handleManualLoading = async (): Promise<void> => {
    const loadingId = loading.show({ message: 'Fetching dashboard data...' });
    try {
      const result = await simulateRequest(2000);
      toast.success(result);
    } catch {
      toast.error('Request failed. Please try again.');
    } finally {
      loading.hide(loadingId);
    }
  };

  /**
   * Automatic pattern: wrap() shows the loading indicator before execution
   * and hides it afterwards regardless of success or failure.
   */
  const handleWrapLoading = async (): Promise<void> => {
    try {
      const result = await loading.wrap(
        () => simulateRequest(2000),
        { message: 'Generating report...' }
      );
      toast.success(result);
    } catch {
      toast.error('Report generation failed.');
    }
  };

  /** Loading with a full-screen overlay and blur effect. */
  const handleOverlayLoading = async (): Promise<void> => {
    const loadingId = loading.show({
      message: 'Processing payment...',
      overlay: true,
      overlayOpacity: 0.6,
      blur: true,
    });

    await simulateRequest(3000);
    loading.hide(loadingId);
    toast.success('Payment processed successfully.');
  };

  /** Cancellable loading: the user can abort the operation mid-flight. */
  const handleCancellableLoading = async (): Promise<void> => {
    abortRef.current = false;

    const loadingId = loading.show({
      message: 'Importing records (this may take a while)...',
      cancellable: true,
      cancelText: 'Abort Import',
      onCancel: () => {
        abortRef.current = true;
        loading.hide(loadingId);
        toast.warning('Import cancelled by user.');
      },
    });

    // Simulate a long-running task with periodic abort checks.
    for (let step = 0; step < 10; step++) {
      if (abortRef.current) return;
      await simulateRequest(500);
    }

    loading.hide(loadingId);
    toast.success('All records imported.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <h2>Loading &amp; Wrap Async</h2>

      {/* Reactive state: conditionally show a banner when any loading is active. */}
      {loading.isLoading && (
        <p style={{ color: '#0070f3', fontWeight: 600 }}>
          A background operation is in progress...
        </p>
      )}

      <button onClick={handleManualLoading}>Manual Show / Hide</button>
      <button onClick={handleWrapLoading}>Automatic wrap()</button>
      <button onClick={handleOverlayLoading}>Overlay with Blur</button>
      <button onClick={handleCancellableLoading}>Cancellable Loading</button>
    </div>
  );
}
