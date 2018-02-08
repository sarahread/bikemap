export interface LatLng {
  lat: number,
  lng: number
}

export interface Trip {
  id?: string;
  start: { query: string, lat?: number, lng?: number };
  end: { query: string, lat?: number, lng?: number };
  path?: any;
  finishedPath?: any;
  distanceTravelled?: number;
  totalDistance?: number;
}