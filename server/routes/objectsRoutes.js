const express = require("express");
const {
  getCategories,
  getDays,
  getAmenities,
  uploadPhotos,
  addObject,
} = require("./../controllers/objectsController");

const router = express.Router();

//Routes
router.get("/getCategories", getCategories);
router.get("/getDays", getDays);
router.get("/getAmenities", getAmenities);
router.post(
  "/addObject",
  uploadPhotos.array("uploadedImages", 10),
  function (req, res) {
    var file = req.files;
    console.log(file);
    res.end();
  }
);

module.exports = router;
