const { Op } = require("sequelize");
const { MESSAGE_ERROR } = require("../../constants/message.constant");
const { LIMIT_PAGE } = require("../../constants/setting.constant");

const fileExcel = require("../../utils/fileExcel");
const momentUtil = require("../../utils/moment");

const models = require("../../models/index");

const UserService = require("./user.service");
const userService = new UserService();

class CourseService {
  constructor() {
    this.Course = models.Course;
    this.User = models.User;
  }

  async findAllWithSearchAndPaginate(queryString) {
    let { page = 1, limit = 10, keyword } = queryString;

    const filters = {};
    if (keyword) {
      filters[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    const count = await this.Course.count({
      where: filters,
    });

    limit = LIMIT_PAGE.includes(+limit) ? +limit : 10;
    const totalPage = Math.ceil(count / +limit);
    if (+page < 1 || +page > totalPage) {
      page = 1;
    }
    const offset = (+page - 1) * +limit;

    const courses = await this.Course.findAll({
      where: filters,
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
      offset,
      limit,
    });

    return {
      meta: { page, offset, totalPage, limit, count },
      data: courses,
    };
  }

  async findAll() {
    const courses = await this.Course.findAll({
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
    });

    return courses;
  }

  async findById(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) return null;
    console.log(id);

    const course = await this.Course.findOne({
      where: { id },
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
    });

    return course;
  }

  async findByNameAndTeacherId(name, teacherId) {
    if (!name || !teacherId) return null;

    const course = await this.Course.findOne({
      where: {
        name,
        teacherId,
      },
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
      paranoid: false,
    });

    return course ? course : null;
  }

  async create(data) {
    const existCourse = await this.findByNameAndTeacherId(
      data.name,
      data.teacherId
    );

    if (existCourse) {
      throw new Error(MESSAGE_ERROR.COURSE.COURSE_EXISTED);
    }

    delete data.csrfToken;
    const course = await this.Course.create({
      ...data,
    });

    if (course) {
      return course;
    }
  }

  async update(data, id) {
    const course = await this.findById(id);

    if (!course) {
      throw new Error(MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND);
    }

    const status = await course.update({
      ...data,
      updatedAt: momentUtil.getDateNow(),
    });

    return status;
  }

  async removeCourses(listId) {
    const courses = await this.Course.findAll({
      where: {
        id: {
          [Op.in]: listId,
        },
      },
    });

    if (courses?.length !== listId.length) {
      throw new Error(MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND);
    }

    const status = await this.Course.destroy({
      where: {
        id: {
          [Op.in]: listId,
        },
      },
    });

    return status;
  }

  async importCourses(fileInfo, courseFields) {
    const [dataArr, message] = await fileExcel.readFile(fileInfo, courseFields);

    if (!dataArr) throw new Error(message);

    await Promise.all(
      dataArr.map(async (data) => {
        const teacher = await userService.findByEmail(data.teacher);
        if (teacher && teacher.Type.name === "teacher") {
          return await this.create(
            data.name,
            data.price,
            teacher.id,
            data.tryLearn,
            data.quantity,
            data.duration
          );
        }
      })
    );
  }
}

module.exports = CourseService;
