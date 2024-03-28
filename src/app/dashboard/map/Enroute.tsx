import { useRouteStore } from "@/store/store";
import { GeocodingResponse, Waypoint } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { LatLng, LeafletMouseEvent } from "leaflet";
import randomColor from "randomcolor";
import React, { useEffect, useMemo, useState } from "react";
import { Polyline } from "react-leaflet";
import useSWR from "swr";

interface EnrouteProps {}

const Enroute: React.FC<EnrouteProps> = () => {
  const [latlng, setLatlng] = useState<LatLng | undefined>(undefined);
  const [fromLatlng, setFromLatlng] = useState<LatLng | undefined>(undefined);
  const waypoints = useRouteStore((state) => state.waypoints);
  const linePositions = waypoints.reduce((acc, { latlng }, i) => {
    if (i === 0) return acc;
    return [...acc, [latlng, waypoints[i - 1].latlng]];
  }, [] as { lat: number; lng: number }[][]);
  const addWaypoint = useRouteStore((state) => state.addWaypoint);
  const setIsMapBusy = useRouteStore((state) => state.setIsMapBusy);
  const { data, isLoading } = useSWR<GeocodingResponse>(
    latlng ? `/geocoding?lat=${latlng.lat}&lng=${latlng.lng}` : null,
    fetcher
  );

  useEffect(() => {
    if (latlng && fromLatlng && data) {
      const fromWaypointIndex = waypoints.findIndex((waypoint) =>
        fromLatlng.equals(waypoint.latlng)
      );
      if (fromWaypointIndex < 0) return;
      const newWaypoint: Waypoint = {
        id: `waypoint-${waypoints.length + 1}`,
        name: data.data.name,
        latlng,
      };
      addWaypoint(newWaypoint, fromWaypointIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    setIsMapBusy(isLoading);
  }, [isLoading, setIsMapBusy]);

  const eventHandlers = useMemo(
    () => ({
      mousedown(e: LeafletMouseEvent) {
        setLatlng(e.latlng.wrap() as LatLng);
        setFromLatlng(e.target._latlngs[0].wrap() as LatLng);
      },
    }),
    []
  );
  return linePositions.map((linePosition) => (
    <Polyline
      weight={6}
      color={randomColor()}
      key={`route-${linePosition[0].lat.toFixed(2)}`}
      eventHandlers={eventHandlers}
      positions={linePosition}
    />
  ));
};

export default Enroute;
