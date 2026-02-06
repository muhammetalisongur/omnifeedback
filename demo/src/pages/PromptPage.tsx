import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { PromptConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getPromptCode, getSetupCode } from '../lib/code-templates';

export function PromptPage(): React.ReactElement {
  const { promptConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Prompt"
      description="Collect text input from users with a modal dialog. Returns the entered value or null if cancelled."
      configPanel={<PromptConfig />}
      usageCode={getPromptCode(promptConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
