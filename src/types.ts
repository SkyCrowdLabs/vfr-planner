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
  id?: number | undefined | null;
  name?: string | undefined | null;
  departure?: Airport | undefined;
  destination?: Airport | undefined;
  waypoints: Waypoint[];
  created_at?: string;
}

export interface Aircraft {
  bew: number | null;
  bew_cg: number | null;
  cg_limit_aft: number | null;
  cg_limit_fwd: number | null;
  climb_ff: number | null;
  climb_ias: number | null;
  climb_vs: number | null;
  created_at: string;
  cruise_ff: number | null;
  cruise_ias: number | null;
  descent_ff: number | null;
  descent_ias: number | null;
  descent_vs: number | null;
  engine: string | null;
  engine_hp: number | null;
  equipment: string | null;
  id: string;
  manufacturer: string | null;
  model: string | null;
  tail_num: string | null;
  transponder: string | null;
  type: string | null;
  user_id: string | null;
}
