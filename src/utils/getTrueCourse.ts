import { Waypoint } from "@/types";
import LatLon from "geodesy/latlon-spherical.js";

export const getTrueCourseDeg = (from: Waypoint, to: Waypoint) => {
  const p1 = new LatLon(from.latlng.lat, from.latlng.lng);
  const p2 = new LatLon(to.latlng.lat, to.latlng.lng);
  return p1.initialBearingTo(p2);
};
