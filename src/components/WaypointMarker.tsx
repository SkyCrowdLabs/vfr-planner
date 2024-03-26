"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Marker } from "react-leaflet";
import { GeocodingResponse, Waypoint } from "@/types";
import { useRouteStore } from "@/store/store";
import useSWR from "swr";
import { LatLng } from "leaflet";
import { fetcher } from "@/utils/fetcher";
import { getDistanceNm } from "@/utils/getDistanceNm";
import { getTrueCourseDeg } from "@/utils/getTrueCourse";

interface WaypointMarkerProps {
  waypoint: Waypoint;
}

const WaypointMarker: React.FC<WaypointMarkerProps> = ({ waypoint }) => {
  const waypoints = useRouteStore((state) => state.waypoints);
  const editWaypoint = useRouteStore((state) => state.editWaypoint);
  const markerRef = useRef(null);
  const [latlng, setLatlng] = useState<LatLng | undefined>(undefined);
  const { data } = useSWR<GeocodingResponse>(
    latlng ? `/geocoding?lat=${latlng.lat}&lng=${latlng.lng}` : null,
    fetcher
  );

  useEffect(() => {
    if (latlng) {
      const waypointId = waypoints.findIndex((w) => w.id === waypoint.id);
      const prevWaypoint = waypoints[waypointId - 1];
      const nextWaypoint = waypoints[waypointId + 1];
      editWaypoint(waypoint.id, {
        ...waypoint,
        latlng,
        name: data?.data.name,
        distanceFromPrev: getDistanceNm(prevWaypoint, waypoint),
        bearingFromPrev: getTrueCourseDeg(prevWaypoint, waypoint),
      });
      editWaypoint(nextWaypoint.id, {
        ...nextWaypoint,
        distanceFromPrev: getDistanceNm(waypoint, nextWaypoint),
        bearingFromPrev: getTrueCourseDeg(waypoint, nextWaypoint),
      });
    }
  }, [data]);

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
