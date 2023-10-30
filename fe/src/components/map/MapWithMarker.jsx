import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const MapWithMarker = ({ address }) => {
  const position = [address.latitude, address.longitude];

  return (
    <MapContainer
      className="h-[500px] md:h-[600px] lg:h-[700px]"
      center={position}
      zoom={18}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={position}
        icon={L.icon({
          iconUrl: "/images/marker-icon.png",
        })}
      />
    </MapContainer>
  );
};

export default MapWithMarker;
