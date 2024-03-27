import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple } from "leaflet";
import WaypointMarker from "./WaypointMarker";
import Enroute from "./Enroute";
import { useRouteStore } from "@/store/store";

interface MapProps {
  position: LatLngTuple;
  zoom: number;
}

const MyMap: React.FC<MapProps> = ({ position, zoom }) => {
  const waypoints = useRouteStore((state) => state.waypoints);
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
