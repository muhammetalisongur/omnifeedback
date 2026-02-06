import React from 'react';
import { useConnection, useToast } from 'omnifeedback';
import { DemoSection } from '../components/DemoSection';
import { Button } from '../components/Button';

export function ConnectionPage(): React.ReactElement {
  const connection = useConnection();
  const toast = useToast();

  const handleQueueAction = (): void => {
    if (connection.isOnline) {
      toast.success('Action executed immediately');
    } else {
      connection.queueAction(async () => {
        toast.success('Queued action executed!');
      });
      toast.info('Action queued for when you reconnect');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Connection</h1>
        <p className="text-muted-foreground">
          Monitor network connectivity and queue actions for offline scenarios.
        </p>
      </div>

      <DemoSection
        title="Connection Status"
        description="Real-time network status monitoring."
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-4 h-4 rounded-full ${
              connection.isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="font-medium">
            {connection.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </DemoSection>

      <DemoSection
        title="Queue Size"
        description="Number of actions waiting to execute."
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold">{connection.getQueueSize()}</span>
          <span className="text-muted-foreground">queued actions</span>
        </div>
      </DemoSection>

      <DemoSection
        title="Queue Actions"
        description="Queue actions that execute when back online."
      >
        <Button onClick={handleQueueAction}>
          {connection.isOnline ? 'Execute Action' : 'Queue Action'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            connection.queueAction(async () => {
              toast.success('Action 1 executed');
            });
            connection.queueAction(async () => {
              toast.success('Action 2 executed');
            });
            toast.info('2 actions queued');
          }}
        >
          Queue Multiple
        </Button>
      </DemoSection>

      <DemoSection
        title="Retry Connection"
        description="Manually check connection status."
      >
        <Button
          variant="secondary"
          onClick={() => {
            const online = navigator.onLine;
            toast.info(online ? 'Connection restored!' : 'Still offline');
          }}
        >
          Check Connection
        </Button>
      </DemoSection>

      <DemoSection
        title="Usage Pattern"
        description="Common pattern for offline-aware saving."
      >
        <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`const { isOnline, queueAction } = useConnection();

const handleSave = async (data) => {
  if (isOnline) {
    await api.save(data);
    toast.success('Saved!');
  } else {
    queueAction(() => api.save(data));
    toast.info('Will save when online');
  }
};`}</pre>
        </div>
      </DemoSection>

      <DemoSection
        title="Simulate Offline"
        description="Test offline behavior using browser DevTools."
      >
        <div className="p-4 border rounded-lg text-sm text-muted-foreground">
          <p className="mb-2">To test offline behavior:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open Chrome DevTools (F12)</li>
            <li>Go to Network tab</li>
            <li>Select "Offline" from the throttling dropdown</li>
            <li>Try the actions above to see queuing behavior</li>
          </ol>
        </div>
      </DemoSection>
    </div>
  );
}
