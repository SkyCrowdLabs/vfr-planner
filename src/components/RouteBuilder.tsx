"use client";

import dynamic from "next/dynamic";
import { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";
import WaypointList from "./Waypoint";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export interface Waypoint {
  id: string;
  name: string;
  latlng: LatLngExpression;
}

interface RouteBuilderProps {}

const RouteBuilder: React.FC<RouteBuilderProps> = () => {
  const [waypointCount, setWaypointCount] = useState(0);
  const initPos: LatLngExpression = [14.599512, 120.984222];

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const addWaypoint = async (latlng: LatLngExpression) => {
    const { lat, lng } = latlng as LatLng;
    const res = await fetch(`/geocoding?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      console.error("There has been an error");
    }

    const data = await res.json();
    setWaypoints([
      ...waypoints,
      { name: data.data.name, latlng, id: `waypoint-${waypointCount}` },
    ]);
    setWaypointCount(waypointCount + 1);
  };

  return (
    <div className="w-full h-full flex flex-row">
      <div className="grow">
        <Map
          position={initPos}
          zoom={7}
          onMapClick={addWaypoint}
          waypoints={waypoints}
        />
      </div>
      <div className="bg-white min-w-72">
        <WaypointList waypoints={waypoints} />
      </div>
    </div>
  );
};

export default RouteBuilder;
