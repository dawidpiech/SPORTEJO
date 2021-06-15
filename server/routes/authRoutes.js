const express = require("express");
const {
  login,
  register,
  getUser,
  logout,
  uploadAvatar,
  changePassword,
  changeAvatar,
  changeEmail,
} = require("../controllers/authController");

const router = express.Router();

//Routes
router.post("/login", login);

router.post("/register", uploadAvatar.single("avatar"), register);

router.get("/getUser", getUser);

router.get("/logout", logout);

router.post("/changePassword", changePassword);
router.post("/changeAvatar", uploadAvatar.single("avatar"), changeAvatar);
router.post("/changeEmail", changeEmail);

module.exports = router;
