import React, { useState, useCallback } from 'react';
import { usePlaygroundStore } from '../../stores/playground-store';

type Tab = 'usage' | 'setup';

interface SimpleCodeExportProps {
  usageCode: string;
  setupCode: string;
}

/**
 * Code export component that displays usage and setup code with copy functionality.
 * Styled to match the reference project with dark code background, monospace font,
 * and segmented tab controls. Shows the active adapter name in the Setup tab.
 */
export function SimpleCodeExport({
  usageCode,
  setupCode,
}: SimpleCodeExportProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('usage');
  const [copied, setCopied] = useState(false);
  const adapterType = usePlaygroundStore((s) => s.adapterType);

  const adapterLabel = adapterType.toUpperCase();
  const currentCode = activeTab === 'usage' ? usageCode : setupCode;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = currentCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentCode]);

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Code
        </h3>
        <div className="flex gap-1 bg-muted p-0.5 rounded-md">
          <button
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-150 ${
              activeTab === 'usage'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('usage')}
          >
            Usage
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-150 ${
              activeTab === 'setup'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('setup')}
          >
            Setup ({adapterLabel})
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="relative" style={{ background: 'var(--code-bg)' }}>
        <button
          className="absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded border
            text-muted-foreground bg-secondary/50 border-border
            hover:text-foreground hover:border-muted-foreground
            transition-all duration-150 z-10"
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <pre
          className="p-5 overflow-auto"
          style={{
            maxHeight: '400px',
            fontFamily: 'var(--code-font)',
            fontSize: '13px',
            lineHeight: '1.7',
            color: 'hsl(var(--foreground))',
          }}
        >
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}
