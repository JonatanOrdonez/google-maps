'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { LatLng, MapStatus, Point } from '@/lib/types';

interface PointsContextValue {
  status: MapStatus;
  // Moving to any status other than 'setting-shape-config' clears the draft
  setStatus: (status: MapStatus) => void;
  points: Point[];
  draft: LatLng | null;
  setDraft: (draft: LatLng | null) => void;
  savePoint: (name: string, color: string) => Promise<void>;
  deletePoint: (id: string) => Promise<void>;
}

const PointsContext = createContext<PointsContextValue | null>(null);

export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatusState] = useState<MapStatus>('loading');
  const [points, setPoints] = useState<Point[]>([]);
  const [draft, setDraft] = useState<LatLng | null>(null);

  useEffect(() => {
    const onInit = async () => {
      try {
        const res = await api.get<Point[]>('/points');
        setPoints(res.data);
      } finally {
        setStatusState('idle');
      }
    };

    onInit();
  }, []);

  const setStatus = (newStatus: MapStatus) => {
    if (newStatus !== 'setting-shape-config') {
      setDraft(null);
    }
    setStatusState(newStatus);
  };

  const savePoint = async (name: string, color: string) => {
    if (!draft) return;

    const res = await api.post<Point>('/points', { name, color, ...draft });
    setPoints((prev) => [...prev, res.data]);
    setStatus('idle');
  };

  const deletePoint = async (id: string) => {
    await api.delete(`/points/${id}`);
    setPoints((prev) => prev.filter((point) => point.id !== id));
  };

  return (
    <PointsContext.Provider
      value={{ status, setStatus, points, draft, setDraft, savePoint, deletePoint }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);

  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }

  return context;
};
