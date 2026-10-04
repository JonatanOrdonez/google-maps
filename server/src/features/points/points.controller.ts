import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import { createPointService, deletePointService, getPointsService } from './points.service';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export const createPointController = async (req: Request, res: Response) => {
  const { name, color, lat, lng } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    throw Boom.badRequest('Name is required');
  }

  if (typeof color !== 'string' || !HEX_COLOR.test(color)) {
    throw Boom.badRequest('Color must be a valid hex color (#rrggbb)');
  }

  if (typeof lat !== 'number' || typeof lng !== 'number' || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw Boom.badRequest('lat and lng must be valid numbers');
  }

  const newPoint = await createPointService({ name: name.trim(), color, lat, lng });

  res.status(201).json(newPoint);
};

export const getPointsController = async (req: Request, res: Response) => {
  const points = await getPointsService();
  res.status(200).json(points);
};

export const deletePointController = async (req: Request, res: Response) => {
  await deletePointService(String(req.params.id));
  res.status(204).send();
};
