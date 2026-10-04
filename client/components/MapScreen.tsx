'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PolygonsProvider, usePolygons } from '@/context/PolygonsContext';
import { PointsProvider, usePoints } from '@/context/PointsContext';
import { MapMode } from '@/lib/types';
import { ModeSelector } from '@/components/ModeSelector';
import { PolygonsToolbar } from '@/components/PolygonsToolbar';
import { PointsToolbar } from '@/components/PointsToolbar';
import { PointConfigModal, PolygonConfigModal } from '@/components/ShapeConfigModal';

// Leaflet touches `window`, so the map must only render in the browser
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const MapContent = () => {
  const [mode, setMode] = useState<MapMode>('polygons');
  const { status: polygonsStatus } = usePolygons();
  const { status: pointsStatus } = usePoints();

  // Switching modes is only allowed when neither mode is mid-action
  const canSwitchMode = polygonsStatus === 'idle' && pointsStatus === 'idle';

  return (
    <div className="relative h-screen w-screen">
      <MapView />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-2">
        <div className="rounded-xl bg-white/95 p-2 shadow-lg text-neutral-900">
          <ModeSelector mode={mode} onChange={setMode} disabled={!canSwitchMode} />
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg text-neutral-900">
          {mode === 'polygons' ? <PolygonsToolbar /> : <PointsToolbar />}
        </div>
      </div>
      <PolygonConfigModal />
      <PointConfigModal />
    </div>
  );
};

export const MapScreen = () => (
  <PolygonsProvider>
    <PointsProvider>
      <MapContent />
    </PointsProvider>
  </PolygonsProvider>
);
