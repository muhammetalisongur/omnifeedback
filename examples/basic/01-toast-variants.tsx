/**
 * 01 - Toast Variants
 *
 * Demonstrates all toast notification methods provided by the useToast hook:
 *   - success, error, warning, info, loading variants
 *   - Custom duration and position
 *   - Toast with action button
 *   - Dismiss a single toast and dismissAll
 *   - Update an existing toast in-place
 */

import React, { useRef } from 'react';
import { useToast } from 'omnifeedback';
import type { IToastOptions } from 'omnifeedback';

export default function ToastVariants(): React.ReactElement {
  const toast = useToast();
  const lastToastId = useRef<string>('');

  /** Show one toast per variant so the user can compare them side-by-side. */
  const handleShowVariants = (): void => {
    toast.success('Profile saved successfully.');
    toast.error('Unable to connect to the server.');
    toast.warning('Your session will expire in 5 minutes.');
    toast.info('A new version is available.');
    lastToastId.current = toast.loading('Syncing data with cloud...');
  };

  /** Demonstrate custom duration and screen position. */
  const handleCustomOptions = (): void => {
    const options: Partial<IToastOptions> = {
      duration: 8000,
      position: 'bottom-left',
    };
    toast.success('This toast stays for 8 seconds at the bottom-left.', options);
  };

  /** Demonstrate a toast that contains a clickable action button. */
  const handleActionToast = (): void => {
    toast.info('File moved to trash.', {
      action: {
        label: 'Undo',
        onClick: () => toast.success('File restored.'),
      },
      duration: 6000,
    });
  };

  /** Dismiss the most-recently created toast, or clear everything. */
  const handleDismiss = (): void => {
    if (lastToastId.current) {
      toast.dismiss(lastToastId.current);
    }
  };

  const handleDismissAll = (): void => {
    toast.dismissAll();
  };

  /** Update an existing toast — e.g. change a loading toast into a success. */
  const handleUpdateToast = (): void => {
    const id = toast.loading('Uploading report...');

    // Simulate an async operation completing after 2 seconds.
    setTimeout(() => {
      toast.update(id, {
        message: 'Report uploaded successfully!',
        variant: 'success',
        duration: 4000,
        dismissible: true,
      });
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <h2>Toast Variants</h2>
      <button onClick={handleShowVariants}>Show All Variants</button>
      <button onClick={handleCustomOptions}>Custom Duration &amp; Position</button>
      <button onClick={handleActionToast}>Toast with Action Button</button>
      <button onClick={handleDismiss}>Dismiss Last Toast</button>
      <button onClick={handleDismissAll}>Dismiss All Toasts</button>
      <button onClick={handleUpdateToast}>Update Toast (Loading → Success)</button>
    </div>
  );
}
