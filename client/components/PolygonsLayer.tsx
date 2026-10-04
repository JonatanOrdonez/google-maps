'use client';

import { CircleMarker, Polygon, Polyline, Popup, useMapEvents } from 'react-leaflet';
import { usePolygons } from '@/context/PolygonsContext';
import { PopupDeleteButton } from '@/components/PopupDeleteButton';

const DRAFT_COLOR = '#F43F5E';

const toPositions = (points: { lat: number; lng: number }[]) =>
  points.map((p) => [p.lat, p.lng] as [number, number]);

export const PolygonsLayer = () => {
  const { status, setDraft, polygons, draft, deletePolygon } = usePolygons();

  useMapEvents({
    click(e) {
      if (status !== 'drawing') return;
      setDraft((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
    },
  });

  const configuring = status === 'setting-shape-config';

  return (
    <>
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={toPositions(polygon.points)}
          pathOptions={{ color: polygon.color, fillColor: polygon.color, fillOpacity: 0.2, weight: 2 }}
        >
          <Popup>
            <strong>{polygon.name}</strong>
            <br />
            <PopupDeleteButton onClick={() => deletePolygon(polygon.id)} />
          </Popup>
        </Polygon>
      ))}

      {draft.length === 2 && (
        <Polyline
          positions={toPositions(draft)}
          pathOptions={{ color: DRAFT_COLOR, dashArray: '6, 10', weight: 2 }}
        />
      )}
      {draft.length >= 3 && (
        <Polygon
          positions={toPositions(draft)}
          pathOptions={{
            color: DRAFT_COLOR,
            fillColor: DRAFT_COLOR,
            fillOpacity: configuring ? 0.2 : 0.12,
            dashArray: configuring ? undefined : '6, 10',
            weight: 2,
          }}
        />
      )}
      {!configuring &&
        draft.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lng]}
            radius={6}
            pathOptions={{ color: '#fff', weight: 2, fillColor: DRAFT_COLOR, fillOpacity: 1 }}
          />
        ))}
    </>
  );
};
