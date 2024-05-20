require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("../Schemas/userSchema");

const router = express.Router();

// Endpoint do pobierania wszystkich użytkowników
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Pobierz wszystkich użytkowników z bazy danych
    res.json(users); // Wyślij dane użytkowników jako odpowiedź JSON
  } catch (error) {
    res.status(500).json({ message: error.message }); // W przypadku błędu wyślij informacje o błędzie
  }
});

// Rejestracja nowego użytkownika
// router.post("/register", async (req, res) => {
//   try {
//     // Hashowanie hasła przed zapisaniem użytkownika
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newUser = new User({
//       ...req.body,
//       password: hashedPassword,
//     });
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

router.post("/register", async (req, res) => {
  try {
    // Hashowanie hasła przed zapisaniem użytkownika
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      // Błąd unikalności
      res.status(409).json({ message: "Username or email already exists." });
    } else {
      // Inne błędy
      res.status(400).json({ message: error.message });
    }
  }
});

// Logowanie użytkownika
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Nie znaleziono użytkownika." });
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Nieprawidłowe hasło." });
    }

    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    res.json({
      message: "Użytkownik zalogowany",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pobieranie danych użytkownika
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Aktualizacja danych użytkownika
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Usuwanie konta użytkownika
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Konto użytkownika usunięte" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Dodawanie pokoju do listy życzeń
router.post("/wishlist/:roomId", async (req, res) => {
  try {
    const userIdFromSession = req.session.userId; // Pobierz identyfikator użytkownika z sesji

    // Sprawdź, czy identyfikator użytkownika jest dostępny w sesji
    if (!userIdFromSession) {
      return res.status(401).json({ message: "Brak dostępu. Zaloguj się." });
    }

    const user = await User.findById(userIdFromSession);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });
    }

    const roomId = req.params.roomId;
    if (user.wishlist.includes(roomId)) {
      return res
        .status(400)
        .json({ message: "Pokój już jest na liście życzeń." });
    }

    user.wishlist.push(roomId);
    await user.save();

    return res.status(200).json({ message: "Pokój dodany do listy życzeń." });
  } catch (error) {
    console.error("Błąd:", error);
    return res.status(500).json({ message: "Wystąpił błąd serwera." });
  }
});

// Usuwanie pokoju z listy życzeń
router.delete("/wishlist/:roomId", async (req, res) => {
  try {
    const userIdFromSession = req.session.userId; // Pobierz identyfikator użytkownika z sesji

    // Sprawdź, czy identyfikator użytkownika jest dostępny w sesji
    if (!userIdFromSession) {
      return res.status(401).json({ message: "Brak dostępu. Zaloguj się." });
    }

    const user = await User.findById(userIdFromSession);
    if (!user)
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });

    const roomId = req.params.roomId;
    user.wishlist = user.wishlist.filter((id) => id.toString() !== roomId);
    await user.save();
    res.status(200).json({ message: "Pokój usunięty z listy życzeń." });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera." });
  }
});

// Pobieranie listy życzeń użytkownika
router.get("/wishlist/:userId", async (req, res) => {
  try {
    // Sprawdź, czy użytkownik jest zalogowany
    if (!req.session.userId) {
      return res.status(401).json({ message: "Brak dostępu. Zaloguj się." });
    }

    const userId = req.params.userId;
    const user = await User.findById(userId).populate("wishlist");

    if (!user)
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });

    // Możesz dodatkowo sprawdzić, czy użytkownik ma dostęp do własnej listy życzeń,
    // jeśli nie jest to jego profil
    if (user._id.toString() !== req.session.userId) {
      return res
        .status(403)
        .json({ message: "Brak dostępu do listy życzeń innego użytkownika." });
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error(error); // Logowanie błędu w konsoli serwera dla celów debugowania
    res.status(500).json({
      message: "Wystąpił błąd serwera.",
      error: error.message, // Przekazywanie komunikatu błędu
      stack: error.stack, // Przekazywanie stosu wywołań (opcjonalnie)
    });
  }
});

module.exports = router;
