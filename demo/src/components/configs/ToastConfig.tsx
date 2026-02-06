import React from 'react';
import { useToast } from 'omnifeedback';
import { usePlaygroundStore } from '../../stores/playground-store';
import {
  InputField,
  SelectField,
  RangeField,
  CheckboxField,
  ConfigWrapper,
  TriggerButton,
} from '../playground/FormFields';
import type { ToastAnimationType, ToastThemeType } from '../../stores/playground-store';

export function ToastConfig(): React.ReactElement {
  const { toastConfig, updateToastConfig, addResult } = usePlaygroundStore();
  const toast = useToast();

  const handleTrigger = (): void => {
    const method = toastConfig.type as keyof typeof toast;
    // Persistent mode: duration=0 forces toast to stay until manually dismissed
    const effectiveDuration = toastConfig.persistent ? 0 : toastConfig.duration;

    if (typeof toast[method] === 'function') {
      (toast[method] as (msg: string, options?: Record<string, unknown>) => void)(
        toastConfig.message,
        {
          position: toastConfig.position,
          duration: effectiveDuration,
          showProgress: toastConfig.persistent ? false : toastConfig.showProgress,
          progressPosition: toastConfig.progressPosition,
          dismissible: toastConfig.persistent ? true : toastConfig.dismissible,
          pauseOnHover: toastConfig.persistent ? false : toastConfig.pauseOnHover,
          animation: toastConfig.animation,
          showLeftBorder: toastConfig.showLeftBorder,
          theme: toastConfig.theme,
        }
      );
    }
    addResult(`Toast: "${toastConfig.message}" (${toastConfig.type}, ${toastConfig.animation}${toastConfig.persistent ? ', persistent' : ''})`);
  };

  return (
    <ConfigWrapper>
      <InputField
        label="Message"
        value={toastConfig.message}
        onChange={(v) => updateToastConfig({ message: v })}
      />
      <SelectField
        label="Type"
        value={toastConfig.type}
        options={[
          { value: 'info', label: 'Info' },
          { value: 'success', label: 'Success' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ]}
        onChange={(v) => updateToastConfig({ type: v as 'info' | 'success' | 'warning' | 'error' })}
      />
      <SelectField
        label="Position"
        value={toastConfig.position}
        options={[
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-center', label: 'Top Center' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-center', label: 'Bottom Center' },
          { value: 'bottom-right', label: 'Bottom Right' },
        ]}
        onChange={(v) => updateToastConfig({ position: v as typeof toastConfig.position })}
      />
      {/* Persistent Mode */}
      <CheckboxField
        label="Persistent (No Auto-Dismiss)"
        checked={toastConfig.persistent}
        onChange={(v) => updateToastConfig({ persistent: v })}
      />
      {!toastConfig.persistent && (
        <RangeField
          label="Duration"
          value={toastConfig.duration}
          min={1000}
          max={10000}
          step={500}
          unit="ms"
          onChange={(v) => updateToastConfig({ duration: v })}
        />
      )}

      {/* Animation Options */}
      <SelectField
        label="Animation"
        value={toastConfig.animation}
        options={[
          { value: 'slide', label: 'Slide (Position-based)' },
          { value: 'fade', label: 'Fade' },
          { value: 'scale', label: 'Scale' },
          { value: 'bounce', label: 'Bounce' },
          { value: 'none', label: 'None' },
        ]}
        onChange={(v) => updateToastConfig({ animation: v as ToastAnimationType })}
      />
      {/* Stacking Options */}
      <CheckboxField
        label="Stacked Mode"
        checked={toastConfig.stacked}
        onChange={(v) => updateToastConfig({ stacked: v })}
      />
      <RangeField
        label="Max Visible Toasts"
        value={toastConfig.maxVisible}
        min={1}
        max={10}
        step={1}
        onChange={(v) => updateToastConfig({ maxVisible: v })}
      />

      {/* Styling Options */}
      <SelectField
        label="Theme"
        value={toastConfig.theme}
        options={[
          { value: 'colored', label: 'Colored (Variant BG)' },
          { value: 'light', label: 'Light (White BG)' },
          { value: 'dark', label: 'Dark' },
          { value: 'auto', label: 'Auto (System)' },
        ]}
        onChange={(v) => updateToastConfig({ theme: v as ToastThemeType })}
      />
      <CheckboxField
        label="Show Left Border"
        checked={toastConfig.showLeftBorder}
        onChange={(v) => updateToastConfig({ showLeftBorder: v })}
      />

      {/* Progress Bar Options — hidden in persistent mode */}
      {!toastConfig.persistent && (
        <>
          <CheckboxField
            label="Show Progress Bar"
            checked={toastConfig.showProgress}
            onChange={(v) => updateToastConfig({ showProgress: v })}
          />
          {toastConfig.showProgress && (
            <SelectField
              label="Progress Position"
              value={toastConfig.progressPosition}
              options={[
                { value: 'top', label: 'Top' },
                { value: 'bottom', label: 'Bottom' },
              ]}
              onChange={(v) => updateToastConfig({ progressPosition: v as 'top' | 'bottom' })}
            />
          )}
        </>
      )}

      {/* Behavior Options — dismissible/pauseOnHover hidden in persistent mode */}
      {!toastConfig.persistent && (
        <>
          <CheckboxField
            label="Dismissible"
            checked={toastConfig.dismissible}
            onChange={(v) => updateToastConfig({ dismissible: v })}
          />
          <CheckboxField
            label="Pause on Hover"
            checked={toastConfig.pauseOnHover}
            onChange={(v) => updateToastConfig({ pauseOnHover: v })}
          />
        </>
      )}

      <TriggerButton onClick={handleTrigger}>Trigger Toast</TriggerButton>
    </ConfigWrapper>
  );
}
