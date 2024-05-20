const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    ocena: {
      średnia: { type: Number, default: 0 },
      liczbaOceny: { type: Number, default: 0 },
    },
    udogodnienia: [{ type: String }],
    zdjęcia: [{ type: String }],
    dostępny: { type: Boolean, default: true },
    nazwa: { type: String, required: true },
    pojemność: { type: Number, required: true },
    miasto: { type: String, required: true },
    trudność: {
      type: String,
      required: true,
      enum: ["łatwy", "średni", "trudny"],
    },
    tematyka: { type: String, required: true },
    opis: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { versionKey: false }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
