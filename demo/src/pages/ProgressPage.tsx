import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { ProgressConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getProgressCode, getSetupCode } from '../lib/code-templates';

export function ProgressPage(): React.ReactElement {
  const { progressConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Progress"
      description="Show progress indicators for long-running operations. Supports determinate, indeterminate, and multi-step progress."
      configPanel={<ProgressConfig />}
      usageCode={getProgressCode(progressConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
