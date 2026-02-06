import React from 'react';
import { PlaygroundLayout } from '../components/playground/PlaygroundLayout';
import { DrawerConfig } from '../components/configs';
import { usePlaygroundStore } from '../stores/playground-store';
import { getDrawerCode, getSetupCode } from '../lib/code-templates';

export function DrawerPage(): React.ReactElement {
  const { drawerConfig, adapterType } = usePlaygroundStore();

  return (
    <PlaygroundLayout
      title="Drawer"
      description="Slide-in panel for navigation, forms, or detailed views. Position from any edge with customizable size."
      configPanel={<DrawerConfig />}
      usageCode={getDrawerCode(drawerConfig)}
      setupCode={getSetupCode({ adapter: adapterType })}
    />
  );
}
