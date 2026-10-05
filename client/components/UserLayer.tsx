'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Marker, Popup, useMap } from 'react-leaflet';
import { useUser } from '@/context/UserContext';

const USER_COLOR = '#2563EB';

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;border-radius:50%;background:${USER_COLOR};border:3px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,.25),0 1px 6px rgba(0,0,0,.45)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

export const UserLayer = () => {
  const { user } = useUser();
  const map = useMap();
  const centered = useRef(false);

  // Center on the user once, when the first location arrives
  useEffect(() => {
    if (!user || centered.current) return;
    centered.current = true;
    map.flyTo([user.lat, user.lng], map.getZoom());
  }, [user, map]);

  if (!user) return null;

  return (
    <Marker position={[user.lat, user.lng]} icon={userIcon}>
      <Popup>
        <strong>{user.name}</strong>
      </Popup>
    </Marker>
  );
};
