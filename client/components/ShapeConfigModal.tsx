'use client';

import { useState } from 'react';
import { usePolygons } from '@/context/PolygonsContext';
import { usePoints } from '@/context/PointsContext';

const DEFAULT_COLOR = '#6366f1';

interface ShapeConfigModalProps {
  title: string;
  onSave: (name: string, color: string) => Promise<void>;
  onCancel: () => void;
}

const ShapeConfigModal = ({ title, onSave, onCancel }: ShapeConfigModalProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError('');
    try {
      await onSave(name.trim(), color);
    } catch {
      setError('Could not save, please try again');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 text-neutral-900 shadow-xl mx-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <input
          autoFocus
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="flex items-center gap-3 text-sm">
          Color
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <span className="font-mono text-neutral-500">{color}</span>
        </label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <div className="flex gap-2">
          <button type="button" className="flex-1 border rounded px-3 py-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex-1 rounded bg-indigo-600 px-3 py-2 text-white disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const PolygonConfigModal = () => {
  const { status, setStatus, draft, savePolygon } = usePolygons();

  if (status !== 'setting-shape-config') return null;

  return (
    <ShapeConfigModal
      title={`Save polygon (${draft.length} vertices)`}
      onSave={savePolygon}
      onCancel={() => setStatus('idle')}
    />
  );
};

export const PointConfigModal = () => {
  const { status, setStatus, savePoint } = usePoints();

  if (status !== 'setting-shape-config') return null;

  return (
    <ShapeConfigModal
      title="Save point"
      onSave={savePoint}
      onCancel={() => setStatus('idle')}
    />
  );
};
