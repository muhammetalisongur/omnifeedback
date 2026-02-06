import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { ToastConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getToastCode, getSetupCode } from '../lib/code-templates';

export function ToastPage(): React.ReactElement {
  const { toastConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Toast"
      description="Show brief notifications that auto-dismiss. Supports success, error, warning, info, and loading states with customizable position and duration."
      configPanel={<ToastConfig />}
      usageCode={getToastCode(toastConfig)}
      setupCode={getSetupCode({
        adapter: adapterType,
        toastPosition: toastConfig.position,
        toastStacked: toastConfig.stacked,
        toastMaxVisible: toastConfig.maxVisible,
      })}
    />
  );
}
