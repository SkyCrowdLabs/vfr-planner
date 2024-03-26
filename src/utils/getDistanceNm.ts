import { Waypoint } from "@/types";
import { LatLng } from "leaflet";

export function getDistanceNm(p1: Waypoint, p2: Waypoint): number {
  const np1 = new LatLng(p1.latlng.lat, p1.latlng.lng);
  const np2 = new LatLng(p2.latlng.lat, p2.latlng.lng);
  return np1.distanceTo(np2) / 1852;
}
