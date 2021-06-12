const Category = require("./../models/category");
const Days = require("./../models/day");
const Amenities = require("./../models/amenities");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const uploadPhotos = multer({
  limits: 1000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/objectImages");
    },
    filename: (req, file, cb) => {
      const extension = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + extension);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

const getCategories = async (req, res, next) => {
  const categories = await Category.find({}).populate("categories");
  res.send(categories);
};

const getDays = async (req, res, next) => {
  const days = await Days.find({}).populate("categories");
  res.send(days);
};

const getAmenities = async (req, res, next) => {
  const amenities = await Amenities.find({}).populate("categories");
  res.send(amenities);
};

const addObject = async (req, res, next) => {
  console.log("działa");
};

exports.getCategories = getCategories;
exports.getDays = getDays;
exports.getAmenities = getAmenities;
exports.uploadPhotos = uploadPhotos;
exports.addObject = addObject;
