# Maps — Points & Polygons

Mapa a pantalla completa donde se pueden dibujar **polígonos** y **puntos**, y
guardarlos en PostgreSQL/PostGIS (Supabase). Backend en Node.js + TypeScript +
Express. Frontend en Next.js + React-Leaflet.

## Modelo de datos

Las tablas se crean en `server/src/db/db.ts` (requiere la extensión PostGIS).

### `polygons`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` (PK, `gen_random_uuid()`) | Identificador |
| `name` | `TEXT` | Nombre |
| `color` | `TEXT` (default `#6366f1`) | Color hex `#rrggbb` |
| `geom` | `GEOGRAPHY(POLYGON, 4326)` | Geometría |

### `points`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` (PK, `gen_random_uuid()`) | Identificador |
| `name` | `TEXT` | Nombre |
| `color` | `TEXT` (default `#6366f1`) | Color hex `#rrggbb` |
| `geom` | `GEOGRAPHY(POINT, 4326)` | Geometría |

## Server (`server/src/features`)

Arquitectura por capas (`router → controller → service → repository`).

- `POST /api/polygons` — crear (`name`, `color`, `points: [{lat, lng}]`, mínimo 3).
- `GET /api/polygons` — listar.
- `DELETE /api/polygons/:id` — eliminar.
- `POST /api/points` — crear (`name`, `color`, `lat`, `lng`).
- `GET /api/points` — listar.
- `DELETE /api/points/:id` — eliminar.

## Client (`client/`)

- `app/page.tsx` — renderiza `MapScreen`.
- `components/MapScreen.tsx` — monta los dos providers y un selector de modo
  (**Polygons mode** / **Points mode**) sobre el mapa. El selector se bloquea
  mientras se está dibujando o configurando una figura.
- `context/PolygonsContext.tsx` y `context/PointsContext.tsx` — cada uno
  maneja sus datos, su `status` (`loading` | `idle` | `drawing` |
  `setting-shape-config`) y su borrador (`draft`), más guardar y eliminar.
- `components/MapView.tsx` — mapa Leaflet (solo en el browser) que compone
  `PolygonsLayer` y `PointsLayer`; cada capa maneja sus clicks y su dibujo.
- `components/PolygonsToolbar.tsx` / `PointsToolbar.tsx` — acciones de cada modo.
- `components/ShapeConfigModal.tsx` — nombre y color antes de guardar.

Al hacer clic sobre un polígono o punto existente se abre un popup con la
opción de eliminarlo.

## Correr

```bash
cd server && cp .env.example .env && npm install && npm run dev   # :3000
cd client && cp .env.example .env && npm install && npm run dev
```
