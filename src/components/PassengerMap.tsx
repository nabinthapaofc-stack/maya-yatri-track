import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

const busIconSvg = `
  <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <circle cx="22" cy="22" r="22" fill="rgba(33, 117, 243, 0.12)" />
      <path d="M22 8c5.523 0 10 3.134 10 7v10c0 2.21-1.79 4-4 4v3.25c0 .414-.336.75-.75.75h-1.5a.75.75 0 0 1-.75-.75V29h-4v3.25c0 .414-.336.75-.75.75h-1.5a.75.75 0 0 1-.75-.75V29c-2.21 0-4-1.79-4-4V15c0-3.866 4.477-7 10-7Zm5 5h-10a1 1 0 0 0-1 1v5h12v-5a1 1 0 0 0-1-1Zm-9 12a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm8 0a2 2 0 1 0-2-2 2 2 0 0 0 2 2Z" fill="#1d4ed8" />
      <rect x="20" y="34" width="4" height="6" rx="2" fill="#1d4ed8" />
    </g>
  </svg>
`;

const busIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(busIconSvg)}`,
  iconSize: [44, 44],
  iconAnchor: [22, 42],
  popupAnchor: [0, -36],
});

interface PassengerMapProps {
  center: [number, number];
  zoom?: number;
  buses: { id: number; position: [number, number]; label: string; route: string; eta: string }[];
  className?: string;
  mapClassName?: string;
}

const PassengerMap = ({ center, zoom = 13, buses, className, mapClassName }: PassengerMapProps) => {
  return (
    <div className={cn("rounded-3xl overflow-hidden border border-border/40 shadow-lg", className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        className={cn("h-72 w-full", mapClassName)}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {buses.map((bus) => (
          <Marker key={bus.id} position={bus.position} icon={busIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{bus.label}</p>
                <p className="text-sm text-muted-foreground">{bus.route}</p>
                <p className="text-xs text-primary">ETA: {bus.eta}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PassengerMap;
