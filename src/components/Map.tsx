import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLng, LatLngTuple } from "leaflet";
import WaypointMarker from "./WaypointMarker";
import { Airport, Waypoint } from "@/types";
import AirportMarker from "./AirportMarker";

interface MapProps {
  position: LatLngTuple;
  zoom: number;
  onMapClick: (latlng: LatLng) => void;
  waypoints: Waypoint[];
  onDragEnd: (id: string, latlng: LatLng) => void;
  departure?: Airport;
  destination?: Airport;
  onClickDeparture?: () => void;
  onClickDestination?: () => void;
}

const MyMap: React.FC<MapProps> = ({
  position,
  zoom,
  onMapClick,
  waypoints,
  onDragEnd,
  departure,
  destination,
  onClickDeparture,
  onClickDestination,
}) => {
  const LocationFinder = () => {
    useMapEvents({
      click(e) {
        const { latlng } = e;
        onMapClick(latlng);
      },
    });
    return null;
  };
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

  const linePositions = waypoints.map(({ latlng }) => latlng);

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
      {departure && (
        <AirportMarker airport={departure} onClick={onClickDeparture} />
      )}
      {destination && (
        <AirportMarker airport={destination} onClick={onClickDestination} />
      )}
      <LocationFinder />
      <WaypointPlotter />
      <Polyline positions={linePositions} />
    </MapContainer>
  );
};

export default MyMap;
