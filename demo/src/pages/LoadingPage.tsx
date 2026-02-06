import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { LoadingConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getLoadingCode, getSetupCode } from '../lib/code-templates';

export function LoadingPage(): React.ReactElement {
  const { loadingConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Loading"
      description="Display loading indicators during async operations. Supports spinner, overlay, and inline modes."
      configPanel={<LoadingConfig />}
      usageCode={getLoadingCode(loadingConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
