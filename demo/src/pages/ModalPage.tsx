import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { ModalConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getModalCode, getSetupCode } from '../lib/code-templates';

export function ModalPage(): React.ReactElement {
  const { modalConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Modal"
      description="Display modal dialogs for complex interactions. Supports multiple sizes and backdrop click behavior."
      configPanel={<ModalConfig />}
      usageCode={getModalCode(modalConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
