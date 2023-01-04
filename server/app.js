const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const session = require("express-session");

const path = require("path");

const authRoutes = require("./routes/authRoutes");
const objectsRoutes = require("./routes/objectsRoutes");
const AppError = require("./utils/appError");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: ["https://sportejo.piech.it", "http://localhost:3001", "http://localhost:3000"], // <-- location of the react app were connecting to
    credentials: true,
  })
);


app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(require("cookie-parser")());
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: true }));

// 3) ROUTES
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many request from your IP, to avoid attacks please try again later!",
});

app.use("/uploads/avatars", express.static(path.join("uploads", "avatars")));
app.use(
  "/uploads/objectImages",
  express.static(path.join("uploads", "objectImages"))
);
app.use(
  "/images/categories",
  express.static(path.join("images", "categories"))
);

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/objects", objectsRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
