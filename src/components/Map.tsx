import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLng, LatLngTuple } from "leaflet";
import WaypointMarker from "./WaypointMarker";
import { Airport, Waypoint } from "@/types";
import AirportMarker from "./AirportMarker";
import Enroute from "./Enroute";

interface MapProps {
  position: LatLngTuple;
  zoom: number;
  waypoints: Waypoint[];
  onDragEnd: (id: string, latlng: LatLng) => void;
  departure?: Airport;
  destination?: Airport;
}

const MyMap: React.FC<MapProps> = ({
  position,
  zoom,
  waypoints,
  onDragEnd,
  departure,
  destination,
}) => {
  const WaypointPlotter = () => {
    return waypoints.map((waypoint) => {
      return (
        <WaypointMarker
          key={waypoint.id}
          waypoint={waypoint}
          onDragEnd={onDragEnd}
        />
      );
    });
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {departure && <AirportMarker airport={departure} />}
      {destination && <AirportMarker airport={destination} />}
      <WaypointPlotter />
      <Enroute />
    </MapContainer>
  );
};

export default MyMap;
