import { Pool } from 'pg';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../config/config';

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

export const initDb = async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.polygons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#6366f1',
      geom GEOGRAPHY(POLYGON, 4326) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.points (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#6366f1',
      geom GEOGRAPHY(POINT, 4326) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.user_coords (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      coords GEOGRAPHY(POINT, 4326) NOT NULL
    );
  `);

  await pool.query(`
    INSERT INTO public.user_coords (id, name, coords)
    VALUES (1, 'User 1', ST_SetSRID(ST_MakePoint(-76.53, 3.3416), 4326)::geography)
    ON CONFLICT (id) DO NOTHING;
  `);
};
