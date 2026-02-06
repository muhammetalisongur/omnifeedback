/**
 * 11 - Custom Adapter (Minimal)
 *
 * Demonstrates how to create a minimal custom adapter that implements the
 * IFeedbackAdapter interface. Only ToastComponent, ModalComponent, and
 * LoadingComponent carry real implementations; every other slot is a
 * lightweight placeholder so the adapter satisfies the type contract.
 *
 * Hooks used: useToast, useModal
 */

import React, { useState, useCallback } from 'react';
import { FeedbackProvider, useToast, useModal } from 'omnifeedback';
import type { IFeedbackAdapter } from 'omnifeedback';

// ---------------------------------------------------------------------------
// Placeholder component used for adapter slots that are not yet implemented.
// Each placeholder renders nothing but can be swapped for a real component
// when the adapter grows.
// ---------------------------------------------------------------------------

function Placeholder(): React.ReactElement {
  return <div style={{ display: 'none' }} />;
}

// ---------------------------------------------------------------------------
// Minimal Toast component rendered by the adapter
// ---------------------------------------------------------------------------

function MinimalToast(props: {
  message: React.ReactNode;
  variant: string;
  onDismiss?: () => void;
}): React.ReactElement {
  const variantColors: Record<string, string> = {
    success: '#16a34a',
    error: '#dc2626',
    warning: '#ca8a04',
    info: '#2563eb',
    default: '#374151',
  };

  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 6,
        color: '#fff',
        backgroundColor: variantColors[props.variant] ?? variantColors.default,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{ flex: 1 }}>{props.message}</span>
      {props.onDismiss && (
        <button
          onClick={props.onDismiss}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          x
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal Modal component rendered by the adapter
// ---------------------------------------------------------------------------

function MinimalModal(props: {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}): React.ReactElement {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 24,
          minWidth: 320,
          maxWidth: 480,
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        }}
      >
        {props.title && <h3 style={{ marginTop: 0 }}>{props.title}</h3>}
        {props.children}
        {props.onClose && (
          <button onClick={props.onClose} style={{ marginTop: 16 }}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal Loading component rendered by the adapter
// ---------------------------------------------------------------------------

function MinimalLoading(props: { message?: string }): React.ReactElement {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 9998,
      }}
    >
      <span>{props.message ?? 'Loading...'}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom adapter object satisfying IFeedbackAdapter
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
const minimalAdapter: IFeedbackAdapter = {
  name: 'minimal-custom',
  version: '0.1.0',

  // --- Fully implemented slots ---
  ToastComponent: MinimalToast as any,
  ModalComponent: MinimalModal as any,
  LoadingComponent: MinimalLoading as any,

  // --- Placeholder slots (swap with real components as needed) ---
  ToastContainerComponent: Placeholder as any,  // Container that wraps toasts
  BannerComponent: Placeholder as any,           // Top/bottom banner notifications
  ConfirmComponent: Placeholder as any,          // Confirmation dialog
  PromptComponent: Placeholder as any,           // Text-input prompt dialog
  DrawerComponent: Placeholder as any,           // Slide-in drawer panel
  PopconfirmComponent: Placeholder as any,       // Popover confirmation
  SheetComponent: Placeholder as any,            // Bottom sheet
  ActionSheetComponent: Placeholder as any,      // Action sheet with options
  AlertComponent: Placeholder as any,            // Inline alert message
  ProgressComponent: Placeholder as any,         // Progress bar / indicator
  SkeletonComponent: Placeholder as any,         // Skeleton loader
  ResultComponent: Placeholder as any,           // Success / error result page
  ConnectionComponent: Placeholder as any,       // Online / offline banner

  // --- Utility functions ---
  isDarkMode: () => false,
  injectStyles: () => {
    /* No styles to inject for the minimal adapter */
  },
  animations: { enter: 'fade-in', exit: 'fade-out', duration: 200 },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Inner demo component that exercises the custom adapter
// ---------------------------------------------------------------------------

function AdapterDemo(): React.ReactElement {
  const toast = useToast();
  const modal = useModal();

  const handleToast = useCallback((): void => {
    toast.success('Custom adapter toast works!');
  }, [toast]);

  const handleModal = useCallback((): void => {
    modal.open({
      title: 'Custom Modal',
      content: <p>This modal is rendered through the minimal custom adapter.</p>,
    });
  }, [modal]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <h2>Custom Adapter Demo</h2>
      <p>
        This example wraps the app with a hand-rolled adapter. Only the Toast,
        Modal, and Loading slots have real implementations.
      </p>
      <button onClick={handleToast}>Show Custom Toast</button>
      <button onClick={handleModal}>Open Custom Modal</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default export: wraps the demo inside FeedbackProvider with custom adapter
// ---------------------------------------------------------------------------

export default function CustomAdapterMinimal(): React.ReactElement {
  return (
    <FeedbackProvider config={{ adapter: minimalAdapter } as any}>
      <AdapterDemo />
    </FeedbackProvider>
  );
}
