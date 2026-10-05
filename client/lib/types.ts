export interface LatLng {
  lat: number;
  lng: number;
}

export interface Polygon {
  id: string;
  name: string;
  color: string;
  points: LatLng[];
}

export interface Point {
  id: string;
  name: string;
  color: string;
  lat: number;
  lng: number;
}

export interface User {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export type MapMode = 'polygons' | 'points';

export type MapStatus = 'loading' | 'idle' | 'drawing' | 'setting-shape-config';
