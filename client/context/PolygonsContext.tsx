'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { LatLng, MapStatus, Polygon } from '@/lib/types';

interface PolygonsContextValue {
  status: MapStatus;
  // Moving to any status other than 'setting-shape-config' clears the draft
  setStatus: (status: MapStatus) => void;
  polygons: Polygon[];
  draft: LatLng[];
  setDraft: React.Dispatch<React.SetStateAction<LatLng[]>>;
  savePolygon: (name: string, color: string) => Promise<void>;
  deletePolygon: (id: string) => Promise<void>;
}

const PolygonsContext = createContext<PolygonsContextValue | null>(null);

export const PolygonsProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatusState] = useState<MapStatus>('loading');
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [draft, setDraft] = useState<LatLng[]>([]);

  useEffect(() => {
    const onInit = async () => {
      try {
        const res = await api.get<Polygon[]>('/polygons');
        setPolygons(res.data);
      } finally {
        setStatusState('idle');
      }
    };

    onInit();
  }, []);

  const setStatus = (newStatus: MapStatus) => {
    if (newStatus !== 'setting-shape-config') {
      setDraft([]);
    }
    setStatusState(newStatus);
  };

  const savePolygon = async (name: string, color: string) => {
    const res = await api.post<Polygon>('/polygons', { name, color, points: draft });
    setPolygons((prev) => [...prev, res.data]);
    setStatus('idle');
  };

  const deletePolygon = async (id: string) => {
    await api.delete(`/polygons/${id}`);
    setPolygons((prev) => prev.filter((polygon) => polygon.id !== id));
  };

  return (
    <PolygonsContext.Provider
      value={{ status, setStatus, polygons, draft, setDraft, savePolygon, deletePolygon }}
    >
      {children}
    </PolygonsContext.Provider>
  );
};

export const usePolygons = () => {
  const context = useContext(PolygonsContext);

  if (!context) {
    throw new Error('usePolygons must be used within a PolygonsProvider');
  }

  return context;
};
