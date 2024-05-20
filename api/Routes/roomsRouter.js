const express = require("express");
const router = express.Router();
const Room = require("../Schemas/roomSchema"); // Import modelu Room
const User = require("../Schemas/userSchema"); // Import modelu Room

// Middleware do sprawdzania, czy użytkownik jest administratorem
const checkAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next(); // Użytkownik jest administratorem, kontynuuj
  } else {
    return res.status(403).json({
      message: "Dostęp ograniczony: wymagane uprawnienia administratora.",
    });
  }
};

// Pobieranie listy wszystkich pokojów
router.get("/", async (req, res) => {
  let queryObj = {};
  if (req.query.miasto) {
    queryObj.miasto = req.query.miasto;
  }
  if (req.query.tematyka) {
    queryObj.tematyka = req.query.tematyka;
  }
  if (req.query.trudność) {
    queryObj.trudność = req.query.trudność;
  }
  try {
    const rooms = await Room.find(queryObj);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pobieranie szczegółów konkretnego pokoju na podstawie ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Próba znalezienia pokoju o ID:", req.params.id);
    const room = await Room.findById(req.params.id);
    console.log("Znaleziony pokój:", room);

    if (!room) {
      console.log("Pokój nie znaleziony.");
      return res.status(404).json({ message: "Pokój nie znaleziony." });
    }
    res.json(room);
  } catch (error) {
    console.error("Błąd podczas próby znalezienia pokoju:", error);
    res.status(500).json({ message: error.message });
  }
});

// Dodawanie nowego pokoju (tylko dla administratorów)
router.post("/", checkAdmin, async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Aktualizacja danych pokoju (tylko dla administratorów)
router.put("/:id", checkAdmin, async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Usuwanie pokoju (tylko dla administratorów)
router.delete("/:id", checkAdmin, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Pokój usunięty" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
