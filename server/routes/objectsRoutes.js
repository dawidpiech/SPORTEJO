const express = require("express");
const {
  getCategories,
  getDays,
  getAmenities,
  uploadPhotos,
  addObject,
  getAllObjects,
  getFavoritesObject,
  getObjectsByParams,
  addObjectToFavorites,
  getFavoritesObjects,
  removeObjectFromFavorites,
  removeObject,
  getUserObjects,
  getObject,
} = require("./../controllers/objectsController");

const router = express.Router();

//Routes
router.get("/getCategories", getCategories);
router.get("/getDays", getDays);
router.get("/getAmenities", getAmenities);
router.post("/addObject", uploadPhotos.array("uploadedImages", 10), addObject);
router.get("/getObjects", getAllObjects);
router.get("/getFavoritesObject", getFavoritesObject);
router.post("/getObjectsByParams", getObjectsByParams);
router.post("/addObjectToFavorites", addObjectToFavorites);
router.post("/removeObjectFromFavorites", removeObjectFromFavorites);
router.post("/getFavoritesObjects", getFavoritesObjects);
router.post("/removeObject", removeObject);
router.post("/getUserObjects", getUserObjects);
router.post("/getObject", getObject);

module.exports = router;
