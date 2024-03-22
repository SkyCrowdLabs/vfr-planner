"use client";

import dynamic from "next/dynamic";
import { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";
import WaypointList from "./WaypointList";
import clsx from "clsx";
import LatLon from "geodesy/latlon-spherical.js";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export interface Waypoint {
  id: string;
  name: string;
  latlng: LatLng;
  distanceFromPrev?: number;
  bearingFromPrev?: number;
}

interface RouteBuilderProps {}

const RouteBuilder: React.FC<RouteBuilderProps> = () => {
  const [waypointCount, setWaypointCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const initPos: LatLngExpression = [14.599512, 120.984222];

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const addWaypoint = async (latlng: LatLng) => {
    setIsLoading(true);
    const { lat, lng } = latlng.wrap() as LatLng;
    const res = await fetch(`/geocoding?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      console.error("There has been an error");
    }

    const waypointNum = waypoints.length;
    const data = await res.json();

    const distanceFromPrev =
      waypointNum > 0
        ? waypoints[waypointNum - 1].latlng.distanceTo(latlng) / 1000
        : undefined;

    const p1 =
      waypointNum > 0
        ? new LatLon(
            waypoints[waypointNum - 1].latlng.lat,
            waypoints[waypointNum - 1].latlng.lng
          )
        : undefined;
    const p2 = new LatLon(latlng.lat, latlng.lng);
    const bearingFromPrev = p1?.initialBearingTo(p2);

    setWaypoints([
      ...waypoints,
      {
        name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        latlng,
        id: `waypoint-${waypointCount}`,
        distanceFromPrev,
        bearingFromPrev,
      },
    ]);
    setWaypointCount(waypointCount + 1);
    setIsLoading(false);
  };

  const editWaypoint = async (id: string, latlng: LatLng) => {
    setIsLoading(true);
    const { lat, lng } = latlng.wrap() as LatLng;

    const res = await fetch(`/geocoding?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      console.error("There has been an error");
    }

    const data = await res.json();

    const updatedWaypoints = waypoints.map((waypoint) => {
      if (id === waypoint.id)
        return {
          id,
          name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          latlng,
        };
      return waypoint;
    });
    setWaypoints(updatedWaypoints);
    setIsLoading(false);
  };

  const handleDragEnd = async (id: string, latlng: LatLng) => {
    await editWaypoint(id, latlng);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div
        className={clsx(
          isLoading && "pointer-events-none opacity-50",
          "grow md:h-[calc(100vh-4rem)] md:max-h-none md:min-h-none max-h-[80%] min-h-[80%]"
        )}
      >
        <Map
          onDragEnd={handleDragEnd}
          position={initPos}
          zoom={7}
          onMapClick={addWaypoint}
          waypoints={waypoints}
        />
      </div>
      <div className="bg-white min-w-72 md:overflow-auto md:max-h-[calc(100vh-4rem)]">
        <WaypointList waypoints={waypoints} />
      </div>
    </div>
  );
};

export default RouteBuilder;
