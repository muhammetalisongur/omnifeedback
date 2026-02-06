/**
 * 10 - Nested Modals
 *
 * Demonstrates: Modal-inside-modal pattern with independent lifecycle
 * Hooks used: useModal, useConfirm, useToast
 *
 * Scenarios covered:
 *   1. Primary "Settings" modal with an "Advanced Settings" button
 *   2. Clicking "Advanced Settings" opens a second (child) modal
 *   3. Both modals can be closed independently
 *   4. Confirm dialog before closing the parent when the child has unsaved changes
 *   5. Track and display openModals count
 */

import React, { useState, useCallback, useRef, createElement } from 'react';
import { useModal, useConfirm, useToast } from 'omnifeedback';

// ------------------------------------------------------------------ sub-components

/** Advanced settings panel rendered inside the child modal. */
function AdvancedSettingsPanel({
  onSave,
  onDirtyChange,
}: {
  onSave: (value: string) => void;
  onDirtyChange: (dirty: boolean) => void;
}): React.ReactElement {
  const [cacheSize, setCacheSize] = useState('256');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCacheSize(e.target.value);
    onDirtyChange(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: 0, color: '#666' }}>
        Configure low-level parameters. Changes here require a restart.
      </p>
      <label>
        Cache Size (MB)
        <input
          type="number"
          value={cacheSize}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', padding: '8px 10px', marginTop: 4, border: '1px solid #ccc', borderRadius: 4 }}
        />
      </label>
      <button onClick={() => onSave(cacheSize)} style={{ alignSelf: 'flex-end', padding: '8px 20px' }}>
        Apply
      </button>
    </div>
  );
}

/** Primary settings panel rendered inside the parent modal. */
function SettingsPanel({
  onOpenAdvanced,
}: {
  onOpenAdvanced: () => void;
}): React.ReactElement {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <label>
        Theme
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '8px 10px', marginTop: 4, border: '1px solid #ccc', borderRadius: 4 }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        Enable notifications
      </label>

      <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <button onClick={onOpenAdvanced} style={{ padding: '8px 16px', alignSelf: 'flex-start' }}>
        Advanced Settings...
      </button>
    </div>
  );
}

// ------------------------------------------------------------------ main component

export default function NestedModals(): React.ReactElement {
  const modal = useModal();
  const confirm = useConfirm();
  const toast = useToast();

  /** Tracks whether the child modal has unsaved changes. */
  const childDirtyRef = useRef(false);
  /** Stores the child modal ID so the parent can reference it. */
  const childModalIdRef = useRef<string | null>(null);

  /** Open the child (advanced settings) modal. */
  const openAdvancedModal = useCallback((): void => {
    childDirtyRef.current = false;

    const childId = modal.open({
      title: 'Advanced Settings',
      size: 'sm',
      centered: true,
      content: createElement(AdvancedSettingsPanel, {
        onSave: (cacheSize: string) => {
          childDirtyRef.current = false;
          modal.close(childId);
          toast.success(`Cache size set to ${cacheSize} MB. Restart required.`);
        },
        onDirtyChange: (dirty: boolean) => {
          childDirtyRef.current = dirty;
        },
      }),
      onClose: () => {
        childDirtyRef.current = false;
        childModalIdRef.current = null;
      },
    });

    childModalIdRef.current = childId;
  }, [modal, toast]);

  /** Open the parent (settings) modal. */
  const handleOpenSettings = useCallback((): void => {
    const parentId = modal.open({
      title: 'Settings',
      size: 'lg',
      closable: true,
      closeOnEscape: true,
      content: createElement(SettingsPanel, {
        onOpenAdvanced: openAdvancedModal,
      }),
      onClose: async () => {
        // If child modal has unsaved changes, ask for confirmation.
        if (childDirtyRef.current) {
          const discard = await confirm.show({
            title: 'Unsaved Changes',
            message:
              'Advanced Settings has unsaved changes. Discard them and close?',
            confirmText: 'Discard',
            cancelText: 'Go Back',
            confirmVariant: 'danger',
          });

          if (!discard) {
            // Re-open the parent since onClose already removed it.
            handleOpenSettings();
            return;
          }

          // Close child modal if still open.
          if (childModalIdRef.current) {
            modal.close(childModalIdRef.current);
            childModalIdRef.current = null;
          }
        }

        childDirtyRef.current = false;
        toast.info('Settings closed.');
      },
    });

    // Store the parent ID for external reference if needed.
    void parentId;
  }, [modal, confirm, toast, openAdvancedModal]);

  /** Close every open modal at once. */
  const handleCloseAll = useCallback((): void => {
    modal.closeAll();
    childDirtyRef.current = false;
    childModalIdRef.current = null;
    toast.info('All modals closed.');
  }, [modal, toast]);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2>Nested Modals</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Open the Settings modal, then click &quot;Advanced Settings&quot; inside it to
        open a child modal. Modify a field in the child, then try closing the
        parent to see the unsaved-changes confirmation.
      </p>

      {/* Open modals counter */}
      <div
        style={{
          display: 'inline-block',
          padding: '6px 14px',
          marginBottom: 16,
          background: '#f3f4f6',
          borderRadius: 6,
          fontSize: 13,
        }}
      >
        Open modals: <strong>{modal.openModals.length}</strong>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleOpenSettings} style={{ padding: '10px 20px' }}>
          Open Settings
        </button>
        <button
          onClick={handleCloseAll}
          disabled={!modal.isOpen}
          style={{
            padding: '10px 20px',
            opacity: modal.isOpen ? 1 : 0.5,
            cursor: modal.isOpen ? 'pointer' : 'not-allowed',
          }}
        >
          Close All Modals
        </button>
      </div>
    </div>
  );
}
