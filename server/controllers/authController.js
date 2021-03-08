const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

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

  const { username, email, password, avatar } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Rejestracja nie powiodła się, spróbuj ponownie później.",
      500
    );

    return next(error);
  }

  if (existingUser) {
    console.log(existingUser);
    const error = new HttpError(
      "Taki użytkownik już istnieje, jeśli to ty zaloguj się.",
      422
    );

    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Nie mogliśmy utworzyć takiego użytkownika proszę spróbuj ponownie",
      500
    );

    return next(error);
  }

  let createdUser = new User({
    email,
    username,
    avatar, ///req.file.path
    password: hashedPassword,
    objects: [],
    favoriteObjects: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(createdUser);
    const error = new HttpError(
      "Rejestracja nie powiodła się, spróbuj ponownie później.",
      500
    );

    return next(error);
  }

  res.send("Konto zostało utworzone!");
};

const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("Sprawdź login lub hasło!");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
};

const getUser = async (req, res) => {
  let userID = req.session.passport;
  res.send(userID); // The req.user stores the entire user that has been authenticated inside of it.
};

exports.getUser = getUser;
exports.login = login;
exports.register = signup;
