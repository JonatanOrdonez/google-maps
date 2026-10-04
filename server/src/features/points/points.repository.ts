import { pool } from '../../db/db';
import { CreatePointDTO, Point } from './points.types';

const POINT_COLUMNS = 'id, name, color, ST_Y(geom::geometry) AS lat, ST_X(geom::geometry) AS lng';

export const createPointRepository = async (point: CreatePointDTO): Promise<Point> => {
  const result = await pool.query<Point>(
    `INSERT INTO public.points (name, color, geom)
     VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography)
     RETURNING ${POINT_COLUMNS}`,
    [point.name, point.color, point.lng, point.lat],
  );

  return result.rows[0];
};

export const getPointsRepository = async (): Promise<Point[]> => {
  const result = await pool.query<Point>(`SELECT ${POINT_COLUMNS} FROM public.points`);

  return result.rows;
};

export const deletePointRepository = async (id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM public.points WHERE id = $1', [id]);

  return (result.rowCount ?? 0) > 0;
};
