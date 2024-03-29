"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Marker } from "react-leaflet";
import { GeocodingResponse, Waypoint } from "@/types";
import { useRouteStore } from "@/store/store";
import useSWR from "swr";
import { LatLng } from "leaflet";
import { fetcher } from "@/utils/fetcher";

interface WaypointMarkerProps {
  waypoint: Waypoint;
}

const WaypointMarker: React.FC<WaypointMarkerProps> = ({ waypoint }) => {
  const editWaypoint = useRouteStore((state) => state.editWaypoint);
  const setIsMapBusy = useRouteStore((state) => state.setIsMapBusy);
  const markerRef = useRef(null);
  const [latlng, setLatlng] = useState<LatLng | undefined>(undefined);
  const { data, isLoading } = useSWR<GeocodingResponse>(
    latlng ? `/geocoding?lat=${latlng.lat}&lng=${latlng.lng}` : null,
    fetcher
  );

  useEffect(() => {
    if (latlng && data) {
      editWaypoint(waypoint.id, {
        ...waypoint,
        latlng,
        name: data.data.name || "Unnamed",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    if (latlng) setIsMapBusy(isLoading);
  }, [isLoading, latlng, setIsMapBusy]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        if (marker != null) {
          setLatlng(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <Marker
      draggable={
        !waypoint.id.includes("departure") &&
        !waypoint.id.includes("destination")
      }
      eventHandlers={eventHandlers}
      position={waypoint.latlng}
      ref={markerRef}
    />
  );
};

export default WaypointMarker;
