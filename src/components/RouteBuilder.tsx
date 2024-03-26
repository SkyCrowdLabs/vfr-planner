"use client";

import dynamic from "next/dynamic";
import { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";
import WaypointList from "./WaypointList";
import clsx from "clsx";
import Button from "./Button";
import Spinner from "./Spinner";
import { useRouteStore } from "@/store/store";
import {
  getDistanceFromAirportToWaypoint,
  getDistanceNm,
} from "@/utils/getDistanceNm";
import {
  getTrueCourseDegFromAirportToWaypoint,
  getTrueCourseDegFromWaypointToWaypoint,
} from "@/utils/getTrueCourse";

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

  const route = getRoute();
  const departure = route.departure;
  const destination = route.destination;
  const waypoints = route.waypoints;

  const isFirstWaypoint = waypoints.length === 0;
  const handleClickDeparture = () => {
    setIsEditing(true);
  };
  const handleClickDestination = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);

    // const res = await fetch("/routes", {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({ name: "Saved route", waypoints }),
    // });

    // if (!res.ok) {
    //   console.error(res);
    // }
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

    const distanceFromPrev = isFirstWaypoint
      ? getDistanceFromAirportToWaypoint(departure, latlng)
      : getDistanceNm(waypoints[waypointNum - 1].latlng, latlng);
    const bearingFromPrev = isFirstWaypoint
      ? getTrueCourseDegFromAirportToWaypoint(departure, latlng)
      : getTrueCourseDegFromWaypointToWaypoint(
          waypoints[waypointNum - 1].latlng,
          latlng
        );

    addWaypoint({
      name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      latlng,
      id: `waypoint-${waypointNum + 1}`,
      distanceFromPrev,
      bearingFromPrev,
    });
    setIsLoading(false);
  };

  const editWaypoint = async (id: string, latlng: LatLng) => {
    setIsLoading(true);
    // const { lat, lng } = latlng.wrap() as LatLng;

    // const res = await fetch(`/geocoding?lat=${lat}&lng=${lng}`);

    // if (!res.ok) {
    //   console.error("There has been an error");
    // }

    // const data = await res.json();
    // const waypointInfo = {
    //   id,
    //   name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    //   latlng,
    // };

    // const waypointNum = waypoints.length;
    // const updatedWaypoints = waypoints.reduce((acc, waypoint, i) => {
    //   if (id === waypoint.id) {
    //     const distanceFromPrev =
    //       i > 0 ? waypoints[i - 1].latlng.distanceTo(latlng) / 1000 : undefined;
    //     const p1 =
    //       i > 0
    //         ? new LatLon(
    //             waypoints[i - 1].latlng.lat,
    //             waypoints[i - 1].latlng.lng
    //           )
    //         : undefined;
    //     const p2 = new LatLon(latlng.lat, latlng.lng);
    //     const bearingFromPrev = p1?.initialBearingTo(p2);

    //     const newAcc = [...acc];
    //     newAcc[i] = {
    //       ...waypointInfo,
    //       distanceFromPrev,
    //       bearingFromPrev,
    //     };

    //     if (i + 1 < waypointNum) {
    //       const nextWaypoint = waypoints[i + 1];
    //       const nextDistanceFromPrev =
    //         newAcc[i].latlng.distanceTo(nextWaypoint.latlng) / 1000;
    //       const nP1 = new LatLon(newAcc[i].latlng.lat, newAcc[i].latlng.lng);
    //       const nP2 = new LatLon(
    //         nextWaypoint.latlng.lat,
    //         nextWaypoint.latlng.lng
    //       );
    //       const nextBearingFromPrev = nP1?.initialBearingTo(nP2);
    //       newAcc[i + 1] = {
    //         ...nextWaypoint,
    //         distanceFromPrev: nextDistanceFromPrev,
    //         bearingFromPrev: nextBearingFromPrev,
    //       };
    //     }

    //     return newAcc;
    //   }
    //   return acc;
    // }, waypoints as Waypoint[]);
    // setWaypoints(updatedWaypoints);
    // localStorage.setItem(
    //   LOCAL_STORAGE_WAYPOINTS_KEY,
    //   JSON.stringify(updatedWaypoints)
    // );
    setIsLoading(false);
  };

  const resetWaypoints = () => {
    // setWaypointCount(0);
    // setWaypoints([]);
    // localStorage.removeItem(LOCAL_STORAGE_WAYPOINTS_KEY);
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
          departure={route.departure}
          destination={route.destination}
          onClickDeparture={handleClickDeparture}
          onClickDestination={handleClickDestination}
        />
      </div>
      <div className="bg-white min-w-72 md:overflow-auto md:max-h-[calc(100vh-4rem)]">
        {route.departure?.ident} {route.destination?.ident}
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
