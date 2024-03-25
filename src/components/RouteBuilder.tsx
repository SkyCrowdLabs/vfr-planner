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
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

export interface Airport {
  continent: string | null;
  elevation_ft: string | null;
  gps_code: string | null;
  home_link: string | null;
  iata_code: string | null;
  id: number;
  ident: string | null;
  iso_country: string | null;
  iso_region: string | null;
  keywords: string | null;
  latitude_deg: number | null;
  local_code: string | null;
  longitude_deg: number | null;
  municipality: string | null;
  name: string | null;
  scheduled_service: string | null;
  type: string | null;
  wikipedia_link: string | null;
}

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

export interface Waypoint {
  id: string;
  name: string;
  latlng: LatLng;
  distanceFromPrev?: number;
  bearingFromPrev?: number;
}

interface RouteBuilderProps {
  isLoggedIn?: boolean;
}

const RouteBuilder: React.FC<RouteBuilderProps> = ({ isLoggedIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const initPos: LatLngExpression = [14.599512, 120.984222];
  const storedWaypoints = localStorage.getItem(LOCAL_STORAGE_WAYPOINTS_KEY);
  const initWaypoints = storedWaypoints
    ? JSON.parse(storedWaypoints).map((waypoint: Waypoint) => ({
        ...waypoint,
        latlng: new LatLng(waypoint.latlng.lat, waypoint.latlng.lng),
      }))
    : [];

  const [waypoints, setWaypoints] = useState<Waypoint[]>(initWaypoints);
  const [waypointCount, setWaypointCount] = useState(waypoints.length);
  const { data: airports, error } = useSWR<{ data: Airport[] }>(
    "/airports",
    fetcher
  );

  const handleSave = async () => {
    setIsLoading(true);

    const res = await fetch("/routes", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: "Saved route", waypoints }),
    });

    if (!res.ok) {
      console.error(res);
    }
    setIsLoading(false);
  };

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

    const newWaypoints = [
      ...waypoints,
      {
        name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        latlng,
        id: `waypoint-${waypointCount}`,
        distanceFromPrev,
        bearingFromPrev,
      },
    ];
    setWaypoints(newWaypoints);
    setWaypointCount(waypointCount + 1);
    localStorage.setItem(
      LOCAL_STORAGE_WAYPOINTS_KEY,
      JSON.stringify(newWaypoints)
    );
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
    const waypointInfo = {
      id,
      name: data.data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      latlng,
    };

    const waypointNum = waypoints.length;
    const updatedWaypoints = waypoints.reduce((acc, waypoint, i) => {
      if (id === waypoint.id) {
        const distanceFromPrev =
          i > 0 ? waypoints[i - 1].latlng.distanceTo(latlng) / 1000 : undefined;
        const p1 =
          i > 0
            ? new LatLon(
                waypoints[i - 1].latlng.lat,
                waypoints[i - 1].latlng.lng
              )
            : undefined;
        const p2 = new LatLon(latlng.lat, latlng.lng);
        const bearingFromPrev = p1?.initialBearingTo(p2);

        const newAcc = [...acc];
        newAcc[i] = {
          ...waypointInfo,
          distanceFromPrev,
          bearingFromPrev,
        };

        if (i + 1 < waypointNum) {
          const nextWaypoint = waypoints[i + 1];
          const nextDistanceFromPrev =
            newAcc[i].latlng.distanceTo(nextWaypoint.latlng) / 1000;
          const nP1 = new LatLon(newAcc[i].latlng.lat, newAcc[i].latlng.lng);
          const nP2 = new LatLon(
            nextWaypoint.latlng.lat,
            nextWaypoint.latlng.lng
          );
          const nextBearingFromPrev = nP1?.initialBearingTo(nP2);
          newAcc[i + 1] = {
            ...nextWaypoint,
            distanceFromPrev: nextDistanceFromPrev,
            bearingFromPrev: nextBearingFromPrev,
          };
        }

        return newAcc;
      }
      return acc;
    }, waypoints as Waypoint[]);
    setWaypoints(updatedWaypoints);
    localStorage.setItem(
      LOCAL_STORAGE_WAYPOINTS_KEY,
      JSON.stringify(updatedWaypoints)
    );
    setIsLoading(false);
  };

  const resetWaypoints = () => {
    setWaypointCount(0);
    setWaypoints([]);
    localStorage.removeItem(LOCAL_STORAGE_WAYPOINTS_KEY);
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
        {/* <div>
          <label
            htmlFor="departure"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Departure
          </label>
          <select
            id="departure"
            name="departure"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue="Canada"
          >
            {airports?.data.length &&
              airports.data.map((airport) => (
                <option key={airport.id}>
                  {airport.ident} {airport.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="arrival"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Arrival
          </label>
          <select
            id="arrival"
            name="arrival"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue="Canada"
          >
            {airports?.data.length &&
              airports.data.map((airport) => (
                <option key={airport.id}>
                  {airport.ident} {airport.name}
                </option>
              ))}
          </select>
        </div> */}
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
