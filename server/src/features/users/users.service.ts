import Boom from '@hapi/boom';
import { getPolygonIntersectingUserRepository } from '../polygons/polygons.repository';
import { getPointNearUserRepository } from '../points/points.repository';
import { getUserByIdRepository, updateUserLocationRepository } from './users.repository';
import { UpdateUserLocationDTO, User } from './users.types';
import { supabase } from '../../config/supabase';
import { Polygon } from '../polygons/polygons.types';
import { Point } from '../points/points.types';

const NEAR_POINT_METERS = 50;

const NOTIFY_TTL_MS = 10_000;

// Mini cache with TTL: key -> time until which the same notification is not repeated
const notifiedUntil = new Map<string, number>();

export const broadcastToUser = async (userId: number, message: string): Promise<void> => {
  const channel = supabase.channel(`user:${userId}`);

  try {
    await channel.httpSend('notification', { message });
  } catch (error) {
    // A failed notification must not fail the location update
    console.error('Could not broadcast to user', userId, error);
  } finally {
    await supabase.removeChannel(channel);
  }
};


const notifyOnEnter = async (userId: number, kind: 'polygon' | 'point', target: Polygon | Point | null) => {
  if (!target) return;

  const key = `${userId}:${kind}:${target.id}`;
  const now = Date.now();

  if ((notifiedUntil.get(key) ?? 0) > now) return;
  notifiedUntil.set(key, now + NOTIFY_TTL_MS);

  await broadcastToUser(userId, `You are ${kind === 'polygon' ? 'inside' : 'near'} ${kind} "${target.name}"`);
};

export const getUserByIdService = async (id: number): Promise<User> => {
  const user = await getUserByIdRepository(id);

  if (!user) {
    throw Boom.notFound('User not found');
  }

  return user;
};

export const updateUserLocationService = async (
  id: number,
  location: UpdateUserLocationDTO,
): Promise<User> => {
  const user = await updateUserLocationRepository(id, location);

  if (!user) {
    throw Boom.notFound('User not found');
  }

  const polygon = await getPolygonIntersectingUserRepository(id);
  const nearPoint = await getPointNearUserRepository(id, NEAR_POINT_METERS);

  await notifyOnEnter(id, 'polygon', polygon);
  await notifyOnEnter(id, 'point', nearPoint);

  return user;
};
