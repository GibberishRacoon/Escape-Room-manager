const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    birthDate: { type: Date },
    isAdmin: { type: Boolean, default: false },
    activity: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
