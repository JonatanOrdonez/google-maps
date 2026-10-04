'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { usePolygons } from '@/context/PolygonsContext';
import { usePoints } from '@/context/PointsContext';
import { PolygonsLayer } from '@/components/PolygonsLayer';
import { PointsLayer } from '@/components/PointsLayer';

// Cali, Colombia
const DEFAULT_CENTER: [number, number] = [3.4516, -76.532];

export default function MapView() {
  const { status: polygonsStatus } = usePolygons();
  const { status: pointsStatus } = usePoints();
  const drawing = polygonsStatus === 'drawing' || pointsStatus === 'drawing';

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={13}
      zoomControl={false}
      className="h-full w-full"
      style={{ cursor: drawing ? 'crosshair' : undefined }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PolygonsLayer />
      <PointsLayer />
    </MapContainer>
  );
}
