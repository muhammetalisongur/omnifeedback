import React from 'react';
import { useBanner } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, SelectField, CheckboxField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function BannerConfig(): React.ReactElement {
  const { bannerConfig, updateBannerConfig, addResult } = usePlaygroundStore();
  const banner = useBanner();

  const handleTrigger = (): void => {
    banner.show({
      message: bannerConfig.message,
      variant: bannerConfig.variant,
      dismissible: bannerConfig.dismissible,
      position: bannerConfig.position,
    });
    addResult(`Banner: "${bannerConfig.message}" (${bannerConfig.variant})`);
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Message"
        value={bannerConfig.message}
        onChange={(v) => updateBannerConfig({ message: v })}
      />
      <SelectField
        label="Variant"
        value={bannerConfig.variant}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'info', label: 'Info' },
          { value: 'success', label: 'Success' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ]}
        onChange={(v) => updateBannerConfig({ variant: v as typeof bannerConfig.variant })}
      />
      <SelectField
        label="Position"
        value={bannerConfig.position}
        options={[
          { value: 'top', label: 'Top' },
          { value: 'bottom', label: 'Bottom' },
        ]}
        onChange={(v) => updateBannerConfig({ position: v as typeof bannerConfig.position })}
      />
      <CheckboxField
        label="Dismissible"
        checked={bannerConfig.dismissible}
        onChange={(v) => updateBannerConfig({ dismissible: v })}
      />
      <TriggerButton onClick={handleTrigger}>Show Banner</TriggerButton>
    </ConfigWrapper>
  );
}
