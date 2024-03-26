"use client";

import dynamic from "next/dynamic";
import { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";
import WaypointList from "./WaypointList";
import clsx from "clsx";
import Button from "./Button";
import Spinner from "./Spinner";
import { useRouteStore } from "@/store/store";
import { getDistanceNm } from "@/utils/getDistanceNm";
import { getTrueCourseDeg } from "@/utils/getTrueCourse";
import { Waypoint } from "@/types";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => (
    <div className="h-full w-full z-0">
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    </div>
  ),
  ssr: false,
});

interface RouteBuilderProps {
  isLoggedIn?: boolean;
}

const RouteBuilder: React.FC<RouteBuilderProps> = ({ isLoggedIn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initPos: LatLngExpression = [14.599512, 120.984222];
  const getRoute = useRouteStore((state) => state.getRoute);
  const addWaypoint = useRouteStore((state) => state.addWaypoint);
  const resetRoute = useRouteStore((state) => state.resetRoute);

  const departure = useRouteStore((state) => state.departure);
  const destination = useRouteStore((state) => state.destination);
  const waypoints = useRouteStore((state) => state.waypoints);

  const handleClickDeparture = () => {
    setIsEditing(true);
  };
  const handleClickDestination = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const handleMapClick = async (latlng: LatLng) => {
    if (!isEditing || !departure || !destination) return;

    setIsLoading(true);
    const { lat, lng } = latlng.wrap() as LatLng;

    const res = await fetch(`/geocoding?lat=${lat}&lng=${lng}`);
    if (!res.ok) {
      console.error("There has been an error");
    }
    const waypointNum = waypoints.length;
    const data = await res.json();
    const prevWaypoint = waypoints[waypointNum - 1];
    const waypoint: Waypoint = {
      name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      latlng,
      id: `waypoint-${waypointNum + 1}`,
    };

    const distanceFromPrev = getDistanceNm(prevWaypoint, waypoint);
    const bearingFromPrev = getTrueCourseDeg(prevWaypoint, waypoint);

    addWaypoint({
      ...waypoint,
      distanceFromPrev,
      bearingFromPrev,
    });
    setIsLoading(false);
  };

  const editWaypoint = async (id: string, latlng: LatLng) => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const resetWaypoints = () => {
    resetRoute();
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
          onMapClick={handleMapClick}
          waypoints={waypoints}
          departure={departure}
          destination={destination}
          onClickDeparture={handleClickDeparture}
          onClickDestination={handleClickDestination}
        />
      </div>
      <div className="bg-white min-w-72 md:overflow-auto md:max-h-[calc(100vh-4rem)]">
        {departure?.ident} {destination?.ident}
        <WaypointList waypoints={waypoints} />
        <p>
          {JSON.stringify(isEditing)}
          Total:{" "}
          {waypoints
            .reduce(
              (acc, { distanceFromPrev }) => acc + (distanceFromPrev || 0),
              0
            )
            .toFixed(2)}
        </p>
        <Button
          disabled={!waypoints.length || !isLoggedIn}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button disabled={!waypoints.length} onClick={resetWaypoints}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default RouteBuilder;
