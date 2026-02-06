import React, { useState, useCallback } from 'react';

type Tab = 'usage' | 'setup';

interface SimpleCodeExportProps {
  usageCode: string;
  setupCode: string;
}

/**
 * Code export component that displays usage and setup code with copy functionality.
 * Unlike LiveCodeExport, this component receives code as props.
 */
export function SimpleCodeExport({
  usageCode,
  setupCode,
}: SimpleCodeExportProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('usage');
  const [copied, setCopied] = useState(false);

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
    <div className="p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Live Code</h3>
        <div className="flex gap-1">
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'usage'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveTab('usage')}
          >
            Usage
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'setup'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveTab('setup')}
          >
            Setup
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-background border rounded hover:bg-muted transition-colors"
          onClick={handleCopy}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
        <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs max-h-80 overflow-y-auto">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}
