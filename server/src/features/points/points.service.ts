import Boom from '@hapi/boom';
import {
  createPointRepository,
  deletePointRepository,
  getPointsRepository,
} from './points.repository';
import { CreatePointDTO, Point } from './points.types';

export const createPointService = async (point: CreatePointDTO): Promise<Point> => {
  return createPointRepository(point);
};

export const getPointsService = async (): Promise<Point[]> => {
  return getPointsRepository();
};

export const deletePointService = async (id: string): Promise<void> => {
  const deleted = await deletePointRepository(id);

  if (!deleted) {
    throw Boom.notFound('Point not found');
  }
};
