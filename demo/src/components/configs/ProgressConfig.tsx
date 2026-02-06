import React from 'react';
import { useProgress, useToast } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, CheckboxField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function ProgressConfig(): React.ReactElement {
  const { progressConfig, updateProgressConfig, addResult } = usePlaygroundStore();
  const progress = useProgress();
  const toast = useToast();

  const handleTrigger = async (): Promise<void> => {
    addResult('Progress: Started...');

    if (progressConfig.indeterminate) {
      const id = progress.show({
        value: 0,
        label: progressConfig.label,
        indeterminate: true,
      });
      await new Promise((r) => setTimeout(r, 3000));
      progress.complete(id);
    } else {
      const id = progress.show({
        value: 0,
        label: progressConfig.label,
        showPercentage: progressConfig.showPercentage,
      });

      for (let i = 0; i <= 100; i += 10) {
        progress.update(id, i);
        await new Promise((r) => setTimeout(r, 200));
      }

      progress.complete(id);
    }

    toast.success('Progress complete!');
    addResult('Progress: Complete');
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Label"
        value={progressConfig.label}
        onChange={(v) => updateProgressConfig({ label: v })}
      />
      <CheckboxField
        label="Show Percentage"
        checked={progressConfig.showPercentage}
        onChange={(v) => updateProgressConfig({ showPercentage: v })}
      />
      <CheckboxField
        label="Indeterminate"
        checked={progressConfig.indeterminate}
        onChange={(v) => updateProgressConfig({ indeterminate: v })}
      />
      <TriggerButton onClick={handleTrigger}>Trigger Progress</TriggerButton>
    </ConfigWrapper>
  );
}
