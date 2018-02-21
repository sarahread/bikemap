export interface LatLngQuery {
  query: string,
  lat: number,
  lng: number
}

export interface Trip {
  id?: string;
  start: LatLngQuery;
  end: LatLngQuery;
  path?: any[];
  progress?: number[];
  totalDistance?: number;
}