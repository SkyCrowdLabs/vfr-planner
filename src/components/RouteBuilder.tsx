"use client";

import dynamic from "next/dynamic";
import { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export interface Waypoint {
  name: string;
  latlng: LatLngExpression;
}

interface RouteBuilderProps {}

const RouteBuilder: React.FC<RouteBuilderProps> = () => {
  const initPos: LatLngExpression = [14.599512, 120.984222];

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const addWaypoint = async (latlng: LatLngExpression) => {
    const { lat, lng } = latlng as LatLng;
    const res = await fetch(`/geocoding?lat=${lat}&lng=${lng}`);

    if (!res.ok) {
      console.error("There has been an error");
    }

    const data = await res.json();
    setWaypoints([...waypoints, { name: data.data.name, latlng }]);
  };

  return (
    <div className="absolute w-full h-full">
      <Map
        position={initPos}
        zoom={7}
        onMapClick={addWaypoint}
        waypoints={waypoints}
      />
      <div className="relative h-20 w-96 bottom-40 bg-white z-50 rounded-md left-[calc(50%-24rem)]">
        {JSON.stringify(waypoints)}
      </div>
    </div>
  );
};

export default RouteBuilder;
