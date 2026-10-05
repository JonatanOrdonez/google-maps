import Boom from '@hapi/boom';
import {
  createPointRepository,
  deletePointRepository,
  getPointNearUserRepository,
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

export const getPointNearUserService = async (userId: number, meters: number): Promise<Point | null> => {
  return getPointNearUserRepository(userId, meters);
};
