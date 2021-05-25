const express = require("express");
const {
  login,
  register,
  getUser,
  logout,
} = require("../controllers/authController");

const router = express.Router();

//Routes
router.post("/login", login);

router.post("/register", register);

router.get("/getUser", getUser);

router.get("/logout", logout);

module.exports = router;
