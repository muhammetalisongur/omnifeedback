import React from 'react';
import { usePopconfirm } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function PopconfirmConfig(): React.ReactElement {
  const { popconfirmConfig, updatePopconfirmConfig, addResult } = usePlaygroundStore();
  const popconfirm = usePopconfirm();

  const handleTrigger = async (e: React.MouseEvent): Promise<void> => {
    addResult('Popconfirm: Opened...');
    const confirmed = await popconfirm.show({
      target: e.currentTarget as HTMLElement,
      title: popconfirmConfig.title,
      message: popconfirmConfig.message,
      confirmText: popconfirmConfig.confirmText,
      cancelText: popconfirmConfig.cancelText,
    });
    addResult(`Popconfirm: ${confirmed ? 'CONFIRMED' : 'CANCELLED'}`);
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Title"
        value={popconfirmConfig.title}
        onChange={(v) => updatePopconfirmConfig({ title: v })}
      />
      <InputField
        label="Message"
        value={popconfirmConfig.message}
        onChange={(v) => updatePopconfirmConfig({ message: v })}
      />
      <InputField
        label="Confirm Text"
        value={popconfirmConfig.confirmText}
        onChange={(v) => updatePopconfirmConfig({ confirmText: v })}
      />
      <InputField
        label="Cancel Text"
        value={popconfirmConfig.cancelText}
        onChange={(v) => updatePopconfirmConfig({ cancelText: v })}
      />
      <TriggerButton onClick={handleTrigger}>Trigger Popconfirm</TriggerButton>
    </ConfigWrapper>
  );
}
