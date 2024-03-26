import { Airport } from "@/types";
import { LatLng } from "leaflet";
import { useMemo, useRef } from "react";
import { Marker } from "react-leaflet";

interface AirportMarkerProps {
  airport: Airport;
  onClick?: () => void;
}

const AirportMarker: React.FC<AirportMarkerProps> = ({
  airport,
  onClick = () => {},
}) => {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      click() {
        onClick();
      },
    }),
    [onClick]
  );
  return (
    <Marker
      eventHandlers={eventHandlers}
      position={
        new LatLng(
          airport.latitude_deg as number,
          airport.longitude_deg as number
        )
      }
    />
  );
};

export default AirportMarker;
