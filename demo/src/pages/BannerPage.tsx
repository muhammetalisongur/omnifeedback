import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { BannerConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getBannerCode, getSetupCode } from '../lib/code-templates';

export function BannerPage(): React.ReactElement {
  const { bannerConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Banner"
      description="Display prominent messages at the top or bottom of the page. Great for announcements, system status, or promotions."
      configPanel={<BannerConfig />}
      usageCode={getBannerCode(bannerConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
