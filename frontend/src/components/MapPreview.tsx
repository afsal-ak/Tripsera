import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPreview({ locations, onClick }: any) {
  if (!locations?.length) return null;

  const first = locations[0];

  return (
     //   className="w-full h-64 rounded-xl overflow-hidden cursor-pointer border"
    <div className="w-full h-96 rounded-xl overflow-hidden cursor-pointer"

      onClick={onClick}
    >
      <MapContainer
        center={[
          first.geo.coordinates[1],
          first.geo.coordinates[0],
        ]}
        zoom={first.mapZoomLevel || 10}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {locations.map((loc: any, index: number) => (
          <Marker
            key={index}
            icon={markerIcon}
            position={[
              loc.geo.coordinates[1],
              loc.geo.coordinates[0],
            ]}
          >
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
