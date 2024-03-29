import { useRouteStore } from "@/store/store";
import { GeocodingResponse, Waypoint } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { LatLng, LeafletMouseEvent, latLngBounds } from "leaflet";
import randomColor from "randomcolor";
import React, { useEffect, useMemo, useState } from "react";
import { Polyline, useMap } from "react-leaflet";
import useSWR from "swr";

interface EnrouteProps {}

const Enroute: React.FC<EnrouteProps> = () => {
  const map = useMap();
  const [latlng, setLatlng] = useState<LatLng | undefined>(undefined);
  const [fromLatlng, setFromLatlng] = useState<LatLng | undefined>(undefined);
  const waypoints = useRouteStore((state) => state.waypoints);
  const id = useRouteStore((state) => state.id);
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
    if (waypoints.length > 0) {
      const bounds = latLngBounds([
        waypoints[0].latlng,
        waypoints[waypoints.length - 1].latlng,
      ]);
      map.fitBounds(bounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    if (latlng) setIsMapBusy(isLoading);
  }, [isLoading, latlng, setIsMapBusy]);

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
