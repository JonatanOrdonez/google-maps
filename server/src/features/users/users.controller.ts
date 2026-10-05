import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import { getUserByIdService, updateUserLocationService } from './users.service';

const parseId = (value: unknown): number => {
  const id = Number(value);

  if (!Number.isInteger(id)) {
    throw Boom.badRequest('User id must be an integer');
  }

  return id;
};

export const getUserController = async (req: Request, res: Response) => {
  const user = await getUserByIdService(parseId(req.params.id));
  res.status(200).json(user);
};

export const updateUserLocationController = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const { lat, lng } = req.body;

  if (typeof lat !== 'number' || typeof lng !== 'number' || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw Boom.badRequest('lat and lng must be valid numbers');
  }

  const user = await updateUserLocationService(id, { lat, lng });
  res.status(200).json(user);
};
