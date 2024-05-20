import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import RoomMap from "./RoomMap"; // Upewnij się, że ścieżka do komponentu RoomMap jest poprawna
import "./roomsearch.scss";
import Category from "../../category/category";
import AuthContext from "../../../contexts/AuthContext";
import RoomPopup from "../description/RoomPopup";

const RoomSearch = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const { user } = useContext(AuthContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupRoom, setPopupRoom] = useState(null);

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Włącza przesyłanie ciasteczek sesji
      });

      if (!response.ok) {
        throw new Error("Problem z usunięciem pokoju");
      }

      console.log("Pokój usunięty");
      fetchRooms();
      // Tutaj możesz zaktualizować stan aplikacji, aby odzwierciedlić usunięcie pokoju
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  useEffect(() => {
    fetchRooms({});
  }, []);

  const fetchRooms = async (filters = {}) => {
    // Ustaw domyślną wartość na pusty obiekt
    const query = Object.entries(filters)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    const response = await fetch(`http://localhost:3000/rooms?${query}`);
    const data = await response.json();

    //setRooms([]); // Możesz chcieć to usunąć, jeśli chcesz uniknąć migotania listy
    setRooms(data);
    setSelectedRoom(data.length === 1 ? data[0] : null);
  };

  // Funkcja do dodawania pokoju do listy życzeń
  const handleAddToWishlist = async (roomId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/wishlist/${roomId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Włącza przesyłanie ciasteczek sesji
        }
      );

      if (!response.ok) {
        throw new Error("Problem z dodaniem pokoju do listy życzeń");
      }

      // Tu możesz zaktualizować stan aplikacji lub wykonać inne akcje po dodaniu do listy życzeń
      console.log("Pokój dodany do listy życzeń");
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  const cities = ["Gdańsk", "Warszawa", "Kraków", "Wrocław"];
  const themes = ["informatyczna", "edukacyjna", "psychologiczna"];
  const difficultyLevels = ["łatwy", "średni", "trudny"];

  const initialValues = {
    miasto: "",
    tematyka: "",
    trudność: "",
  };

  const onFilterChange = (e, setFieldValue, values) => {
    setFieldValue(e.target.name, e.target.value);
    fetchRooms({ ...values, [e.target.name]: e.target.value });
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };
  console.log(rooms);

  // Funkcja do otwierania popupu
  const openPopup = (room) => {
    setPopupRoom(room);
    setIsPopupVisible(true);
  };

  // Funkcja do zamykania popupu
  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupRoom(null);
  };

  return (
    <>
      <Category title="Lista pokoi:">
        <button onClick={toggleMap} className="button button-gradient">
          {showMap ? "Ukryj mapę" : "Pokaż mapę Polski"}
        </button>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          {({ values, setFieldValue }) => (
            <Form>
              <Field
                as="select"
                name="miasto"
                onChange={(e) => onFilterChange(e, setFieldValue, values)}
                className="filter-select"
              >
                <option value="">Wszystkie miasta</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Field>
              <Field
                as="select"
                name="tematyka"
                onChange={(e) => onFilterChange(e, setFieldValue, values)}
                className="filter-select"
              >
                <option value="">Wszystkie tematyki</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </Field>
              <Field
                as="select"
                name="trudność"
                onChange={(e) => onFilterChange(e, setFieldValue, values)}
                className="filter-select"
              >
                <option value="">Wszystkie poziomy trudności</option>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Field>
            </Form>
          )}
        </Formik>
        <div className="rooms-display">
          {rooms.map((room) => (
            <div key={room._id} className="result-box">
              <h3>{room.nazwa}</h3>
              <p>Miasto: {room.miasto}</p>
              <p>Tematyka: {room.tematyka}</p>
              <p>Trudność: {room.trudność}</p>
              <button
                onClick={() => openPopup(room)}
                className="button button-gradient"
              >
                Więcej informacji
              </button>
              <button
                onClick={() => handleAddToWishlist(room._id)}
                className="button button-gradient"
                disabled={user.wishlist.includes(room._id)}
              >
                {user.wishlist.includes(room._id)
                  ? "Pokój jest na liście życzeń"
                  : "Dodaj do listy życzeń"}
              </button>

              {user.isAdmin && (
                <button
                  onClick={() => handleDeleteRoom(room._id)}
                  className="button button-gradient"
                >
                  Usuń Pokój
                </button>
              )}
            </div>
          ))}
        </div>
      </Category>
      {isPopupVisible && <RoomPopup room={popupRoom} onClose={closePopup} />}
      {showMap && <RoomMap rooms={rooms} />}
    </>
  );
};

export default RoomSearch;
