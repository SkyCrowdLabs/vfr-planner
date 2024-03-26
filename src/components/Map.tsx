import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLng, LatLngTuple } from "leaflet";
import WaypointMarker from "./WaypointMarker";
import { Airport, Waypoint } from "@/types";
import Enroute from "./Enroute";

interface MapProps {
  position: LatLngTuple;
  zoom: number;
  waypoints: Waypoint[];
  departure?: Airport;
  destination?: Airport;
}

const MyMap: React.FC<MapProps> = ({
  position,
  zoom,
  waypoints,
  departure,
  destination,
}) => {
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
      {waypoints.map((waypoint) => (
        <WaypointMarker key={waypoint.id} waypoint={waypoint} />
      ))}
      <Enroute />
    </MapContainer>
  );
};

export default MyMap;
