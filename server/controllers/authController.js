const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const signup = async (req, res, next) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) {
      res.send("Coś poszło nie tak! Proszę spróbuj ponownie później :)");
      throw err;
    }
    if (doc) res.send("Taki użytkownik już istnieje w bazie danych!");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword.toString(),
      });

      await newUser.save();
      res.send("Konto zostało utworzone!");
    }
  });
};

const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
};

const getUser = async (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
};

exports.getUser = getUser;
exports.login = login;
exports.register = signup;
