const Category = require("./../models/category");
const Days = require("./../models/day");
const Amenities = require("./../models/amenities");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const Object = require("./../models/object");
const HttpError = require("../models/http-error");

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
  const categories = await Category.find({});
  res.send(categories);
};

const getDays = async (req, res, next) => {
  const days = await Days.find({});
  res.send(days);
};

const getAmenities = async (req, res, next) => {
  const amenities = await Amenities.find({});
  res.send(amenities);
};

const addObject = async (req, res, next) => {
  const name = req.body.name,
    owner = req.body.userID,
    adres = req.body.adress,
    city = req.body.city,
    categories = JSON.parse(req.body.categories).map((e) => e.id),
    photos = req.files.map((e) => e.filename),
    description = req.body.description,
    email = req.body.eMail,
    phone = req.body.phoneNumber,
    price = req.body.pricePerHour,
    openFrom = req.body.openingTime,
    openTo = req.body.closingTime,
    amenities = JSON.parse(req.body.amenities).map((e) => e.id),
    openingDays = JSON.parse(req.body.openingDays).map((e) => e.id),
    categoriesArray = await Category.find({ _id: categories }),
    amenitiesArray = await Amenities.find({ _id: amenities }),
    openingDaysArray = await Days.find({ _id: openingDays });
  console.log(categoriesArray);

  let createdObject = new Object({
    owner: owner,
    name: name,
    adress: adres,
    city: city,
    categories: categoriesArray,
    photos: photos,
    description: description,
    email: email,
    phoneNumber: phone,
    pricePerHour: price,
    openingTime: openFrom,
    closingTime: openTo,
    amenities: amenitiesArray,
    openingDays: openingDaysArray,
  });

  try {
    await createdObject.save();
  } catch (err) {
    const error = new HttpError(
      "Zapisywanie w bazie danych nie powiodło się, proszę spróbuj ponownie",
      500
    );

    return next(error);
  }

  res.send("Obiekt został poprawnie dodany.");
};

const getAllObjects = async (req, res, next) => {
  const objects = await Object.find({});

  for (const [index, object] of objects.entries()) {
    const day = await Days.find({ _id: object.openingDays });
    const amenities = await Amenities.find({ _id: object.amenities });
    const categories = await Category.find({ _id: object.categories });

    objects[index].openingDays = day;
    objects[index].amenities = amenities;
    objects[index].categories = categories;
  }
  res.send(objects);
};

exports.getCategories = getCategories;
exports.getDays = getDays;
exports.getAmenities = getAmenities;
exports.uploadPhotos = uploadPhotos;
exports.addObject = addObject;
exports.getAllObjects = getAllObjects;
