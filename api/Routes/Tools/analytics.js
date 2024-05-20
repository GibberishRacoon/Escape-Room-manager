const express = require("express");
const User = require("../../Schemas/userSchema");
const Reservation = require("../../Schemas/reservationsSchema");
const router = express.Router();

// Funkcja do pobierania statystyk aktywności użytkowników
async function getUserActivityStats() {
  try {
    const userActivityStats = await User.aggregate([
      {
        $unwind: "$activity",
      },
      {
        $group: {
          _id: "$_id",
          totalLogins: {
            $sum: {
              $cond: [{ $eq: ["$activity.action", "Login"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          username: "$userDetails.username",
          totalLogins: 1,
        },
      },
    ]);
    return userActivityStats; // Zwraca wynik agregacji
  } catch (error) {
    throw new Error(error.message); // Rzuca błąd, który można obsłużyć w miejscu wywołania funkcji
  }
}

// Funkcja do analizy popularności pokojów
async function getRoomPopularity() {
  try {
    const roomPopularity = await Reservation.aggregate([
      {
        $group: {
          _id: "$room",
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
        },
      },
      // Tutaj możesz kontynuować z innymi krokami agregacji, takimi jak $lookup, $unwind, $project
    ]);
    return roomPopularity; // Zwraca wynik agregacji
  } catch (error) {
    throw new Error(error.message); // Rzuca błąd, który można obsłużyć w miejscu wywołania funkcji
  }
}

module.exports = {
  getUserActivityStats,
  getRoomPopularity,
};

// // Endpoint do statystyk użytkowników
// router.get("/users", async (req, res) => {
//   try {
//     const userActivityStats = await User.aggregate([
//       {
//         $unwind: "$activity",
//       },
//       {
//         $group: {
//           _id: "$_id",
//           totalLogins: {
//             $sum: {
//               $cond: [{ $eq: ["$activity.action", "Login"] }, 1, 0],
//             },
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "_id",
//           as: "userDetails",
//         },
//       },
//       {
//         $unwind: "$userDetails",
//       },
//       {
//         $project: {
//           _id: 0,
//           username: "$userDetails.username",
//           totalLogins: 1,
//         },
//       },
//     ]);
//     res.json(userActivityStats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
//
// // Endpoint do analizy popularności pokojów
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

// module.exports = router;
