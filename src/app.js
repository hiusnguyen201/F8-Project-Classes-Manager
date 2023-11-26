require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const studentsRouter = require("./routes/students/index");
const teachersRouter = require("./routes/teachers/index");
const adminRouter = require("./routes/admin/index");

var app = express();
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await models.User.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
  });
  done(null, user);
});

passport.use("local", localPassport);

// view engine setup
app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", studentsRouter);
app.use("/teachers", teachersRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
