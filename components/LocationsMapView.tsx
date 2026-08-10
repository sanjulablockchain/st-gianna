"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type MapOffice = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

function FocusHandler({ office }: { office: MapOffice }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([office.lat, office.lng], 14, { duration: 0.8 });
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
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {offices.map((office) => (
        <Marker key={office.name} position={[office.lat, office.lng]}>
          <Popup>
            <strong>{office.name}</strong>
            <br />
            {office.address}
          </Popup>
        </Marker>
      ))}
      <FocusHandler office={focused} />
    </MapContainer>
  );
}
