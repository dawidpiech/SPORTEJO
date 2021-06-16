const express = require("express");
const {
  getCategories,
  getDays,
  getAmenities,
  uploadPhotos,
  addObject,
  getAllObjects,
  getFavoritesObject,
} = require("./../controllers/objectsController");

const router = express.Router();

//Routes
router.get("/getCategories", getCategories);
router.get("/getDays", getDays);
router.get("/getAmenities", getAmenities);
router.post("/addObject", uploadPhotos.array("uploadedImages", 10), addObject);
router.get("/getObjects", getAllObjects);
router.get("/getFavoritesObject", getFavoritesObject);

module.exports = router;
