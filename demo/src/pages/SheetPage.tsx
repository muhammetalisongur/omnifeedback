import React from 'react';
import { useSheet, useToast } from 'omnifeedback';
import { DemoSection } from '../components/DemoSection';
import { Button } from '../components/Button';

export function SheetPage(): React.ReactElement {
  const sheet = useSheet();
  const toast = useToast();

  const showBasicSheet = (): void => {
    sheet.open({
      content: (
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Basic Sheet</h3>
          <p className="text-muted-foreground">
            Sheets slide up from the bottom of the screen, similar to iOS action sheets.
          </p>
          <Button onClick={() => sheet.closeAll()} className="w-full">
            Close
          </Button>
        </div>
      ),
    });
  };

  const showActionSheet = async (): Promise<void> => {
    const result = await sheet.showActions({
      title: 'Share',
      description: 'Choose how to share this item',
      actions: [
        { key: 'copy', label: 'Copy Link', icon: '📋' },
        { key: 'email', label: 'Email', icon: '✉️' },
        { key: 'twitter', label: 'Twitter', icon: '🐦' },
        { key: 'facebook', label: 'Facebook', icon: '👤' },
      ],
    });

    if (result) {
      toast.success(`Shared via ${result}`);
    }
  };

  const showPhotoSheet = async (): Promise<void> => {
    const result = await sheet.showActions({
      title: 'Change Photo',
      actions: [
        { key: 'camera', label: 'Take Photo', icon: '📷' },
        { key: 'library', label: 'Choose from Library', icon: '🖼️' },
        { key: 'remove', label: 'Remove Photo', icon: '🗑️', destructive: true },
      ],
    });

    if (result) {
      toast.info(`Selected: ${result}`);
    }
  };

  const showConfirmSheet = async (): Promise<void> => {
    const confirmed = await sheet.confirm({
      title: 'Delete Item?',
      description: 'This action cannot be undone.',
      confirmText: 'Delete',
      destructive: true,
    });

    if (confirmed) {
      toast.success('Item deleted');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sheet</h1>
        <p className="text-muted-foreground">
          Bottom sheets for mobile-style interactions. Includes action sheets
          and confirmation sheets.
        </p>
      </div>

      <DemoSection
        title="Basic Sheet"
        description="Simple bottom sheet with custom content."
      >
        <Button onClick={showBasicSheet}>Open Sheet</Button>
      </DemoSection>

      <DemoSection
        title="Action Sheet"
        description="iOS-style action sheet with selectable options."
      >
        <Button onClick={showActionSheet}>Share Menu</Button>
        <Button variant="secondary" onClick={showPhotoSheet}>
          Photo Options
        </Button>
      </DemoSection>

      <DemoSection
        title="Confirm Sheet"
        description="Confirmation dialog as a bottom sheet."
      >
        <Button variant="destructive" onClick={showConfirmSheet}>
          Delete with Sheet
        </Button>
      </DemoSection>

      <DemoSection
        title="Custom Content"
        description="Sheet can contain any content."
      >
        <Button
          variant="outline"
          onClick={() =>
            sheet.open({
              content: (
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Select Color</h3>
                  <div className="flex gap-2">
                    {['red', 'blue', 'green', 'yellow', 'purple'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          sheet.closeAll();
                          toast.success(`Selected ${color}`);
                        }}
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              ),
            })
          }
        >
          Color Picker
        </Button>
      </DemoSection>
    </div>
  );
}
