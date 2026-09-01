"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type MapOffice = {
  name: string;
  address: string;
  phone: string;
  tel: string;
  lat: number;
  lng: number;
};

/**
 * Apple Maps only resolves properly on Apple hardware; everywhere else the
 * link is a dead end. So both providers are offered rather than sniffing the
 * user agent and guessing wrong.
 */
function googleMapsUrl(office: MapOffice) {
  return `https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`;
}

function appleMapsUrl(office: MapOffice) {
  return `https://maps.apple.com/?daddr=${office.lat},${office.lng}&q=${encodeURIComponent(
    office.name,
  )}`;
}

function FocusHandler({ office }: { office: MapOffice }) {
  const map = useMap();
  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      map.setView([office.lat, office.lng], 14, { animate: false });
    } else {
      map.flyTo([office.lat, office.lng], 14, { duration: 0.8 });
    }
  }, [map, office]);
  return null;
}

export default function LocationsMapView({
  offices,
  focusedIndex,
}: {
  offices: MapOffice[];
  focusedIndex: number;
}) {
  const focused = offices[focusedIndex];

  return (
    <MapContainer
      center={[focused.lat, focused.lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {offices.map((office) => (
        <Marker key={office.name} position={[office.lat, office.lng]}>
          <Popup>
            <span className="sgm-popup">
              <strong className="sgm-popup-name">{office.name}</strong>
              <span className="sgm-popup-address">{office.address}</span>
              <a className="sgm-popup-phone" href={office.tel}>
                {office.phone}
              </a>
              <span className="sgm-popup-actions">
                <a href={googleMapsUrl(office)} target="_blank" rel="noopener noreferrer">
                  Google Maps
                </a>
                <a href={appleMapsUrl(office)} target="_blank" rel="noopener noreferrer">
                  Apple Maps
                </a>
              </span>
            </span>
          </Popup>
        </Marker>
      ))}
      <FocusHandler office={focused} />
    </MapContainer>
  );
}
