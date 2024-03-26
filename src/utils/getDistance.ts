import { Waypoint } from "@/types";

export const getDistanceNm = (from: Waypoint, to: Waypoint) =>
  from.latlng.distanceTo(to.latlng) / 1852;
