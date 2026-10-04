import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import {
  createPolygonService,
  deletePolygonService,
  getPolygonsService,
} from './polygons.service';

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export const createPolygonController = async (req: Request, res: Response) => {
  const { name, color, points } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    throw Boom.badRequest('Name is required');
  }

  if (typeof color !== 'string' || !HEX_COLOR.test(color)) {
    throw Boom.badRequest('Color must be a valid hex color (#rrggbb)');
  }

  if (!Array.isArray(points) || points.length < 3) {
    throw Boom.badRequest('At least 3 points are required');
  }

  const validPoints = points.every(
    (p) =>
      typeof p?.lat === 'number' &&
      typeof p?.lng === 'number' &&
      Math.abs(p.lat) <= 90 &&
      Math.abs(p.lng) <= 180,
  );

  if (!validPoints) {
    throw Boom.badRequest('Each point must have a valid lat and lng');
  }

  const newPolygon = await createPolygonService({ name: name.trim(), color, points });

  res.status(201).json(newPolygon);
};

export const getPolygonsController = async (req: Request, res: Response) => {
  const polygons = await getPolygonsService();
  res.status(200).json(polygons);
};

export const deletePolygonController = async (req: Request, res: Response) => {
  await deletePolygonService(String(req.params.id));
  res.status(204).send();
};
