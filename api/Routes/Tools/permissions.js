const express = require("express");
const User = require("../../Schemas/userSchema");
const router = express.Router();

// Funkcja do pobierania listy użytkowników z ich uprawnieniami
async function getPermissionsList() {
  try {
    const usersWithPermissions = await User.find().select(
      "firstName lastName isAdmin"
    );
    return usersWithPermissions;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Funkcja do aktualizacji uprawnień użytkownika
async function updateUserPermissions(id, isAdmin) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isAdmin },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getPermissionsList,
  updateUserPermissions,
};

// // Endpoint do listy uprawnień użytkowników
// router.get("/", async (req, res) => {
//   try {
//     const usersWithPermissions = await User.find().select(
//       "firstName lastName isAdmin"
//     );
//     res.json(usersWithPermissions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Endpoint do aktualizacji uprawnień użytkownika
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { isAdmin } = req.body; // Zakładamy, że uprawnienia są wysyłane w body requestu

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { isAdmin },
//       { new: true }
//     );
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
