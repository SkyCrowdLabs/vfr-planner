"use client";
import React, { useMemo, useRef, useState } from "react";
import { LatLng } from "leaflet";
import { Marker } from "react-leaflet";
import { Waypoint } from "@/types";

interface WaypointMarkerProps {
  waypoint: Waypoint;
  onDragEnd: (id: string, latlng: LatLng) => void;
}

const WaypointMarker: React.FC<WaypointMarkerProps> = ({
  waypoint: { latlng, id },
  onDragEnd,
}) => {
  const [position, setPosition] = useState(latlng);
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        if (marker != null) {
          const newLatlng = marker.getLatLng();
          setPosition(newLatlng);
          onDragEnd(id, newLatlng);
        }
      },
    }),
    [onDragEnd, id]
  );

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

export default WaypointMarker;
