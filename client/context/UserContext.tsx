'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/axios';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { LatLng, User } from '@/lib/types';

// There is no auth yet, so the app always acts as this seeded user
export const USER_ID = 1;

const MOVE_DELTA = 0.0005;
const THROTTLE_MS = 500;

// WASD key -> how much the position changes
const KEY_DELTAS: Record<string, LatLng> = {
  w: { lat: MOVE_DELTA, lng: 0 },
  s: { lat: -MOVE_DELTA, lng: 0 },
  a: { lat: 0, lng: -MOVE_DELTA },
  d: { lat: 0, lng: MOVE_DELTA },
};

const getGpsPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true }),
  );

interface UserContextValue {
  // null until the browser grants GPS access and the first position is saved
  user: User | null;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPosition = useRef<LatLng | null>(null);

  // On start: read the GPS position and save it as the user's position
  useEffect(() => {
    let cancelled = false;

    const onInit = async () => {
      try {
        const { coords } = await getGpsPosition();
        const res = await api.patch<User>(`/users/${USER_ID}`, {
          lat: coords.latitude,
          lng: coords.longitude,
        });
        if (!cancelled) setUser(res.data);
      } catch {
        if (!cancelled) showToast('Enable location access to see your position', 'error');
      }
    };

    onInit();

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  // Notifications sent by the server when the user enters a polygon or gets near a point
  useEffect(() => {
    const channel = supabase
      .channel(`user:${USER_ID}`)
      .on('broadcast', { event: 'notification' }, ({ payload }) => {
        showToast((payload as { message: string }).message, 'info');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showToast]);

  // Saves the latest position at most once every THROTTLE_MS
  const savePositionThrottled = useCallback(
    (position: LatLng) => {
      pendingPosition.current = position;
      if (throttleTimer.current) return;

      throttleTimer.current = setTimeout(() => {
        throttleTimer.current = null;
        api.patch(`/users/${USER_ID}`, pendingPosition.current).catch(() => {
          showToast('Could not save your new position', 'error');
        });
      }, THROTTLE_MS);
    },
    [showToast],
  );

  // Move with WASD once the user has a position
  useEffect(() => {
    if (!user) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const delta = KEY_DELTAS[e.key.toLowerCase()];
      const isTyping = (e.target as HTMLElement).closest('input, textarea, select');
      if (!delta || isTyping || e.ctrlKey || e.metaKey || e.altKey) return;

      e.preventDefault();
      const next = { ...user, lat: user.lat + delta.lat, lng: user.lng + delta.lng };
      setUser(next);
      savePositionThrottled({ lat: next.lat, lng: next.lng });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [user, savePositionThrottled]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
