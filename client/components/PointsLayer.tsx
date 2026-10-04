'use client';

import L from 'leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { usePoints } from '@/context/PointsContext';
import { PopupDeleteButton } from '@/components/PopupDeleteButton';

const DRAFT_COLOR = '#F43F5E';

// A colored dot instead of the default marker image (avoids bundler asset issues)
const dotIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.45)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });

export const PointsLayer = () => {
  const { status, setStatus, setDraft, points, draft, deletePoint } = usePoints();

  useMapEvents({
    click(e) {
      if (status !== 'drawing') return;
      setDraft({ lat: e.latlng.lat, lng: e.latlng.lng });
      setStatus('setting-shape-config');
    },
  });

  return (
    <>
      {points.map((point) => (
        <Marker key={point.id} position={[point.lat, point.lng]} icon={dotIcon(point.color)}>
          <Popup>
            <strong>{point.name}</strong>
            <br />
            <PopupDeleteButton onClick={() => deletePoint(point.id)} />
          </Popup>
        </Marker>
      ))}

      {draft && <Marker position={[draft.lat, draft.lng]} icon={dotIcon(DRAFT_COLOR)} />}
    </>
  );
};
