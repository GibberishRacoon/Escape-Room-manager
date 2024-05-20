const express = require("express");
const Voucher = require("../Schemas/voucherSchema");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tworzenie vouchera
router.post("/", async (req, res) => {
  try {
    const newVoucher = new Voucher(req.body);
    const savedVoucher = await newVoucher.save();
    res.status(201).json(savedVoucher);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Sprawdzanie statusu vouchera
router.get("/:code", async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code });
    if (!voucher) {
      return res.status(404).json({ message: "Voucher nie znaleziony" });
    }
    res.json(voucher);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint do aktualizacji vouchera
router.put("/:id", async (req, res) => {
  try {
    const voucherId = req.params.id;
    const updatedData = req.body;

    // Aktualizacja vouchera w bazie danych
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      updatedData,
      { new: true }
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.json(updatedVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do usuwania vouchera
router.delete("/:id", async (req, res) => {
  try {
    const voucherId = req.params.id;

    // Usunięcie vouchera z bazy danych
    const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);

    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.json({ message: "Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
