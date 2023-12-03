require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
var methodOverride = require("method-override");
var helmet = require("helmet");

const models = require("./models/index");

// Passport
const localPassport = require("./helpers/passports/local.passport");
const googlePassport = require("./helpers/passports/google.passport");
const githubPassport = require("./helpers/passports/github.passport");
const facebookPassport = require("./helpers/passports/facebook.passport");

// Middleware
const TokenMiddleware = require("./http/middlewares/token.middleware");
const TypeMiddleware = require("./http/middlewares/type.middeware");

// Route
const studentsRouter = require("./routes/students/index");
const teachersRouter = require("./routes/teachers/index");
const adminRouter = require("./routes/admin/index");
const authRouter = require("./routes/auth/index");

var app = express();
// app.use(helmet());
app.disable("x-powered-by");

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
passport.serializeUser((id, done) => {
  done(null, id);
});
passport.deserializeUser(async (id, done) => {
  const user = await models.User.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
    include: models.Type,
  });
  done(null, user);
});

passport.use("local", localPassport);
passport.use("google", googlePassport);
passport.use("github", githubPassport);
passport.use("facebook", facebookPassport);

// view engine setup
app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main.layout.ejs");
app.set("authLayout", "layouts/auth.layout.ejs");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use("/auth", authRouter);

app.use(TokenMiddleware);
app.use(TypeMiddleware);
app.use("/", studentsRouter);
app.use("/teacher", teachersRouter);
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
