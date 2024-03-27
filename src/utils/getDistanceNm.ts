import { Waypoint } from "@/types";
import LatLon from "geodesy/latlon-spherical.js";

export function getDistanceNm(f: Waypoint, t: Waypoint): number {
  const p1 = new LatLon(f.latlng.lat, f.latlng.lng);
  const p2 = new LatLon(t.latlng.lat, t.latlng.lng);
  return p1.distanceTo(p2) * LatLon.metresToNauticalMiles;
}
