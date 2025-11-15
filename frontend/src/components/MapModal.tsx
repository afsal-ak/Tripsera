import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  Circle as LeafletCircle
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface ILocation {
  name: string;
  mapZoomLevel?: number;
  geo: GeoPoint;
}

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  locations: ILocation[];
}

// Default marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Live location (pulsing blue)
const liveLocationIcon = L.divIcon({
  className: "",
  html: `<div class="live-location-dot"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Fit bounds helper
function FitBounds({ locations }: { locations: ILocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds: [number, number][] = locations.map((loc) => [
        loc.geo.coordinates[1],
        loc.geo.coordinates[0],
      ]);
      map.fitBounds(bounds, { padding: [70, 70] });
    }
  }, [locations]);

  return null;
}

function Compass() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Mobile device compass event
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setRotation(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "80px",
        right: "20px",
        zIndex: 2000,
        background: "white",
        padding: "8px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        userSelect: "none",
      }}
    >
      <div
        style={{
          transition: "transform 0.2s linear",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        🧭
      </div>
      <span>{Math.round(rotation)}°</span>
    </div>
  );
}

// Haversine distance (km)
function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Compass bearing function
function getBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  lat1 = lat1 * (Math.PI / 180);
  lat2 = lat2 * (Math.PI / 180);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export default function MapModal({ open, onClose, locations }: MapModalProps) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [userAccuracy, setUserAccuracy] = useState<number>(50);
  const [selected, setSelected] = useState<number[]>([]);

  // LIVE Tracking
  useEffect(() => {
    if (!open) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setUserAccuracy(pos.coords.accuracy || 50);
      },
      (err) => console.error("Live location error:", err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [open]);

  if (!open) return null;

  const first = locations[0];
 

  // Select 2 locations to show distance
  const toggleSelect = (i: number) => {
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : prev.length < 2 ? [...prev, i] : prev
    );
  };

  let selectedDistance = "";
  if (selected.length === 2) {
    const A = locations[selected[0]];
    const B = locations[selected[1]];
    const km = calcDistance(
      A.geo.coordinates[1],
      A.geo.coordinates[0],
      B.geo.coordinates[1],
      B.geo.coordinates[0]
    );
    const time = Math.round((km / 40) * 60);
    selectedDistance = `${km.toFixed(1)} km — approx ${time} min`;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="relative w-full h-full bg-white">

        {/* CLOSE BUTTON */}
        <button
          className="absolute top-4 right-4 z-[9999] bg-white px-4 py-2 rounded shadow"
          onClick={onClose}
        >
          Close
        </button>

        {/* SELECTED DISTANCE BOX */}
        {selectedDistance && (
          <div className="absolute top-4 left-4 z-[9999] bg-white px-4 py-2 rounded shadow font-semibold">
            {selectedDistance}
          </div>
        )}
      {/* <Compass /> */}

        <MapContainer
          center={[first.geo.coordinates[1], first.geo.coordinates[0]]}
          zoom={first.mapZoomLevel || 8}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitBounds locations={locations} />

          {/* LIVE LOCATION */}
          {userPos && (
            <>
              <Marker position={userPos} icon={liveLocationIcon}>
                <Popup>Your live location</Popup>
              </Marker>

              <LeafletCircle
                center={userPos}
                radius={userAccuracy}
                pathOptions={{
                  color: "#4285F4",
                  fillColor: "#4285F4",
                  fillOpacity: 0.15,
                }}
              />
            </>
          )}

          {/* POLYLINES FOR SELECTED 2 LOCATIONS */}
          {selected.length === 2 && (
            <Polyline
              positions={[
                [
                  locations[selected[0]].geo.coordinates[1],
                  locations[selected[0]].geo.coordinates[0],
                ],
                [
                  locations[selected[1]].geo.coordinates[1],
                  locations[selected[1]].geo.coordinates[0],
                ],
              ]}
              color="blue"
            />
          )}

          {/* MARKERS */}
          {locations.map((loc, index) => {
            const lat = loc.geo.coordinates[1];
            const lng = loc.geo.coordinates[0];

            // Compass direction
            let direction = "";
            if (userPos) {
              const bearing = getBearing(
                userPos[0],
                userPos[1],
                lat,
                lng
              );
              direction = `${bearing.toFixed(0)}°`;
            }

            return (
              <Marker
                key={index}
                icon={markerIcon}
                position={[lat, lng]}
                eventHandlers={{
                  click: () => toggleSelect(index),
                }}
              >
                <Popup>
                  <strong>{loc.name}</strong> <br />
                  {direction && <>Direction: {direction}° <br /></>}
                  {selected.includes(index) && <span>Selected</span>}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
