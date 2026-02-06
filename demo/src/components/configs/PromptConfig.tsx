import React from 'react';
import { usePrompt } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function PromptConfig(): React.ReactElement {
  const { promptConfig, updatePromptConfig, addResult } = usePlaygroundStore();
  const prompt = usePrompt();

  const handleTrigger = async (): Promise<void> => {
    addResult('Prompt: Dialog opened...');
    const value = await prompt.show({
      title: promptConfig.title,
      description: promptConfig.message,
      placeholder: promptConfig.placeholder,
      defaultValue: promptConfig.defaultValue,
    });
    if (value !== null) {
      addResult(`Prompt: User entered "${value}"`);
    } else {
      addResult('Prompt: User cancelled');
    }
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Title"
        value={promptConfig.title}
        onChange={(v) => updatePromptConfig({ title: v })}
      />
      <InputField
        label="Message"
        value={promptConfig.message}
        onChange={(v) => updatePromptConfig({ message: v })}
      />
      <InputField
        label="Placeholder"
        value={promptConfig.placeholder}
        onChange={(v) => updatePromptConfig({ placeholder: v })}
      />
      <InputField
        label="Default Value"
        value={promptConfig.defaultValue}
        onChange={(v) => updatePromptConfig({ defaultValue: v })}
      />
      <TriggerButton onClick={handleTrigger}>Trigger Prompt</TriggerButton>
    </ConfigWrapper>
  );
}
