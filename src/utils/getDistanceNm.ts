import { Airport, Waypoint } from "@/types";
import { LatLng } from "leaflet";

export function getDistanceFromAirportToWaypoint(f: Airport, t: LatLng) {
  const p1 = new LatLng(f.latitude_deg as number, f.longitude_deg as number);
  return getDistanceNm(p1, t);
}

export function getDistanceFromWaypointToAirport(f: LatLng, t: Airport) {
  const p2 = new LatLng(t.latitude_deg as number, t.longitude_deg as number);
  return getDistanceNm(f, p2);
}

export function getDistanceNm(p1: LatLng, p2: LatLng): number {
  const np1 = new LatLng(p1.lat, p1.lng);
  const np2 = new LatLng(p2.lat, p2.lng);
  return np1.distanceTo(np2) / 1852;
}
