var express = require("express");
var router = express.Router();
// Admin
// const { VALIDATE_USER } = require("../../../constants/validate.constant");

const HomeController = require("../../../http/controllers/web/admin/home.controller");
const SettingController = require("../../../http/controllers/web/admin/setting.controller");
const UserController = require("../../../http/controllers/web/admin/user.controller");
const TeacherController = require("../../../http/controllers/web/admin/teacher.controller");
const StudentController = require("../../../http/controllers/web/admin/student.controller");
const CourseController = require("../../../http/controllers/web/admin/course.controller");
const ClassController = require("../../../http/controllers/web/admin/class.controller");

const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");

const validator = require("../../../utils/validator");

// ---------------------- Home ---------------------------
router.get("/", HomeController.index);

// ---------------------- Users ---------------------------
router.get("/users", UserController.index);
router.post(
  "/users",
  csrf.verify,
  // validator.validateRequest(["name", "email", "phone"], VALIDATE_USER),
  UserController.handleCreateUser
);
router.patch("/users", csrf.verify, UserController.handleUpdateUser);
router.delete("/users", csrf.verify, UserController.handleDeleteUsers);

router.get("/users/import", UserController.importUsersPage);
router.post(
  "/users/import",
  fileMiddleware,
  validator.validateFile("excel"),
  UserController.handleImportUsers
);
router.get("/users/export", UserController.handleExportUsers);

// ---------------------- Courses ---------------------------
router.get("/courses", CourseController.index);
router.post("/courses", csrf.verify, CourseController.handleCreateCourse);
router.patch("/courses", csrf.verify, CourseController.handleUpdateCourse);
router.delete("/courses", csrf.verify, CourseController.handleDeleteCourses);

router.get("/courses/import", CourseController.importCoursesPage);
router.post(
  "/courses/import",
  fileMiddleware,
  validator.validateFile("excel"),
  CourseController.handleImportCourses
);
router.get("/courses/export", CourseController.handleExportCourses);

// ---------------------- Teachers ---------------------------
router.get("/teachers", TeacherController.index);
router.post("/teachers", csrf.verify, TeacherController.handleCreateTeacher);
router.patch("/teachers", csrf.verify, TeacherController.handleUpdateTeacher);
router.delete("/teachers", csrf.verify, TeacherController.handleDeleteTeachers);

router.get("/teachers/import", TeacherController.importTeachersPage);
router.post(
  "/teachers/import",
  fileMiddleware,
  validator.validateFile("excel"),
  TeacherController.handleImportTeachers
);
router.get("/teachers/export", TeacherController.handleExportTeachers);

// ---------------------- Students ---------------------------
router.get("/students", StudentController.index);
router.post("/students", csrf.verify, StudentController.handleCreateStudent);
router.patch("/students", csrf.verify, StudentController.handleUpdateStudent);
router.delete("/students", csrf.verify, StudentController.handleDeleteStudents);

router.get("/students/import", StudentController.importStudentsPage);
router.post(
  "/students/import",
  fileMiddleware,
  validator.validateFile("excel"),
  StudentController.handleImportStudents
);
router.get("/students/export", StudentController.handleExportStudents);

// ---------------------- Classes ---------------------------
router.get("/classes", ClassController.index);
router.post("/classes", csrf.verify, ClassController.handleCreateClass);

// router.patch(
//   "/classes",
//   csrf.verify,
//   ClassController.handleUpdateClass
// );
// router.delete(
//   "/classes",
//   csrf.verify,
//   ClassController.handleDeleteClasses
// );

// router.get("/classes/import", ClassController.importClassesPage);
// router.post(
//   "/classes/import",
//   fileMiddleware,
//   validator.validateFile("excel"),
//   ClassController.handleImportClasses
// );
// router.get("/classes/export", ClassController.handleExportClasses);

// ---------------------- Setting ---------------------------
router.get("/settings", SettingController.settings);

router.get("/settings/profile", SettingController.settings);
router.patch(
  "/settings/profile",
  csrf.verify,
  SettingController.handleUpdateProfile
);

router.get("/settings/security", SettingController.settings);
router.delete(
  "/settings/security",
  csrf.verify,
  SettingController.handleRemoveUserSocial
);

router.get("/settings/password", SettingController.settings);
router.patch(
  "/settings/password",
  csrf.verify,
  SettingController.handleChangePassword
);
module.exports = router;
