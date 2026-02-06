import React from 'react';
import { useConfirm } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function ConfirmConfig(): React.ReactElement {
  const { confirmConfig, updateConfirmConfig, addResult } = usePlaygroundStore();
  const confirm = useConfirm();

  const handleTrigger = async (): Promise<void> => {
    addResult('Confirm: Dialog opened...');
    const result = await confirm.show({
      message: confirmConfig.message,
      title: confirmConfig.title,
      confirmText: confirmConfig.confirmText,
      cancelText: confirmConfig.cancelText,
    });
    addResult(`Confirm: ${result ? 'CONFIRMED' : 'CANCELLED'}`);
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Title"
        value={confirmConfig.title}
        onChange={(v) => updateConfirmConfig({ title: v })}
      />
      <InputField
        label="Message"
        value={confirmConfig.message}
        onChange={(v) => updateConfirmConfig({ message: v })}
      />
      <InputField
        label="Confirm Text"
        value={confirmConfig.confirmText}
        onChange={(v) => updateConfirmConfig({ confirmText: v })}
      />
      <InputField
        label="Cancel Text"
        value={confirmConfig.cancelText}
        onChange={(v) => updateConfirmConfig({ cancelText: v })}
      />
      <TriggerButton onClick={handleTrigger}>Trigger Confirm</TriggerButton>
    </ConfigWrapper>
  );
}
