import { LatLngExpression } from 'leaflet';

export interface ButtonType {
  width: string;
  text: string;
  onClick?: () => void;
}
export interface GpsPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: boolean;
}

export interface Stop {
  latitude: number;
  longitude: number;
  duration: number; //in seconds
}

export interface Trip {
  user: string;
  name: string;
  gpsData: GpsPoint[];
  distance?: number; //in meters
  duration?: number; //in seconds
  stoppages: Stop[];
  idles: Stop[];
  stopduration?: number; //in seconds
  idleduration?: number; //in seconds
  overspeedduration?: number; //in meters
  overspeeddistance?: number; //in seconds
  overspeeds: LatLngExpression[][];
  tripIndex: number; //user based index
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  tripRoute: LatLngExpression[];
}
