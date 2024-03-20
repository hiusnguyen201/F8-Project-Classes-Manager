var express = require("express");
var router = express.Router();

const dashboardRouter = require("./dashboard");
const userRouter = require("./users");
const courseRouter = require("./courses");
const teacherRouter = require("./teachers");
const studentRouter = require("./students");
const classRouter = require("./classes");
const settingRouter = require("./setting");

router.use("/", dashboardRouter);
router.use("/users", userRouter);
router.use("/courses", courseRouter);
router.use("/teachers", teacherRouter);
router.use("/students", studentRouter);
router.use("/classes", classRouter);
router.use("/settings", settingRouter);

module.exports = router;
