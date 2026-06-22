"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function OslofjordKart() {
  return (
    <div className="w-100 h-100">
    <MapContainer center={[59.5, 10.6]} zoom={9} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <Marker position={[59.9, 10.7]}>
        <Popup>
          Hei
        </Popup>
      </Marker>
    </MapContainer>
    </div>
  );
}