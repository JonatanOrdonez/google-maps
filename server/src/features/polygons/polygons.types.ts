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

export interface CreatePolygonDTO {
  name: string;
  color: string;
  points: LatLng[];
}
