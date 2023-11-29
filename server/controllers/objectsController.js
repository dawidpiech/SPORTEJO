const Category = require("./../models/category");
const Days = require("./../models/day");
const Amenities = require("./../models/amenities");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const Object = require("./../models/object");
const User = require("./../models/user");
const HttpError = require("../models/http-error");
var mongoose = require("mongoose");
const object = require("./../models/object");
const { ObjectID } = require("bson");
const { response } = require("express");

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

const getCategories = async (req, res) => {
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

  let user = await User.findOne({ _id: req.body.userID });

  try {
    await createdObject.save();
    user.objects.push(createdObject);
    await user.save();
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

const getFavoritesObject = async (req, res, next) => {
  const user = await Object.find({ _id: req.body.userID });
  const objects = await Object.find({ _id: user.objects });

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

const getObjectsByParams = async (req, res, next) => {
  let data = {
      name: req.body.name ? req.body.name : "",
      city: req.body.city ? req.body.city : "",
      priceFrom: req.body.priceFrom ? req.body.priceFrom : "",
      priceTo: req.body.priceTo ? req.body.priceTo : "",
      category: req.body.category
        ? !Array.isArray(req.body.category)
          ? [req.body.category]
          : req.body.category
        : [],
    },
    objects = [];

  if (data.category.length > 0) {
    try {
      objects = await Object.find({
        categories: {
          $in: data.category.map((e) => mongoose.Types.ObjectId(e)),
        },
      });
    } catch (err) {
      const error = new HttpError(
        "Coś poszło nie tak spróbuj ponownie później",
        500
      );
      return next(error);
    }
  } else {
    objects = await Object.find();
  }

  if (data.name !== "")
    objects = objects.filter((e) => e.name.includes(data.name));
  if (data.city !== "") objects = objects.filter((e) => e.city === data.city);
  if (data.priceFrom !== "")
    objects = objects.filter((e) => e.pricePerHour >= data.priceFrom);
  if (data.priceTo !== "")
    objects = objects.filter((e) => e.pricePerHour <= data.priceTo);

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

const addObjectToFavorites = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user });
  let object = await Object.findOne({ _id: req.body.object });

  try {
    user.favoriteObjects.push(object);
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Zapisywanie w bazie danych nie powiodło się, proszę spróbuj ponownie",
      500
    );

    return next(error);
  }
};

const removeObjectFromFavorites = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user });

  let removed = user.favoriteObjects.filter(
    (x) => x.toString() !== req.body.object
  );

  user.favoriteObjects = [...removed];

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Coś poszło nie tak spróbuj ponownie później",
      500
    );
    return next(error);
  }

  res.send("Obiekt został usuniety z ulubionych.");
};

const getFavoritesObjects = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user });
  const objects = [];

  for (const object of user.favoriteObjects) {
    let a = await Object.find({
      _id: { $all: mongoose.Types.ObjectId(object) },
    });
    objects.push(a[0]);
  }

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

const removeObject = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user });

  let removed = user.objects.filter((x) => x.toString() !== req.body.object);

  user.objects = [...removed];

  try {
    await user.save();
    await Object.deleteOne({ _id: req.body.object });
  } catch (err) {
    const error = new HttpError(
      "Coś poszło nie tak spróbuj ponownie później",
      500
    );
    return next(error);
  }

  res.send("Obiekt został usunięty.");
};

const getUserObjects = async (req, res, next) => {
  let user = await User.findOne({ _id: req.body.user });
  const objects = [];

  if (user && user.objects !== null) {
    for (const object of user.objects) {
      let a = await Object.find({
        _id: { $all: mongoose.Types.ObjectId(object) },
      });
      objects.push(a[0]);
    }

    for (const [index, object] of objects.entries()) {
      const day = await Days.find({ _id: object.openingDays });
      const amenities = await Amenities.find({ _id: object.amenities });
      const categories = await Category.find({ _id: object.categories });

      objects[index].openingDays = day;
      objects[index].amenities = amenities;
      objects[index].categories = categories;
    }
  }
  res.send(objects);
};

const getObject = async (req, res, next) => {
  let object;
  try {
    object = await Object.findOne({ _id: req.body.object });
  } catch (err) {
    const error = new HttpError(
      "Coś poszło nie tak spróbuj ponownie później",
      500
    );
    return next(error);
  }

  const day = await Days.find({ _id: object.openingDays });
  const amenities = await Amenities.find({ _id: object.amenities });
  const categories = await Category.find({ _id: object.categories });

  object.openingDays = day;
  object.amenities = amenities;
  object.categories = categories;

  res.send(object);
};

exports.getCategories = getCategories;
exports.getDays = getDays;
exports.getAmenities = getAmenities;
exports.uploadPhotos = uploadPhotos;
exports.addObject = addObject;
exports.getAllObjects = getAllObjects;
exports.getFavoritesObject = getFavoritesObject;
exports.getObjectsByParams = getObjectsByParams;
exports.addObjectToFavorites = addObjectToFavorites;
exports.removeObjectFromFavorites = removeObjectFromFavorites;
exports.getFavoritesObjects = getFavoritesObjects;
exports.removeObject = removeObject;
exports.getUserObjects = getUserObjects;
exports.getObject = getObject;
