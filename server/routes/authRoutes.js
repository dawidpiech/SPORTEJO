const express = require("express");
const {
  login,
  register,
  getUser,
  logout,
  uploadAvatar,
} = require("../controllers/authController");

const router = express.Router();

//Routes
router.post("/login", login);

router.post("/register", uploadAvatar.single("avatar"), register);

router.get("/getUser", getUser);

router.get("/logout", logout);

module.exports = router;
