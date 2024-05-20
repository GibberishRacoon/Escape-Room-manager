import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import Category from "../category/category";

const Wishlist = () => {
  const [rooms, setRooms] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchRoomsAndWishlist = async () => {
    // Pobierz najpierw listę pokoi
    try {
      const roomResponse = await fetch(`http://localhost:3000/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!roomResponse.ok) {
        throw new Error("Problem z pobieraniem listy pokoi");
      }
      const roomData = await roomResponse.json();
      setRooms(roomData);
    } catch (error) {
      console.error("Błąd przy pobieraniu listy pokoi: ", error);
    }

    // Następnie pobierz listę życzeń użytkownika
    try {
      const wishlistResponse = await fetch(
        `http://localhost:3000/users/wishlist/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!wishlistResponse.ok) {
        throw new Error("Problem z pobieraniem listy życzeń");
      }
      const wishlistData = await wishlistResponse.json();
      setWishlist(wishlistData);
    } catch (error) {
      console.error("Błąd przy pobieraniu listy życzeń: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("userId: ", user._id);
      fetchRoomsAndWishlist();
    }
  }, [user]);

  const handleRemoveFromWishlist = async (roomId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/wishlist/${roomId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Przesyłanie ciasteczek sesji
        }
      );

      if (!response.ok) {
        throw new Error("Problem z usuwaniem pokoju z listy życzeń");
      }

      console.log("Pokój usunięty z listy życzeń");
      // Aktualizacja stanu bez potrzeby ponownego pobierania całej listy
      setWishlist((currentWishlist) =>
        currentWishlist.filter((room) => room._id !== roomId)
      );
      //fetchRoomsAndWishlist(); // Ponowne pobranie aktualizowanej listy życzeń
    } catch (error) {
      console.error("Błąd: ", error);
    }
  };

  return (
    <>
      <Category title="Twoja Lista Życzeń:">
        <div>
          {wishlist.map((room) => (
            <div key={room._id}>
              <h3>{room.nazwa}</h3>
              {/* Inne informacje o pokoju */}
              <button
                onClick={() => handleRemoveFromWishlist(room._id)}
                className="button button-gradient"
              >
                Usuń z listy
              </button>
            </div>
          ))}
        </div>
      </Category>
    </>
  );
};

export default Wishlist;
