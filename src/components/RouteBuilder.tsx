import dynamic from "next/dynamic";
import { LatLng, LatLngExpression } from "leaflet";
import React, { useState } from "react";
import WaypointList from "./WaypointList";
import clsx from "clsx";
import Button from "./Button";
import Spinner from "./Spinner";
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
  const resetRoute = useRouteStore((state) => state.resetRoute);

  const departure = useRouteStore((state) => state.departure);
  const destination = useRouteStore((state) => state.destination);
  const waypoints = useRouteStore((state) => state.waypoints);

  const handleSave = async () => {
    setIsLoading(true);
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
          waypoints={waypoints}
          departure={departure}
          destination={destination}
        />
      </div>
      <div className="bg-white min-w-72 md:overflow-auto md:max-h-[calc(100vh-4rem)]">
        {departure?.ident} {destination?.ident}
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
