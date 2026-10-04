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
};
