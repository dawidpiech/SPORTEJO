const mongoose = require("mongoose");

const object = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  ],
  photos: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  openingHour: {
    type: String,
    required: true,
  },
  closingTime: {
    type: String,
    required: true,
  },
  amenities: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Amenities",
    },
  ],
  openingDays: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Day",
    },
  ],
});

module.exports = mongoose.model("Object", object);
