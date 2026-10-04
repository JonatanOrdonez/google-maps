'use client';

import { MapMode } from '@/lib/types';

const MODES: { value: MapMode; label: string }[] = [
  { value: 'polygons', label: 'Polygons mode' },
  { value: 'points', label: 'Points mode' },
];

interface ModeSelectorProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
  disabled: boolean;
}

export const ModeSelector = ({ mode, onChange, disabled }: ModeSelectorProps) => (
  <div className="flex rounded-lg bg-neutral-200 p-1">
    {MODES.map(({ value, label }) => (
      <button
        key={value}
        disabled={disabled}
        onClick={() => onChange(value)}
        className={`rounded-md px-3 py-1 text-sm font-medium disabled:cursor-not-allowed ${
          mode === value ? 'bg-white shadow-sm' : 'text-neutral-500'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
