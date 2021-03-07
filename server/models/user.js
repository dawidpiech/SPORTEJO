const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema({
  mail: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Without name we wont know who you are !"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
  },
  avatar: {
    type: String,
  },
});

module.exports = mongoose.model("User", user);
