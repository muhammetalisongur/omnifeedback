/**
 * 13 - Drawer Settings Panel
 *
 * Demonstrates a right-positioned drawer that hosts a settings form with
 * dirty-state tracking. Closing the drawer while unsaved changes exist
 * triggers a confirmation dialog. Saving shows a loading indicator
 * followed by a success toast. A "Reset to Defaults" button restores
 * the original values.
 *
 * Hooks used: useDrawer, useConfirm, useLoading, useToast
 */

import React, { useState, useCallback, useRef } from 'react';
import { useDrawer, useConfirm, useLoading, useToast } from 'omnifeedback';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ISettings {
  theme: string;
  language: string;
  notifications: string;
  fontSize: string;
}

// ---------------------------------------------------------------------------
// Default settings used as the reset baseline
// ---------------------------------------------------------------------------

const DEFAULT_SETTINGS: ISettings = {
  theme: 'system',
  language: 'en',
  notifications: 'all',
  fontSize: 'medium',
};

// ---------------------------------------------------------------------------
// Simulated API helper
// ---------------------------------------------------------------------------

function saveSettingsApi(settings: ISettings): Promise<ISettings> {
  return new Promise((resolve) => setTimeout(() => resolve(settings), 1500));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DrawerSettingsPanel(): React.ReactElement {
  const drawer = useDrawer();
  const confirm = useConfirm();
  const loading = useLoading();
  const toast = useToast();

  // Current (committed) settings and a mutable draft inside the drawer.
  const [savedSettings, setSavedSettings] = useState<ISettings>({ ...DEFAULT_SETTINGS });
  const draftRef = useRef<ISettings>({ ...DEFAULT_SETTINGS });
  const dirtyRef = useRef(false);

  // -----------------------------------------------------------------------
  // Drawer content renderer
  // -----------------------------------------------------------------------

  /** Build the JSX that lives inside the drawer. */
  const renderSettingsForm = useCallback((): React.ReactElement => {
    /** Update a single field in the draft and mark the form dirty. */
    const handleChange = (field: keyof ISettings, value: string): void => {
      draftRef.current = { ...draftRef.current, [field]: value };
      dirtyRef.current = true;
    };

    /** Persist settings via simulated API call. */
    const handleSave = async (): Promise<void> => {
      const loadingId = loading.show({ message: 'Saving settings...', overlay: true });

      try {
        const result = await saveSettingsApi(draftRef.current);
        loading.hide(loadingId);
        setSavedSettings(result);
        dirtyRef.current = false;
        toast.success('Settings saved successfully.');
        drawer.closeAll();
      } catch {
        loading.hide(loadingId);
        toast.error('Failed to save settings. Please try again.');
      }
    };

    /** Restore defaults and mark dirty so the user can save. */
    const handleReset = (): void => {
      draftRef.current = { ...DEFAULT_SETTINGS };
      dirtyRef.current = true;
      // Re-open the drawer to reflect the new defaults in the form.
      drawer.closeAll();
      toast.info('Defaults restored. Open settings again to review.');
    };

    const selectStyle: React.CSSProperties = {
      width: '100%',
      padding: '8px 10px',
      borderRadius: 4,
      border: '1px solid #ccc',
      marginTop: 4,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Theme selector */}
        <label>
          Theme
          <select
            defaultValue={draftRef.current.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            style={selectStyle}
          >
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        {/* Language selector */}
        <label>
          Language
          <select
            defaultValue={draftRef.current.language}
            onChange={(e) => handleChange('language', e.target.value)}
            style={selectStyle}
          >
            <option value="en">English</option>
            <option value="tr">Turkish</option>
            <option value="de">German</option>
            <option value="fr">French</option>
          </select>
        </label>

        {/* Notification preference */}
        <label>
          Notifications
          <select
            defaultValue={draftRef.current.notifications}
            onChange={(e) => handleChange('notifications', e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Notifications</option>
            <option value="important">Important Only</option>
            <option value="none">None</option>
          </select>
        </label>

        {/* Font size preference */}
        <label>
          Font Size
          <select
            defaultValue={draftRef.current.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            style={selectStyle}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '10px 0',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Save Settings
          </button>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '10px 0',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    );
  }, [drawer, loading, toast]);

  // -----------------------------------------------------------------------
  // Open the drawer with a custom onClose guard
  // -----------------------------------------------------------------------

  const handleOpenSettings = useCallback((): void => {
    // Sync the draft with the latest saved state each time the drawer opens.
    draftRef.current = { ...savedSettings };
    dirtyRef.current = false;

    drawer.open({
      title: 'Application Settings',
      position: 'right',
      size: 'md',
      closable: true,
      content: renderSettingsForm(),
      onClose: async () => {
        if (!dirtyRef.current) return;

        const discard = await confirm.show({
          title: 'Unsaved Changes',
          message: 'You have unsaved changes. Are you sure you want to discard them?',
          confirmText: 'Discard',
          cancelText: 'Keep Editing',
          confirmVariant: 'danger',
        });

        if (!discard) {
          // Re-open the drawer so the user can continue editing.
          handleOpenSettings();
        }
      },
    });
  }, [drawer, confirm, savedSettings, renderSettingsForm]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>Settings Panel</h2>
      <p style={{ color: '#555', marginBottom: 16 }}>
        Open the drawer to modify application settings. If you close the
        drawer with unsaved changes a confirmation dialog will appear.
      </p>

      <button onClick={handleOpenSettings}>Open Settings</button>

      <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
        <h4 style={{ marginTop: 0 }}>Current Saved Settings</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
          <li><strong>Theme:</strong> {savedSettings.theme}</li>
          <li><strong>Language:</strong> {savedSettings.language}</li>
          <li><strong>Notifications:</strong> {savedSettings.notifications}</li>
          <li><strong>Font Size:</strong> {savedSettings.fontSize}</li>
        </ul>
      </div>
    </div>
  );
}
