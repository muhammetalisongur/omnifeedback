/**
 * 05 - Combined Workflow
 *
 * The most comprehensive example: a realistic UserProfile component that
 * demonstrates how multiple OmniFeedback hooks work together via the
 * unified useFeedback() entry point.
 *
 * Scenarios covered:
 *   1. Save profile  - loading.show() -> API call -> loading.hide() -> toast.success/error
 *   2. Delete account - confirm.danger() -> if yes: loading -> API -> toast
 *   3. Upload avatar  - progress.show() -> simulated upload -> progress.update() -> complete
 *   4. Error recovery  - try/catch with toast.error and a retry mechanism
 */

import React, { useState, useCallback } from 'react';
import { useFeedback } from 'omnifeedback';

// ------------------------------------------------------------------ helpers

/** Simulates a generic API call that resolves after a delay. */
function apiCall<T>(result: T, delayMs: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), delayMs));
}

/** Simulates an API call that randomly fails ~30 % of the time. */
function unreliableApiCall(delayMs: number): Promise<string> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error('Network timeout — the server did not respond in time.'));
      } else {
        resolve('Settings updated');
      }
    }, delayMs)
  );
}

// ------------------------------------------------------------------ component

export default function CombinedWorkflow(): React.ReactElement {
  const { toast, loading, confirm, progress } = useFeedback();

  const [displayName, setDisplayName] = useState('Jane Doe');
  const [bio, setBio] = useState('Full-stack engineer who loves open source.');

  // -------- 1. Save profile (loading + toast) --------

  const handleSaveProfile = useCallback(async (): Promise<void> => {
    const loadingId = loading.show({ message: 'Saving profile changes...' });

    try {
      await apiCall(undefined, 1500);
      loading.hide(loadingId);
      toast.success('Profile updated successfully.');
    } catch (err: unknown) {
      loading.hide(loadingId);
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast.error(`Save failed: ${message}`);
    }
  }, [loading, toast]);

  // -------- 2. Delete account (confirm + loading + toast) --------

  const handleDeleteAccount = useCallback(async (): Promise<void> => {
    const confirmed = await confirm.danger(
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      {
        title: 'Delete Account',
        confirmText: 'Delete My Account',
        cancelText: 'Keep Account',
      }
    );

    if (!confirmed) {
      toast.info('Account deletion cancelled.');
      return;
    }

    const loadingId = loading.show({
      message: 'Deleting account...',
      overlay: true,
    });

    try {
      await apiCall(undefined, 2000);
      loading.hide(loadingId);
      toast.success('Your account has been deleted. Goodbye!');
    } catch (err: unknown) {
      loading.hide(loadingId);
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast.error(`Deletion failed: ${message}`);
    }
  }, [confirm, loading, toast]);

  // -------- 3. Upload avatar (progress + toast) --------

  const handleUploadAvatar = useCallback(async (): Promise<void> => {
    const progressId = progress.show({
      value: 0,
      label: 'Uploading avatar...',
      showPercentage: true,
      animated: true,
      variant: 'info',
    });

    try {
      // Simulate chunked upload: increment progress in steps.
      const totalSteps = 10;
      for (let step = 1; step <= totalSteps; step++) {
        await apiCall(undefined, 300);
        const percent = Math.round((step / totalSteps) * 100);
        progress.update(progressId, percent, {
          label: `Uploading avatar... ${percent}%`,
        });
      }

      progress.complete(progressId);
      toast.success('Avatar uploaded successfully.');
    } catch (err: unknown) {
      progress.remove(progressId);
      const message = err instanceof Error ? err.message : 'Upload interrupted';
      toast.error(`Avatar upload failed: ${message}`);
    }
  }, [progress, toast]);

  // -------- 4. Error recovery with retry --------

  const handleSaveSettings = useCallback(async (): Promise<void> => {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const loadingId = loading.show({
        message: attempt === 1
          ? 'Saving notification settings...'
          : `Retrying... (attempt ${attempt} of ${maxAttempts})`,
      });

      try {
        const result = await unreliableApiCall(1200);
        loading.hide(loadingId);
        toast.success(result);
        return; // Exit on success.
      } catch (err: unknown) {
        loading.hide(loadingId);
        const message = err instanceof Error ? err.message : 'Unknown error';

        if (attempt < maxAttempts) {
          toast.warning(`Attempt ${attempt} failed: ${message}. Retrying...`);
        } else {
          toast.error(`All ${maxAttempts} attempts failed: ${message}. Please try again later.`);
        }
      }
    }
  }, [loading, toast]);

  // -------- render --------

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2>User Profile</h2>

      {/* Profile form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <label>
          Display Name
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>

        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={handleSaveProfile}>
          Save Profile
        </button>

        <button onClick={handleUploadAvatar}>
          Upload Avatar
        </button>

        <button onClick={handleSaveSettings}>
          Save Settings (with retry)
        </button>

        <hr />

        <button onClick={handleDeleteAccount} style={{ color: 'red' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
