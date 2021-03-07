const express = require("express");
const { login, register, getUser } = require("../controllers/authController");

const router = express.Router();

//Routes
router.post("/login", login);

router.post("/register", register);

router.get("/getUser", getUser);

module.exports = router;
