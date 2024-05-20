const express = require("express");
const router = express.Router();
const User = require("../../Schemas/userSchema");
const Room = require("../../Schemas/roomSchema");
const Reservation = require("../../Schemas/reservationsSchema");

async function getAvailableRooms(startDate, endDate, capacity) {
  try {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const roomCapacity = capacity ? parseInt(capacity) : null;

    const searchQuery = {
      capacity: roomCapacity,
      reservations: {
        $not: {
          $elemMatch: {
            startDate: { $lt: end },
            endDate: { $gt: start },
          },
        },
      },
    };

    if (!roomCapacity) delete searchQuery.capacity;
    if (!start || !end) delete searchQuery.reservations;

    return await Room.find(searchQuery);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getUserActivityAndReservations(userId) {
  try {
    const user = await User.findById(userId);
    const userActivity = user.activity;

    const userReservations = await Reservation.find({ user: userId });

    return {
      userActivity,
      userReservations,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getAvailableRooms,
  getUserActivityAndReservations,
};

// // Endpoint do wyszukiwania pokojów z zaawansowanymi filtrami
// router.get("/", async (req, res) => {
//   const { startDate, endDate, capacity } = req.query;

//   try {
//     // Przygotowanie dat w odpowiednim formacie, jeśli są dostarczone
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;
//     const roomCapacity = capacity ? parseInt(capacity) : null;

//     // Logika wyszukiwania pokojów, które nie mają rezerwacji kolidujących z podanymi datami i mają określoną pojemność
//     const searchQuery = {
//       capacity: roomCapacity,
//       // Załóżmy, że mamy pole reservations, które jest tablicą zarezerwowanych terminów
//       reservations: {
//         // $not przeciwdziała dopasowaniu warunków, więc znajdzie pokoje bez rezerwacji w danym okresie
//         $not: {
//           $elemMatch: {
//             startDate: { $lt: end },
//             endDate: { $gt: start },
//           },
//         },
//       },
//     };

//     // Odfiltrowanie pokoi, które nie spełniają kryteriów pojemności i dostępności
//     if (!roomCapacity) delete searchQuery.capacity;
//     if (!start || !end) delete searchQuery.reservations;

//     const availableRooms = await Room.find(searchQuery);

//     res.json(availableRooms);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Błąd podczas wyszukiwania pokojów: " + error.message });
//   }
// });

// // Endpoint do historii rezerwacji i działań użytkownika
// router.get("/:id/activity", async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Znajdź użytkownika i jego historię aktywności
//     const user = await User.findById(id);
//     const userActivity = user.activity; // Przy założeniu, że pole 'activity' istnieje w schemacie użytkownika

//     // Znajdź rezerwacje dokonane przez użytkownika
//     const userReservations = await Reservation.find({ user: id });

//     // Połącz informacje w jeden obiekt odpowiedzi
//     const response = {
//       userActivity,
//       userReservations,
//     };

//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
