const express = require("express");
const { getCategories } = require("./../controllers/objectsController");

const router = express.Router();

//Routes
router.get("/getCategories", getCategories);

module.exports = router;
