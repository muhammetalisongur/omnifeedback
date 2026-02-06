import React from 'react';
import { usePlaygroundStore } from '../../stores/playground-store';

export function ResultLog(): React.ReactElement {
  const { resultLog, clearResults } = usePlaygroundStore();

  return (
    <div className="p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Result Log</h3>
        {resultLog.length > 0 && (
          <button
            className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
            onClick={clearResults}
          >
            Clear
          </button>
        )}
      </div>

      <div className="h-48 overflow-y-auto bg-muted rounded-md p-3">
        {resultLog.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Trigger a feedback to see results here...
          </p>
        ) : (
          <div className="space-y-1">
            {resultLog.map((log, index) => (
              <div key={index} className="text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
