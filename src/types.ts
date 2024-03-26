import { LatLng } from "leaflet";

export interface Airport {
  continent: string | null;
  elevation_ft: string | null;
  gps_code: string | null;
  home_link: string | null;
  iata_code: string | null;
  id: number;
  ident: string | null;
  iso_country: string | null;
  iso_region: string | null;
  keywords: string | null;
  latitude_deg: number | null;
  local_code: string | null;
  longitude_deg: number | null;
  municipality: string | null;
  name: string | null;
  scheduled_service: string | null;
  type: string | null;
  wikipedia_link: string | null;
}

export interface Waypoint {
  id: string;
  name: string;
  latlng: LatLng;
  distanceFromPrev?: number;
  bearingFromPrev?: number;
}