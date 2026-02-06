import React from 'react';

/**
 * Shared form field components for playground config panels.
 */

export function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}): React.ReactElement {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full px-3 py-2 bg-background border rounded-md text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}): React.ReactElement {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        className="w-full px-3 py-2 bg-background border rounded-md text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}): React.ReactElement {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}: <span className="text-muted-foreground">{value}{unit}</span>
      </label>
      <input
        className="w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}): React.ReactElement {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

/**
 * Wrapper component for config panels with consistent styling.
 */
export function ConfigWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="p-4 bg-card border rounded-lg">
      <h3 className="text-sm font-medium mb-4">Configuration</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Standard trigger button for config panels.
 */
export function TriggerButton({
  onClick,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <button
      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
