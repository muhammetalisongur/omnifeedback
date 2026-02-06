/**
 * 15 - Progress File Upload
 *
 * Demonstrates realistic file-upload UX powered by the useProgress,
 * useLoading, and useToast hooks. Features include:
 *   - Single file upload with chunked progress simulation
 *   - Cancel upload mid-way via a cancellable loading overlay
 *   - Multiple file upload with individual progress bars
 *   - Completion callback with success toast
 *
 * Hooks used: useProgress, useLoading, useToast
 */

import React, { useState, useCallback, useRef } from 'react';
import { useProgress, useLoading, useToast } from 'omnifeedback';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IFileEntry {
  /** Simulated file name */
  name: string;
  /** File size in kilobytes (for display) */
  sizeKb: number;
  /** Associated progress bar id */
  progressId: string | null;
  /** Upload status */
  status: 'pending' | 'uploading' | 'completed' | 'cancelled';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Wait for the specified number of milliseconds. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Generate a random integer between min and max (inclusive). */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProgressFileUpload(): React.ReactElement {
  const progress = useProgress();
  const loading = useLoading();
  const toast = useToast();

  const [files, setFiles] = useState<IFileEntry[]>([]);
  const cancelledRef = useRef(false);

  // -----------------------------------------------------------------------
  // 1. Single file upload with cancellable loading overlay
  // -----------------------------------------------------------------------

  const handleSingleUpload = useCallback(async (): Promise<void> => {
    cancelledRef.current = false;

    // Show a cancellable loading overlay.
    const loadingId = loading.show({
      message: 'Preparing upload...',
      overlay: true,
      cancellable: true,
      onCancel: () => {
        cancelledRef.current = true;
      },
    });

    // Show a progress bar.
    const progressId = progress.show({
      value: 0,
      label: 'report-2024.pdf',
      showPercentage: true,
      animated: true,
      variant: 'info',
    });

    try {
      const totalChunks = 20;

      for (let chunk = 1; chunk <= totalChunks; chunk++) {
        // Check for cancellation before each chunk.
        if (cancelledRef.current) {
          loading.hide(loadingId);
          progress.remove(progressId);
          toast.warning('Upload cancelled by user.');
          return;
        }

        // Simulate variable network latency per chunk.
        await delay(randomInt(80, 250));

        const percent = Math.round((chunk / totalChunks) * 100);
        progress.update(progressId, percent, {
          label: `report-2024.pdf  (${percent}%)`,
        });
      }

      // Upload complete.
      loading.hide(loadingId);
      progress.complete(progressId);
      toast.success('report-2024.pdf uploaded successfully.');
    } catch {
      loading.hide(loadingId);
      progress.remove(progressId);
      toast.error('Upload failed unexpectedly.');
    }
  }, [loading, progress, toast]);

  // -----------------------------------------------------------------------
  // 2. Multiple file upload with individual progress bars
  // -----------------------------------------------------------------------

  /** Simulate adding files (as if from an <input type="file" />). */
  const handleAddFiles = useCallback((): void => {
    const newFiles: IFileEntry[] = [
      { name: 'vacation-photo.jpg', sizeKb: 3200, progressId: null, status: 'pending' },
      { name: 'presentation.pptx', sizeKb: 8400, progressId: null, status: 'pending' },
      { name: 'notes.txt', sizeKb: 14, progressId: null, status: 'pending' },
    ];
    setFiles(newFiles);
    toast.info(`${newFiles.length} files queued for upload.`);
  }, [toast]);

  /** Upload all pending files sequentially, each with its own progress bar. */
  const handleUploadAll = useCallback(async (): Promise<void> => {
    const snapshot = [...files];

    for (let i = 0; i < snapshot.length; i++) {
      const file = snapshot[i];
      if (file.status !== 'pending') continue;

      // Create an individual progress bar for this file.
      const pid = progress.show({
        value: 0,
        label: file.name,
        showPercentage: true,
        animated: true,
        variant: 'info',
      });

      // Mark file as uploading.
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, progressId: pid, status: 'uploading' } : f
        )
      );

      // Simulate chunked upload proportional to file size.
      const chunks = Math.max(5, Math.round(file.sizeKb / 1000));

      for (let chunk = 1; chunk <= chunks; chunk++) {
        await delay(randomInt(100, 300));
        const percent = Math.round((chunk / chunks) * 100);
        progress.update(pid, percent, {
          label: `${file.name}  (${percent}%)`,
        });
      }

      progress.complete(pid);

      // Mark file as completed.
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: 'completed' } : f
        )
      );
    }

    toast.success('All files uploaded successfully.');
  }, [files, progress, toast]);

  /** Remove all progress bars and reset file list. */
  const handleClearAll = useCallback((): void => {
    progress.removeAll();
    setFiles([]);
  }, [progress]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const statusBadge = (status: IFileEntry['status']): React.ReactElement => {
    const colors: Record<string, string> = {
      pending: '#6b7280',
      uploading: '#2563eb',
      completed: '#16a34a',
      cancelled: '#dc2626',
    };

    return (
      <span
        style={{
          fontSize: 12,
          padding: '2px 8px',
          borderRadius: 999,
          color: '#fff',
          backgroundColor: colors[status] ?? '#6b7280',
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: 24, maxWidth: 540 }}>
      <h2>File Upload with Progress</h2>

      {/* Single file upload section */}
      <section style={{ marginBottom: 28 }}>
        <h3>Single File Upload</h3>
        <p style={{ color: '#555', fontSize: 14 }}>
          Simulates a chunked upload with a cancellable loading overlay and
          real-time progress updates.
        </p>
        <button onClick={handleSingleUpload}>Upload report-2024.pdf</button>
      </section>

      {/* Multi-file upload section */}
      <section>
        <h3>Multiple File Upload</h3>
        <p style={{ color: '#555', fontSize: 14 }}>
          Queue several files and upload them sequentially. Each file gets its
          own progress bar.
        </p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button onClick={handleAddFiles}>Add Sample Files</button>
          <button
            onClick={handleUploadAll}
            disabled={files.length === 0 || files.every((f) => f.status !== 'pending')}
          >
            Upload All
          </button>
          <button onClick={handleClearAll} disabled={files.length === 0}>
            Clear
          </button>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {files.map((file, idx) => (
              <div
                key={file.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: idx < files.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {file.sizeKb >= 1000
                      ? `${(file.sizeKb / 1000).toFixed(1)} MB`
                      : `${file.sizeKb} KB`}
                  </div>
                </div>
                {statusBadge(file.status)}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
