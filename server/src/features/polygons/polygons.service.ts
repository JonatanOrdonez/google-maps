import Boom from '@hapi/boom';
import {
  createPolygonRepository,
  deletePolygonRepository,
  getPolygonsRepository,
} from './polygons.repository';
import { CreatePolygonDTO, Polygon } from './polygons.types';

export const createPolygonService = async (polygon: CreatePolygonDTO): Promise<Polygon> => {
  return createPolygonRepository(polygon);
};

export const getPolygonsService = async (): Promise<Polygon[]> => {
  return getPolygonsRepository();
};

export const deletePolygonService = async (id: string): Promise<void> => {
  const deleted = await deletePolygonRepository(id);

  if (!deleted) {
    throw Boom.notFound('Polygon not found');
  }
};
