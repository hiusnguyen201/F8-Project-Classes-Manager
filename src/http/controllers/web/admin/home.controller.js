const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");

const UserService = require("../../../services/user.service");
const userService = new UserService();
const CourseService = require("../../../services/course.service");
const courseService = new CourseService();
const ClassService = require("../../../services/class.service");
const classService = new ClassService();

module.exports = {
  index: async (req, res) => {
    const countAdmin = await userService.countWithType("admin");
    const countTeacher = await userService.countWithType("teacher");
    const countStudent = await userService.countWithType("student");
    const countCourse = await courseService.countAll();
    const countClass = await classService.countAll();

    return res.render(RENDER_PATH.ADMIN.HOME_ADMIN, {
      req,
      user: req.user,
      title: `Dashboard`,
      REDIRECT_PATH,
      currPage: "dashboard",
      breadcrumb: {
        items: ["Dashboard"],
      },
      countAdmin,
      countTeacher,
      countStudent,
      countCourse,
      countClass,
    });
  },
};
