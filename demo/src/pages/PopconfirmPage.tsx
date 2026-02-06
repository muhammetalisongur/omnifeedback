import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { PopconfirmConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getPopconfirmCode, getSetupCode } from '../lib/code-templates';

export function PopconfirmPage(): React.ReactElement {
  const { popconfirmConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Popconfirm"
      description="Lightweight confirmation popover attached to an element. Ideal for inline delete or action confirmations."
      configPanel={<PopconfirmConfig />}
      usageCode={getPopconfirmCode(popconfirmConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
