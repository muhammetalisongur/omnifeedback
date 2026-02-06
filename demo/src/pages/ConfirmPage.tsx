import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { ConfirmConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getConfirmCode, getSetupCode } from '../lib/code-templates';

export function ConfirmPage(): React.ReactElement {
  const { confirmConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Confirm"
      description="Display confirmation dialogs before critical actions. Returns a promise that resolves with the user's choice."
      configPanel={<ConfirmConfig />}
      usageCode={getConfirmCode(confirmConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
