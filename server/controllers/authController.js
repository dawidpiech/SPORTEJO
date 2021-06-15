const passport = require("passport");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const User = require("../models/user");
const HttpError = require("../models/http-error");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const uploadAvatar = multer({
  limits: 1000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/avatars");
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

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Popraw błędy w formularzu, a następnie sprubuj ponownie!",
        422
      )
    );
  }

  const username = req.body.username,
    email = req.body.email,
    password = req.body.password,
    avatar = req.body.avatar;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Rejestracja nie powiodła się, spróbuj ponownie później.",
      520
    );

    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Taki użytkownik już istnieje, jeśli to ty zaloguj się.",
      430
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Nie mogliśmy utworzyć takiego użytkownika proszę spróbuj ponownie",
      502
    );

    return next(error);
  }

  let createdUser = new User({
    email,
    username,
    avatar: req.file.filename, ///req.file.path
    password: hashedPassword,
    objects: [],
    favoriteObjects: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Zapisywanie w bazie danych nie powiodło się, proszę spróbuj ponownie",
      500
    );

    return next(error);
  }

  res.send("Konto zostało utworzone! Zaloguj się.");
};

const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send({ status: false, comment: "Sprawdź login lub hasło!" });
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        let userData = {
          id: user._id,
          avatar: user.avatar,
          email: user.email,
          favoriteObjects: user.favoriteObjects,
          username: user.username,
        };
        res.send({
          status: true,
          comment: "Zalogowano poprawnie!",
          user: userData,
        });
      });
    }
  })(req, res, next);
};

const getUser = async (req, res) => {
  let userID = req.session.passport;
  let data = {
    authenticated: req.isAuthenticated(),
    user: userID.user,
  };
  res.send(data); // The req.user stores the entire user that has been authenticated inside of it.
};

const logout = async (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    return res.send({ authenticated: req.isAuthenticated() });
  });
};

const changeEmail = async (req, res, next) => {
  const user = await User.findOne({ _id: req.body.userID });
  console.log(user);

  if (req.body.email !== user.email) {
    const err = new HttpError(
      "Twój stary adres e-mail jest nieprawidłowy.",
      500
    );

    return next(err);
  }
  User.findOneAndUpdate(
    { _id: req.body.userID },
    { email: req.body.newEmail },
    function (error, result) {
      if (error) {
        const err1 = new HttpError(
          "Użytkownik o takim adresie e-mail już istnieje jeśli to ty zaloguj się.",
          500
        );

        const err2 = new HttpError(
          "Zapisywanie w bazie danych nie powiodło się, proszę spróbuj ponownie",
          500
        );

        if ((error.code = 11000)) return next(err1);
        else {
          return next(err2);
        }
      } else {
        res.send({
          status: true,
          comment: "E-mail został zmieniony!",
          email: result.email,
        });
      }
    }
  );
};

const changeAvatar = async (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.body.userID },
    { avatar: req.file.filename },
    function (error, result) {
      if (error) {
        const err = new HttpError(
          "Zapisywanie w bazie danych nie powiodło się, proszę spróbuj ponownie",
          500
        );
        return next(err);
      } else {
        res.send({
          status: true,
          comment: "Avatar został zmieniony!",
          avatar: req.file.filename,
        });
      }
    }
  );
};
const changePassword = async (req, res, next) => {
  const user = await User.findOne({ _id: req.body.userID });

  const test = await bcrypt.compare(req.body.password, user.password);

  if (req.body.newPassword !== req.body.repeatedPassword) {
    const err = new HttpError("Powtórzone hasło jest błędne.", 500);

    return next(err);
  }

  if (!test) {
    const err = new HttpError("Wpisałeś błędne hasło.", 500);

    return next(err);
  }

  User.findOneAndUpdate(
    { _id: req.body.userID },
    { password: await bcrypt.hash(req.body.newPassword, 12) },
    function (error, result) {
      if (error) {
        const err = new HttpError(
          "Zapisywanie w bazie danych nie powiodło się, proszę spróbuj ponownie",
          500
        );
        return next(err);
      } else {
        res.send({
          status: true,
          comment: "Hasło zostało poprawnie zmienione!",
          result: result,
        });
      }
    }
  );
};

exports.getUser = getUser;
exports.login = login;
exports.register = signup;
exports.logout = logout;
exports.uploadAvatar = uploadAvatar;
exports.changeEmail = changeEmail;
exports.changeAvatar = changeAvatar;
exports.changePassword = changePassword;
