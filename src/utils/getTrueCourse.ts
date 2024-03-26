import { Airport, Waypoint } from "@/types";
import LatLon from "geodesy/latlon-spherical.js";
import { LatLng } from "leaflet";

export function getTrueCourseDegFromAirportToWaypoint(f: Airport, t: LatLng) {
  const p1 = new LatLon(f.latitude_deg as number, f.longitude_deg as number);
  const p2 = new LatLon(t.lat, t.lng);
  return getTrueCourseDeg(p1, p2);
}

export function getTrueCourseDegFromWaypointToAirport(f: LatLng, t: Airport) {
  const p1 = new LatLon(f.lat, f.lng);
  const p2 = new LatLon(t.latitude_deg as number, t.longitude_deg as number);
  return getTrueCourseDeg(p1, p2);
}

export function getTrueCourseDegFromWaypointToWaypoint(f: LatLng, t: LatLng) {
  const p1 = new LatLon(f.lat, f.lng);
  const p2 = new LatLon(t.lat, t.lng);
  return getTrueCourseDeg(p1, p2);
}

export const getTrueCourseDeg = (p1: LatLon, p2: LatLon) => {
  return p1.initialBearingTo(p2);
};
