"use client";

import dynamic from "next/dynamic";
import { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";
import WaypointList from "./WaypointList";
import clsx from "clsx";
import LatLon from "geodesy/latlon-spherical.js";
import Button from "./Button";
import { LOCAL_STORAGE_WAYPOINTS_KEY } from "@/constants";
import Spinner from "./Spinner";
import { Waypoint } from "@/types";
import { useRouteStore } from "@/store/store";

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
  const [isLoading, setIsLoading] = useState(false);
  const initPos: LatLngExpression = [14.599512, 120.984222];
  const getRoute = useRouteStore((state) => state.getRoute);
  const route = getRoute();

  const [waypoints, setWaypoints] = useState<Waypoint[]>(route.waypoints);
  const [waypointCount, setWaypointCount] = useState(waypoints.length);
  console.log(route);

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

  const addWaypoint = async (latlng: LatLng) => {
    setIsLoading(true);
    // const { lat, lng } = latlng.wrap() as LatLng;
    // const res = await fetch(`/geocoding?lat=${lat}&lng=${lng}`);

    // if (!res.ok) {
    //   console.error("There has been an error");
    // }

    // const waypointNum = waypoints.length;
    // const data = await res.json();

    // const distanceFromPrev =
    //   waypointNum > 0
    //     ? waypoints[waypointNum - 1].latlng.distanceTo(latlng) / 1000
    //     : undefined;

    // const p1 =
    //   waypointNum > 0
    //     ? new LatLon(
    //         waypoints[waypointNum - 1].latlng.lat,
    //         waypoints[waypointNum - 1].latlng.lng
    //       )
    //     : undefined;
    // const p2 = new LatLon(latlng.lat, latlng.lng);
    // const bearingFromPrev = p1?.initialBearingTo(p2);

    // const newWaypoints = [
    //   ...waypoints,
    //   {
    //     name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    //     latlng,
    //     id: `waypoint-${waypointCount}`,
    //     distanceFromPrev,
    //     bearingFromPrev,
    //   },
    // ];
    // setWaypoints(newWaypoints);
    // setWaypointCount(waypointCount + 1);
    // localStorage.setItem(
    //   LOCAL_STORAGE_WAYPOINTS_KEY,
    //   JSON.stringify(newWaypoints)
    // );
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
          onMapClick={addWaypoint}
          waypoints={waypoints}
          departure={route.departure}
          destination={route.destination}
        />
      </div>
      <div className="bg-white min-w-72 md:overflow-auto md:max-h-[calc(100vh-4rem)]">
        {route.departure?.ident} {route.destination?.ident}
        <WaypointList waypoints={waypoints} />
        <p>
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
