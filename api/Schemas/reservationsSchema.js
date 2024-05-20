const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      // Dodanie pola user do schematu
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
  },
  { versionKey: false }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
