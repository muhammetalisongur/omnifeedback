import React from 'react';
import { usePlaygroundStore, type AdapterType } from '../../stores/playground-store';

const adapters: { value: AdapterType; label: string }[] = [
  { value: 'headless', label: 'Headless' },
  { value: 'shadcn', label: 'shadcn/ui' },
  { value: 'mantine', label: 'Mantine' },
  { value: 'chakra', label: 'Chakra UI' },
  { value: 'mui', label: 'MUI' },
  { value: 'antd', label: 'Ant Design' },
];

/**
 * Horizontal pill-style adapter selector displayed on each component page.
 * Reads and updates the adapter type from Zustand store.
 */
export function AdapterTabs(): React.ReactElement {
  const adapterType = usePlaygroundStore((s) => s.adapterType);
  const setAdapterType = usePlaygroundStore((s) => s.setAdapterType);

  return (
    <div className="flex flex-wrap gap-2">
      {adapters.map((adapter) => (
        <button
          key={adapter.value}
          onClick={() => setAdapterType(adapter.value)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors
            ${adapterType === adapter.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground/70 border-border hover:bg-muted hover:text-foreground'
            }`}
        >
          {adapter.label}
        </button>
      ))}
    </div>
  );
}
