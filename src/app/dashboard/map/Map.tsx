import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple, latLng, latLngBounds } from "leaflet";
import WaypointMarker from "./WaypointMarker";
import Enroute from "./Enroute";
import { useRouteStore } from "@/store/store";

interface MapProps {
  position: LatLngTuple;
  zoom: number;
}

const MyMap: React.FC<MapProps> = ({ position, zoom }) => {
  const waypoints = useRouteStore((state) => state.waypoints);
  const corner1 = latLng(21.5, 116.4);
  const corner2 = latLng(4, 127);
  const maxBounds = latLngBounds(corner1, corner2);

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
      maxBounds={maxBounds}
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
