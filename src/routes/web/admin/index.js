var express = require("express");
var router = express.Router();

const dashboardRouter = require("./dashboard");
const userRouter = require("./users");
const courseRouter = require("./courses");
const teacherRouter = require("./teachers");
const studentRouter = require("./students");
const settingRouter = require("./setting");

router.get("/", dashboardRouter);
router.use("/users", userRouter);
router.use("/courses", courseRouter);
router.use("/teachers", teacherRouter);
router.use("/students", studentRouter);
router.use("/settings", settingRouter);

module.exports = router;
