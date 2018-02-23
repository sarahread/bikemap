export interface LatLngQuery {
  query: string,
  lat: number,
  lng: number
}

export interface Trip {
  _id?: string;
  start: LatLngQuery;
  end: LatLngQuery;
  path?: any[];
  progress?: number[];
  totalDistance?: number;
}

export const NewTrip = {
  start: {
    query: '',
    lat: null,
    lng: null
  },
  end: {
    query: '',
    lat: null,
    lng: null
  },
  path: null,
  totalDistance: 0
};