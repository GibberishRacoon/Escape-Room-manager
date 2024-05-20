const express = require("express");
const router = express.Router();
//const { checkAdmin } = require("../Routes/roomsRouter");
const analytics = require("./Tools/analytics");
const permissions = require("./Tools/permissions");
const reports = require("./Tools/reports");
const search = require("./Tools/search");

const checkAdmin = (req, res, next) => {
  console.log("Session Data:", req.session);
  if (req.session.isAdmin) {
    return next(); // Użytkownik jest administratorem, kontynuuj
  } else {
    return res.status(403).json({
      message: "Dostęp ograniczony: wymagane uprawnienia administratora.",
    });
  }
};

// Endpoint dla dashboardu użytkownika
router.get("/dashboard/user", async (req, res) => {
  // Zakładamy, że user ID jest przechowywane w sesji
  const userId = req.session.userId;
  // Tu użyjemy endpointu z search.js do pobrania aktywności użytkownika
  const userActivity = await search.getUserActivityAndReservations(userId);
  // I z reports.js do pobrania historii rezerwacji użytkownika
  const userReservations = await reports.getUserReservations(userId); //✅
  // Skompiluj dane i zwróć w odpowiedzi
  res.json({
    activity: userActivity,
    reservations: userReservations,
  });
});

// Endpoint dla dashboardu admina
router.get("/dashboard/admin", checkAdmin, async (req, res) => {
  // Użyjemy tutaj funkcji agregacji zdefiniowanych w innych plikach routerów
  const userStats = await analytics.getUserActivityStats(); //✅
  const roomStats = await analytics.getRoomPopularity(); //✅
  const reservationStats = await reports.getReservationStats(); //✅
  const permissionsList = await permissions.getPermissionsList(); //✅
  //const availableRooms = await search.getAvailableRooms(); // To może wymagać dodatkowej logiki w search.js

  // Skompiluj dane i zwróć w odpowiedzi
  res.json({
    userStats,
    roomStats,
    reservationStats,
    permissionsList,
    //availableRooms,
  });
});

module.exports = router;
