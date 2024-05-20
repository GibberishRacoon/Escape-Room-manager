const express = require("express");
const Review = require("../Schemas/reviewsSchema");
const router = express.Router();
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const upload = multer({ dest: "uploads/" }); // Folder tymczasowy na przesyłane pliki

// Pobieranie wszystkich opinii
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Dodawanie nowej opinii
router.post("/", async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Schemat walidacji Joi, który odpowiada schematowi Mongoose
const joiReviewSchema = Joi.object({
  user: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "Object ID validation"),
  room: Joi.string()
    .allow(null)
    .custom((value, helpers) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value; // null jest dopuszczalne, ponieważ 'room' nie jest wymagane
    }, "Object ID validation"),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required(),
  // Usuń default dla createdAt, MongoDB automatycznie doda pole z datą, jeśli nie jest ono podane
});

// Endpoint do importowania opinii z pliku JSON
router.post("/import", upload.single("file"), async (req, res) => {
  // Logowanie pliku - to jest dobre miejsce, aby zobaczyć co otrzymujesz
  console.log(req.file);

  // Sprawdzenie czy plik został przesłany
  if (!req.file) {
    return res.status(400).send("Nie przesłano pliku.");
  }

  try {
    // Odczytanie danych z pliku
    const fileData = await fs.readFile(req.file.path);
    const reviewsData = JSON.parse(fileData);

    // Sprawdzenie czy dane są w formacie tablicy
    if (!Array.isArray(reviewsData)) {
      throw new Error("Dane muszą być tablicą opinii.");
    }

    // Walidacja i przygotowanie danych do importu
    const validatedReviews = [];
    for (const reviewData of reviewsData) {
      const { error, value } = joiReviewSchema.validate(reviewData);
      if (error) {
        throw new Error(`Błąd walidacji: ${error.details[0].message}`);
      }
      validatedReviews.push(value);
    }

    // Wstawienie przewalidowanych danych do bazy
    const savedReviews = await Review.insertMany(validatedReviews);
    res.status(201).json(savedReviews);
  } catch (error) {
    // Obsługa błędu
    res.status(500).send(error.message);
  } finally {
    // Usunięcie pliku w bloku finally, aby upewnić się, że zostanie to wykonane tylko raz
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
        console.log("plik usunieto");
      } catch (err) {
        // Logujemy błąd, ale nie przerywamy działania, bo to tylko sprzątanie
        console.error("Nie udało się usunąć pliku: ", err);
      }
    }
  }
});

// Edycja opinii
router.put("/:id", async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedReview);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Usuwanie opinii
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Opinia została usunięta" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
