// Dashboard.jsx
import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { AdminDashboardComponents } from "./AdminDashboardComponents";
import UserDashboardComponents from "./UserDashboardComponents";
import Topbar from "../common/topbar/Topbar";
import RoomSearch from "../common/rooms/RoomSearch";
import ReservationForm from "../common/reservation/ReservationForm";
import ReviewsSection from "../common/reviews/ReviewsSection";
import Wishlist from "../wishlist/Wishlist";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isRoomSearchOnDashboard, setIsRoomSearchOnDashboard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Adres URL API powinien być zależny od tego, czy zalogowany jest admin, czy użytkownik
        const endpoint = user.isAdmin
          ? "http://localhost:3000/dashboard/admin"
          : "http://localhost:3000/dashboard/user";

        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError("Błąd podczas pobierania danych dashboardu: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleRoomSearch = () => {
    setIsRoomSearchOnDashboard((prevState) => !prevState);
  };

  if (loading) {
    return <div>Ładowanie danych...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  return (
    <div className="main">
      <Topbar />
      {/* <Sidebar
        isVisible={isSidebarVisible}
        toggleRoomSearch={toggleRoomSearch}
      /> */}
      <div className={"content"}>
        {dashboardData && user.isAdmin ? (
          <AdminDashboardComponents data={dashboardData} />
        ) : (
          <UserDashboardComponents data={dashboardData} className="category" />
        )}
        {isRoomSearchOnDashboard && <RoomSearch />}
        <ReservationForm />
        <ReviewsSection />
        <Wishlist />
      </div>
    </div>
  );
};

export default Dashboard;
