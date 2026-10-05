import { Polygon } from '../polygons/polygons.types';

export interface User {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface UpdateUserLocationDTO {
  lat: number;
  lng: number;
}