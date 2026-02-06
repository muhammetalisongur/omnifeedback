import React from 'react';
import { useDrawer } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, SelectField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function DrawerConfig(): React.ReactElement {
  const { drawerConfig, updateDrawerConfig, addResult } = usePlaygroundStore();
  const drawer = useDrawer();

  const handleTrigger = (): void => {
    drawer.open({
      title: drawerConfig.title,
      content: <div className="p-4">{drawerConfig.content}</div>,
      position: drawerConfig.position,
      size: drawerConfig.size,
    });
    addResult('Drawer: Opened');
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Title"
        value={drawerConfig.title}
        onChange={(v) => updateDrawerConfig({ title: v })}
      />
      <InputField
        label="Content"
        value={drawerConfig.content}
        onChange={(v) => updateDrawerConfig({ content: v })}
      />
      <SelectField
        label="Position"
        value={drawerConfig.position}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
          { value: 'top', label: 'Top' },
          { value: 'bottom', label: 'Bottom' },
        ]}
        onChange={(v) => updateDrawerConfig({ position: v as typeof drawerConfig.position })}
      />
      <SelectField
        label="Size"
        value={drawerConfig.size}
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        onChange={(v) => updateDrawerConfig({ size: v as typeof drawerConfig.size })}
      />
      <TriggerButton onClick={handleTrigger}>Open Drawer</TriggerButton>
    </ConfigWrapper>
  );
}
