import React, { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import Category from "../category/category";
import RoomAddForm from "../common/rooms/RoomAddForm";

export const AdminDashboardComponents = ({ fetchRooms }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    userStats: [],
    roomStats: [],
    reservationStats: [],
    permissionsList: [],
  });
  const dashboardRef = useRef(null);

  useEffect(() => {
    // Sprawdź, czy użytkownik jest administratorem przed pobraniem danych
    if (user && user.isAdmin) {
      const fetchStats = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/dashboard/admin",
            {
              method: "GET",
              credentials: "include",
            }
          );
          const text = await response.text();
          //console.log(text); sprawdzanie czy przesyla
          const data = JSON.parse(text);
          setStats(data);
        } catch (error) {
          console.error("Błąd podczas pobierania danych statystycznych", error);
        }
      };

      fetchStats();
    }
  }, [user]); // Dodaj 'user' do listy zależności, aby useEffect był wywoływany przy zmianie użytkownika

  if (!user || !user.isAdmin) {
    // Renderuj coś innego lub null, jeśli użytkownik nie jest administratorem
    return <div>Nie masz uprawnień do przeglądania tej strony</div>;
  }

  //dodwawanie pokoju
  const handleAddRoom = async (newRoomData) => {
    try {
      const response = await fetch("http://localhost:3000/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newRoomData),
      });

      if (!response.ok) {
        throw new Error("Problem z dodaniem pokoju");
      }

      const addedRoom = await response.json();
      console.log("Pokój dodany:", addedRoom);
      fetchRooms();
      // Tutaj możesz zaktualizować stan aplikacji, aby odzwierciedlić dodanie nowego pokoju
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <Category title="Admin Dashboard">
      <div className="dashboard" ref={dashboardRef}>
        <div className="users">
          <h3>Statystyki Użytkowników</h3>

          <div className="list">
            {/* Tutaj możesz wyświetlić swoje statystyki, na przykład w tabelach lub diagramach */}

            {/* Przykład renderowania userStats */}
            <ul>
              {stats.userStats.map((user, index) => (
                <li
                  key={index}
                >{`${user.username}: ${user.totalLogins} logins`}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rooms">
          <h3>Popularność Pokoi</h3>
          <div className="list">
            {/* Przykład renderowania roomStats */}
            <ul>
              {stats.roomStats.map((room, index) => (
                <li
                  key={index}
                >{`Pokój ${room._id}: ${room.completed} completed, ${room.cancelled} cancelled`}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="roomsAddForm">
          <h3>Dodaj pokój</h3>
          {user.isAdmin && <RoomAddForm onSubmit={handleAddRoom} />}
        </div>
      </div>
      {/* Podobnie możesz wyświetlać inne dane, takie jak reservationStats i permissionsList */}
    </Category>
  );
};
