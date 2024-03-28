"use client";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import React, { useContext, useState } from "react";
import WaypointList from "@/app/dashboard/map/WaypointList";
import clsx from "clsx";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { useRouteStore } from "@/store/store";
import { NextPage } from "next";
import toast from "react-hot-toast";
import { DialogContext } from "@/context/DialogContext";

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
  const saveRoute = useRouteStore((state) => state.saveRoute);
  const editRoute = useRouteStore((state) => state.editRoute);
  const error = useRouteStore((state) => state.error);
  const isLoading = useRouteStore((state) => state.isLoading);
  const isMapBusy = useRouteStore((state) => state.isMapBusy);
  const isModified = useRouteStore((state) => state.isModified);
  const waypoints = useRouteStore((state) => state.waypoints);
  const routeId = useRouteStore((state) => state.id);
  const { setConfirmResetVisible } = useContext(DialogContext);

  const handleSave = async () => {
    await saveRoute();
    if (error) toast.error("There has been a problem saving the route");
    toast.success("Route has been saved successfully!");
  };
  const handleUpdate = async () => {
    if (!isModified) {
      toast.error("There are no changes to save");
      return;
    }
    await editRoute();
    if (error) {
      toast.error("There has been a problem saving the route");
      return;
    }
    toast.success("Route has been updated");
  };
  const handleReset = async () => {
    setConfirmResetVisible(true);
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
      <div className="bg-white min-w-72 md:overflow-auto md:max-h-[calc(100vh-4rem)] px-5">
        <div className="w-full min-h-full flex flex-col justify-start gap-4">
          <WaypointList />
          {!!waypoints?.length ? (
            <>
              <div>
                {routeId ? (
                  <Button
                    isLoading={isLoading}
                    disabled={!waypoints.length || !isModified}
                    onClick={handleUpdate}
                  >
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
              <div className="pb-5">
                <Button disabled={!waypoints.length} onClick={handleReset}>
                  Clear
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-5 pb-5 h-full flex justify-center items-center grow">
              <p className="text-gray-700">There is no loaded route</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteBuilder;
