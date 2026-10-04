export interface Point {
  id: string;
  name: string;
  color: string;
  lat: number;
  lng: number;
}

export interface CreatePointDTO {
  name: string;
  color: string;
  lat: number;
  lng: number;
}
