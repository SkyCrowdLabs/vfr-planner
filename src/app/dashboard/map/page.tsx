"use client";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import React from "react";
import WaypointList from "@/app/dashboard/map/WaypointList";
import clsx from "clsx";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { useRouteStore } from "@/store/store";
import { NextPage } from "next";
import toast from "react-hot-toast";

const Map = dynamic(() => import("@/app/dashboard/map/Map"), {
  loading: () => (
    <div className="h-full w-full z-0">
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    </div>
  ),
  ssr: false,
});

const RouteBuilder: NextPage = () => {
  const initPos: LatLngExpression = [14.599512, 120.984222];
  const resetRoute = useRouteStore((state) => state.resetRoute);
  const saveRoute = useRouteStore((state) => state.saveRoute);
  const editRoute = useRouteStore((state) => state.editRoute);
  const error = useRouteStore((state) => state.error);
  const isLoading = useRouteStore((state) => state.isLoading);
  const isMapBusy = useRouteStore((state) => state.isMapBusy);
  const waypoints = useRouteStore((state) => state.waypoints);
  const routeId = useRouteStore((state) => state.id);

  const handleSave = async () => {
    await saveRoute();
    if (error) toast.error("There has been a problem saving the route");
    toast.success("Route has been saved successfully!");
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div
        className={clsx(
          {
            "grow md:h-[calc(100vh-4rem)] md:max-h-none md:min-h-none max-h-[80%] min-h-[80%]":
              true,
          },
          {
            "opacity-70 pointer-events-none": isMapBusy,
          }
        )}
      >
        <Map position={initPos} zoom={7} />
      </div>
      <div className="bg-white min-w-72 max-w-72 md:overflow-auto md:max-h-[calc(100vh-4rem)] px-5">
        <WaypointList />
        <div className="w-full flex items-center justify-center gap-4">
          <div className="w-20 mt-5 pb-5">
            {routeId ? (
              <Button disabled={!waypoints.length} onClick={editRoute}>
                Update
              </Button>
            ) : (
              <Button
                isLoading={isLoading}
                disabled={!waypoints.length}
                onClick={handleSave}
              >
                Save
              </Button>
            )}
          </div>
          <div className="w-20 mt-5 pb-5">
            <Button disabled={!waypoints.length} onClick={resetRoute}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteBuilder;
