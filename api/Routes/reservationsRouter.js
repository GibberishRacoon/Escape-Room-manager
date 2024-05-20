const express = require("express");
const Room = require("../Schemas/roomSchema");
const User = require("../Schemas/userSchema");
const Reservation = require("../Schemas/reservationsSchema");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// Middleware walidacji dla tworzenia rezerwacji
const reservationValidationRules = () => {
  return [
    check("room", "Pokój jest wymagany").notEmpty(),
    check("user", "Użytkownik jest wymagany").notEmpty(),
    check("startDate", "Data rozpoczęcia jest wymagana").notEmpty().isISO8601(),
    check("endDate", "Data zakończenia jest wymagana").notEmpty().isISO8601(),
    check(
      "startDate",
      "Data rozpoczęcia musi być wcześniejsza niż data zakończenia"
    ).custom((value, { req }) => {
      return new Date(value) < new Date(req.body.endDate);
    }),
  ];
};

// Funkcja do obsługi błędów walidacji
const validateReservation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("room")
      .populate("user");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { room, date, user } = req.body; // Odbierz tylko pola "room" i "date" z żądania

    // Tutaj możesz dodać walidację pól "room" i "date", jeśli jest to wymagane

    const newReservation = new Reservation({
      room,
      date,
      user,
      status: "active", // Dodaj domyślny status, jeśli jest wymagany
    });

    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("room")
      .populate("user");
    if (!reservation) {
      return res.status(404).json({ message: "Rezerwacja nie znaleziona" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(
  "/:id",
  reservationValidationRules(),
  validateReservation,
  async (req, res) => {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!reservation) {
        return res.status(404).json({ message: "Rezerwacja nie znaleziona" });
      }
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Rezerwacja nie znaleziona" });
    }
    reservation.status = "cancelled";
    await reservation.save();
    res.json({ message: "Rezerwacja anulowana" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do podsumowania rezerwacji w danym miesiącu
router.get("/reservations-summary/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  // Ustawienie daty początkowej i końcowej dla danego miesiąca
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  try {
    const summary = await Reservation.aggregate([
      {
        $match: {
          startDate: { $gte: startDate },
          endDate: { $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
          totalReservations: { $sum: 1 },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          totalCancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sortowanie wyników po dacie
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
