'use client';

import { usePoints } from '@/context/PointsContext';
import { toolbarButton as btn } from '@/components/toolbarStyles';

export const PointsToolbar = () => {
  const { status, setStatus } = usePoints();

  if (status === 'loading') {
    return <span className="text-sm text-neutral-600">Loading...</span>;
  }

  if (status === 'idle') {
    return (
      <button className={`${btn} bg-indigo-600 text-white border-indigo-600`} onClick={() => setStatus('drawing')}>
        Add point
      </button>
    );
  }

  if (status === 'drawing') {
    return (
      <>
        <span className="text-sm text-neutral-600">Click on the map to place the point</span>
        <button className={`${btn} bg-rose-500 text-white border-rose-500`} onClick={() => setStatus('idle')}>
          Cancel
        </button>
      </>
    );
  }

  return null;
};
