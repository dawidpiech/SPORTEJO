const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  avatar: {
    type: String,
    required: true,
  },
  objects: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Object",
    },
  ],
  favoriteObjects: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Object",
    },
  ],
});

user.plugin(uniqueValidator);

module.exports = mongoose.model("User", user);
