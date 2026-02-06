import React from 'react';
import { useModal } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import { InputField, SelectField, CheckboxField, ConfigWrapper, TriggerButton } from '../playground/FormFields';

export function ModalConfig(): React.ReactElement {
  const { modalConfig, updateModalConfig, addResult } = usePlaygroundStore();
  const modal = useModal();

  const handleTrigger = (): void => {
    modal.open({
      title: modalConfig.title,
      content: <div className="p-4">{modalConfig.content}</div>,
      size: modalConfig.size,
      closeOnBackdropClick: modalConfig.closeOnOverlayClick,
    });
    addResult('Modal: Opened');
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Title"
        value={modalConfig.title}
        onChange={(v) => updateModalConfig({ title: v })}
      />
      <InputField
        label="Content"
        value={modalConfig.content}
        onChange={(v) => updateModalConfig({ content: v })}
      />
      <SelectField
        label="Size"
        value={modalConfig.size}
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
          { value: 'xl', label: 'Extra Large' },
          { value: 'full', label: 'Full' },
        ]}
        onChange={(v) => updateModalConfig({ size: v as typeof modalConfig.size })}
      />
      <CheckboxField
        label="Close on Overlay Click"
        checked={modalConfig.closeOnOverlayClick}
        onChange={(v) => updateModalConfig({ closeOnOverlayClick: v })}
      />
      <TriggerButton onClick={handleTrigger}>Open Modal</TriggerButton>
    </ConfigWrapper>
  );
}
