import React from 'react';
import { useLoading } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, SelectField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function LoadingConfig(): React.ReactElement {
  const { loadingConfig, updateLoadingConfig, addResult } = usePlaygroundStore();
  const loading = useLoading();

  const handleTrigger = async (): Promise<void> => {
    addResult('Loading: Started...');
    const id = loading.show({
      message: loadingConfig.message,
      overlay: loadingConfig.type === 'overlay',
    });

    // Simulate work
    await new Promise((r) => setTimeout(r, 2000));

    loading.hide(id);
    addResult('Loading: Dismissed');
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Message"
        value={loadingConfig.message}
        onChange={(v) => updateLoadingConfig({ message: v })}
      />
      <SelectField
        label="Type"
        value={loadingConfig.type}
        options={[
          { value: 'spinner', label: 'Spinner' },
          { value: 'overlay', label: 'Overlay' },
          { value: 'inline', label: 'Inline' },
        ]}
        onChange={(v) => updateLoadingConfig({ type: v as typeof loadingConfig.type })}
      />
      <TriggerButton onClick={handleTrigger}>Trigger Loading (2s)</TriggerButton>
    </ConfigWrapper>
  );
}
