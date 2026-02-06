import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { AlertConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getAlertCode, getSetupCode } from '../lib/code-templates';

export function AlertPage(): React.ReactElement {
  const { alertConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Alert"
      description="Show alert messages with different variants for informational, success, warning, and error states."
      configPanel={<AlertConfig />}
      usageCode={getAlertCode(alertConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
