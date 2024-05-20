import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";

import AuthContext from "../../../contexts/AuthContext";
import Category from "../../category/category";

const ReservationForm = () => {
  const [rooms, setRooms] = useState([]);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    room: "",
    date: "",
  });
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Dodaj zero przed miesiącem i dniem, jeśli są mniejsze niż 10
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    // Format daty w formacie "RRRR-MM-DD"
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Pobranie listy pokoi z serwera
    const fetchRooms = async () => {
      try {
        const response = await fetch(`http://localhost:3000/rooms`);
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Błąd podczas pobierania listy pokoi:", error);
      }
    };

    fetchRooms();
  }, []);

  // Zaktualizuj stan formData po zmianie user._id
  useEffect(() => {
    if (user?._id) {
      setFormData((prev) => ({ ...prev, user: user._id }));
    }
  }, [user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reservationData = { ...formData, user: user?._id }; // Upewnij się, że dołączasz user._id

    try {
      // Wysyłamy żądanie POST na adres http://localhost:3000/reservations
      const response = await fetch("http://localhost:3000/reservations", {
        method: "POST", // Metoda żądania POST
        headers: {
          "Content-Type": "application/json", // Nagłówek Content-Type dla danych JSON
        },
        body: JSON.stringify(reservationData), // Dane formularza przekształcone na format JSON
      });

      // Sprawdzamy, czy odpowiedź z serwera ma status HTTP 200 (OK)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Odczytujemy odpowiedź z serwera w formacie JSON
      const result = await response.json();
      console.log(result);

      // Tutaj możesz dodać kod do obsługi sukcesu, na przykład zresetować formularz
      // lub wyświetlić użytkownikowi informację o powodzeniu rezerwacji.
    } catch (error) {
      // W przypadku błędu wyświetlamy informację o problemie w konsoli
      console.error("Wystąpił problem z Twoją operacją fetch: ", error);
    }
  };

  return (
    <Category title="Rezerwacja Pokoju">
      <form onSubmit={handleSubmit}>
        <label htmlFor="room">Pokój:</label>
        <select
          name="room"
          value={formData.room}
          onChange={handleInputChange}
          required
        >
          <option value="">Wybierz pokój</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.nazwa}
            </option>
          ))}
        </select>

        <label htmlFor="date">Data rezerwacji:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
          min={getMinDate()}
        />

        <button type="submit">Zarezerwuj</button>
      </form>
    </Category>
  );
};

export default ReservationForm;
