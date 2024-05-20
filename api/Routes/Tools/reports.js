const express = require("express");
const User = require("../../Schemas/userSchema");
const Room = require("../../Schemas/roomSchema");
const Reservation = require("../../Schemas/reservationsSchema");
const router = express.Router();

async function getUserReservations(userId) {
  try {
    // Znajdź wszystkie rezerwacje dla danego identyfikatora użytkownika
    const reservations = await Reservation.find({ user: userId });

    // Przetwórz dane rezerwacji do bardziej przyjaznego formatu, jeśli jest to potrzebne
    const reservationsData = reservations.map((r) => ({
      id: r._id,
      room: r.room,
      startDate: r.startDate,
      endDate: r.endDate,
      status: r.status,
    }));

    return reservationsData;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Funkcja do generowania raportów o popularności pokojów
async function getRoomStats() {
  try {
    const roomStats = await Reservation.aggregate([
      {
        $group: {
          _id: "$room",
          completedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          cancelledCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
        },
      },
      // Możesz dodać więcej etapów agregacji, jeśli potrzebujesz
    ]);
    return roomStats;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Funkcja do generowania raportów o rezerwacjach
async function getReservationStats() {
  try {
    const reservationStats = await Reservation.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          users: { $addToSet: "$user" },
        },
      },
    ]);
    return reservationStats;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getRoomStats,
  getReservationStats,
  getUserReservations,
};

// // Endpoint do generowania raportów o pokojach
// router.get("/rooms", async (req, res) => {
//   try {
//     const roomPopularity = await Reservation.aggregate([
//       {
//         $group: {
//           _id: "$room",
//           completed: {
//             $sum: {
//               $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
//             },
//           },
//           cancelled: {
//             $sum: {
//               $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
//             },
//           },
//         },
//       },
//       // ... możesz kontynuować z innymi krokami agregacji, takimi jak $lookup, $unwind, $project
//     ]);

//     res.json(roomPopularity);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Endpoint do generowania raportów o rezerwacjach
// router.get("/reservations", async (req, res) => {
//   try {
//     const reservationReport = await Reservation.aggregate([
//       {
//         $group: {
//           _id: "$status",
//           count: {
//             $sum: 1,
//           },
//           users: {
//             $addToSet: "$user",
//           },
//         },
//       },
//     ]);

//     res.json(reservationReport);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
