'use client';

import { usePolygons } from '@/context/PolygonsContext';
import { toolbarButton as btn } from '@/components/toolbarStyles';

export const PolygonsToolbar = () => {
  const { status, setStatus, draft, setDraft } = usePolygons();

  if (status === 'loading') {
    return <span className="text-sm text-neutral-600">Loading...</span>;
  }

  if (status === 'idle') {
    return (
      <button className={`${btn} bg-indigo-600 text-white border-indigo-600`} onClick={() => setStatus('drawing')}>
        Draw polygon
      </button>
    );
  }

  if (status === 'drawing') {
    return (
      <>
        <span className="text-sm text-neutral-600">
          {draft.length === 0
            ? 'Click on the map to add vertices'
            : `${draft.length} vertex${draft.length > 1 ? 'es' : ''}`}
        </span>
        <button
          className={`${btn} bg-white`}
          onClick={() => setDraft((prev) => prev.slice(0, -1))}
          disabled={draft.length === 0}
        >
          Undo
        </button>
        <button
          className={`${btn} bg-indigo-600 text-white border-indigo-600`}
          onClick={() => setStatus('setting-shape-config')}
          disabled={draft.length < 3}
        >
          Finish
        </button>
        <button className={`${btn} bg-rose-500 text-white border-rose-500`} onClick={() => setStatus('idle')}>
          Cancel
        </button>
      </>
    );
  }

  return null;
};
