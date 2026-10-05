import { pool } from '../../db/db';
import { UpdateUserLocationDTO, User } from './users.types';

const USER_COLUMNS = 'id, name, ST_Y(coords::geometry) AS lat, ST_X(coords::geometry) AS lng';

export const getUserByIdRepository = async (id: number): Promise<User | null> => {
  const result = await pool.query<User>(`SELECT ${USER_COLUMNS} FROM public.user_coords WHERE id = $1`, [id]);

  return result.rows[0] ?? null;
};

export const updateUserLocationRepository = async (
  id: number,
  { lat, lng }: UpdateUserLocationDTO,
): Promise<User | null> => {
  const result = await pool.query<User>(
    `UPDATE public.user_coords
     SET coords = ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography
     WHERE id = $1
     RETURNING ${USER_COLUMNS}`,
    [id, lng, lat],
  );

  return result.rows[0] ?? null;
};
