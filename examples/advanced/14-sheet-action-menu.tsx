/**
 * 14 - Sheet Action Menu
 *
 * Demonstrates mobile-style action sheets and confirm sheets powered by
 * the useSheet hook. Covers showActions for option menus, confirm for
 * destructive operations, and open() for custom sheet content.
 *
 * Hooks used: useSheet, useToast
 */

import React, { useState, useCallback } from 'react';
import { useSheet, useToast } from 'omnifeedback';

// ---------------------------------------------------------------------------
// Predefined color palette for the custom color picker sheet
// ---------------------------------------------------------------------------

const COLOR_PALETTE = [
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Sky', hex: '#0284c7' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Slate', hex: '#475569' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SheetActionMenu(): React.ReactElement {
  const sheet = useSheet();
  const toast = useToast();

  const [lastAction, setLastAction] = useState<string>('None');
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0].hex);

  // -----------------------------------------------------------------------
  // 1. Photo options action sheet
  // -----------------------------------------------------------------------

  const handlePhotoOptions = useCallback(async (): Promise<void> => {
    const key = await sheet.showActions({
      title: 'Change Profile Photo',
      description: 'Select a source for your new photo.',
      showCancel: true,
      cancelText: 'Cancel',
      actions: [
        { key: 'camera', label: 'Take Photo' },
        { key: 'gallery', label: 'Choose from Gallery' },
        { key: 'remove', label: 'Remove Current Photo', destructive: true },
      ],
    });

    if (key === null) {
      setLastAction('Photo options: cancelled');
      return;
    }

    // Route by selected action key.
    switch (key) {
      case 'camera':
        toast.info('Camera opened (simulated).');
        setLastAction('Photo: Take Photo');
        break;
      case 'gallery':
        toast.info('Gallery opened (simulated).');
        setLastAction('Photo: Choose from Gallery');
        break;
      case 'remove':
        toast.warning('Profile photo removed.');
        setLastAction('Photo: Removed');
        break;
      default:
        setLastAction(`Photo: unknown key "${key}"`);
    }
  }, [sheet, toast]);

  // -----------------------------------------------------------------------
  // 2. Share action sheet
  // -----------------------------------------------------------------------

  const handleShare = useCallback(async (): Promise<void> => {
    const key = await sheet.showActions({
      title: 'Share This Post',
      showCancel: true,
      actions: [
        { key: 'copy', label: 'Copy Link' },
        { key: 'email', label: 'Send via Email' },
        { key: 'twitter', label: 'Share on Twitter' },
        { key: 'linkedin', label: 'Share on LinkedIn' },
      ],
    });

    if (key === null) {
      setLastAction('Share: cancelled');
      return;
    }

    toast.success(`Shared via "${key}" (simulated).`);
    setLastAction(`Share: ${key}`);
  }, [sheet, toast]);

  // -----------------------------------------------------------------------
  // 3. Destructive confirm sheet
  // -----------------------------------------------------------------------

  const handleDeleteAccount = useCallback(async (): Promise<void> => {
    const confirmed = await sheet.confirm({
      title: 'Delete Account',
      description:
        'This will permanently erase all of your data including posts, comments, and settings. This action cannot be reversed.',
      confirmText: 'Delete My Account',
      cancelText: 'Keep Account',
      destructive: true,
    });

    if (confirmed) {
      toast.error('Account deleted (simulated).');
      setLastAction('Account: deleted');
    } else {
      toast.info('Account deletion cancelled.');
      setLastAction('Account: kept');
    }
  }, [sheet, toast]);

  // -----------------------------------------------------------------------
  // 4. Custom sheet with a color picker
  // -----------------------------------------------------------------------

  const handleColorPicker = useCallback((): void => {
    sheet.open({
      title: 'Pick a Theme Color',
      showHandle: true,
      closeOnBackdropClick: true,
      content: (
        <div style={{ padding: 16 }}>
          <p style={{ marginTop: 0, color: '#555' }}>
            Select a color to personalize your theme.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.hex}
                onClick={() => {
                  setSelectedColor(color.hex);
                  toast.success(`Theme color set to ${color.name}.`);
                  setLastAction(`Color: ${color.name}`);
                  sheet.closeAll();
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: color.hex,
                  border: selectedColor === color.hex ? '3px solid #000' : '2px solid transparent',
                  cursor: 'pointer',
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      ),
    });
  }, [sheet, toast, selectedColor]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Sheet Action Menu</h2>
      <p style={{ color: '#555', marginBottom: 16 }}>
        Mobile-style action sheets, confirm sheets, and custom sheet content.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={handlePhotoOptions}>Photo Options</button>
        <button onClick={handleShare}>Share</button>
        <button onClick={handleColorPicker}>Pick Theme Color</button>
        <hr />
        <button onClick={handleDeleteAccount} style={{ color: '#dc2626' }}>
          Delete Account
        </button>
      </div>

      {/* Status display */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 8,
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: selectedColor,
            flexShrink: 0,
          }}
        />
        <div>
          <strong>Last Action:</strong> {lastAction}
        </div>
      </div>
    </div>
  );
}
