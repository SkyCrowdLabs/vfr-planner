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
  latlng: {
    lat: number;
    lng: number;
  };
  distanceFromPrev?: number;
  bearingFromPrev?: number;
}

export interface GeocodingResponse {
  message: string;
  data: {
    elevation: string;
    city: string;
    name: string;
    prov: string;
    region: string;
    state: string;
  };
}

export interface Route {
  id?: string | undefined;
  name?: string | undefined;
  departure?: Airport | undefined;
  destination?: Airport | undefined;
  waypoints: Waypoint[];
  created_at?: string;
}
