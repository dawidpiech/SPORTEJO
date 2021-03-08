const mongoose = require("mongoose");

const convenience = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Convenience", convenience);
