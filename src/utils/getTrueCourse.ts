import { Waypoint } from "@/types";
import LatLon from "geodesy/latlon-spherical.js";

export function getTrueCourseDeg(f: Waypoint, t: Waypoint) {
  const p1 = new LatLon(f.latlng.lat, f.latlng.lng);
  const p2 = new LatLon(t.latlng.lat, t.latlng.lng);
  return p1.initialBearingTo(p2);
}
