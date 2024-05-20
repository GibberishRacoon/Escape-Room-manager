import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const RoomMap = ({ rooms }) => {
  // const locations = [
  //   { lat: 52.2297, lng: 21.0122, name: "Szkoła" },
  //   { lat: 54.352, lng: 18.6466, name: "Pjatk" },
  //   { lat: 50.0647, lng: 19.945, name: "Psychiatryk" },
  // ];
  console.log("w mapach");
  console.log(rooms);
  const initialPosition = [52.2297, 21.0122];
  // Sprawdzanie, czy tablica rooms zawiera elementy
  if (!rooms || rooms.length === 0) {
    return console.log("brak informacji o pokojach");
  }

  return (
    <div className="myMap">
      <MapContainer center={initialPosition} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {rooms.map((room) => (
          <Marker key={room._id} position={[room.lat, room.lng]}>
            <Popup>{room.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RoomMap;
