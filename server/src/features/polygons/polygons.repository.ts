import { pool } from '../../db/db';
import { CreatePolygonDTO, LatLng, Polygon } from './polygons.types';

interface PolygonRow {
  id: string;
  name: string;
  color: string;
  geojson: string;
}

// GeoJSON rings are [lng, lat] and must be closed (first point repeated at the end)
const pointsToGeoJSON = (points: LatLng[]): string => {
  const ring = [...points, points[0]].map((p) => [p.lng, p.lat]);

  return JSON.stringify({ type: 'Polygon', coordinates: [ring] });
};

const rowToPolygon = (row: PolygonRow): Polygon => {
  const ring: number[][] = JSON.parse(row.geojson).coordinates[0];

  return {
    id: row.id,
    name: row.name,
    color: row.color,
    points: ring.slice(0, -1).map(([lng, lat]) => ({ lat, lng })),
  };
};

export const createPolygonRepository = async (polygon: CreatePolygonDTO): Promise<Polygon> => {
  const result = await pool.query<PolygonRow>(
    `INSERT INTO public.polygons (name, color, geom)
     VALUES ($1, $2, ST_GeomFromGeoJSON($3))
     RETURNING id, name, color, ST_AsGeoJSON(geom) AS geojson`,
    [polygon.name, polygon.color, pointsToGeoJSON(polygon.points)],
  );

  return rowToPolygon(result.rows[0]);
};

export const getPolygonsRepository = async (): Promise<Polygon[]> => {
  const result = await pool.query<PolygonRow>(
    'SELECT id, name, color, ST_AsGeoJSON(geom) AS geojson FROM public.polygons',
  );

  return result.rows.map(rowToPolygon);
};

export const deletePolygonRepository = async (id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM public.polygons WHERE id = $1', [id]);

  return (result.rowCount ?? 0) > 0;
};
