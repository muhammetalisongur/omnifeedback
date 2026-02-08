import React from 'react';
import { AdapterTabs } from './AdapterTabs';
import { SimpleCodeExport } from './SimpleCodeExport';
import { ResultLog } from './ResultLog';

interface PlaygroundLayoutProps {
  title: string;
  description: string;
  configPanel: React.ReactNode;
  usageCode: string;
  setupCode: string;
}

/**
 * Shared layout for all component playground pages.
 * Displays config panel on left, code export and result log on right.
 */
export function PlaygroundLayout({
  title,
  description,
  configPanel,
  usageCode,
  setupCode,
}: PlaygroundLayoutProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      {/* Adapter Selector */}
      <AdapterTabs />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Config Panel */}
        <div className="space-y-4">{configPanel}</div>

        {/* Right: Code Export + Result Log */}
        <div className="space-y-4">
          <SimpleCodeExport usageCode={usageCode} setupCode={setupCode} />
          <ResultLog />
        </div>
      </div>
    </div>
  );
}
