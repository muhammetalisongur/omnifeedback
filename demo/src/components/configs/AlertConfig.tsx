import React from 'react';
import { useAlert } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, SelectField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function AlertConfig(): React.ReactElement {
  const { alertConfig, updateAlertConfig, addResult } = usePlaygroundStore();
  const alert = useAlert();

  const handleTrigger = (): void => {
    alert.show({
      title: alertConfig.title,
      message: alertConfig.message,
      variant: alertConfig.variant,
    });
    addResult(`Alert: "${alertConfig.message}" (${alertConfig.variant})`);
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Title"
        value={alertConfig.title}
        onChange={(v) => updateAlertConfig({ title: v })}
      />
      <InputField
        label="Message"
        value={alertConfig.message}
        onChange={(v) => updateAlertConfig({ message: v })}
      />
      <SelectField
        label="Variant"
        value={alertConfig.variant}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'info', label: 'Info' },
          { value: 'success', label: 'Success' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ]}
        onChange={(v) => updateAlertConfig({ variant: v as typeof alertConfig.variant })}
      />
      <TriggerButton onClick={handleTrigger}>Trigger Alert</TriggerButton>
    </ConfigWrapper>
  );
}
