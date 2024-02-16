const { Op } = require("sequelize");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} = require("../../constants/message.constant");
const { FIELDS_IMPORT } = require("../../constants/fileExcel.constant");

const fileExcel = require("../../utils/fileExcel");
const momentUtil = require("../../utils/moment");

const userService = require("./user.service");

const model = require("../../models/index");
const Course = model.Course;
const User = model.User;

module.exports = {
  countAllCourse: async (filters) => {
    try {
      const { count } = await Course.findAndCountAll({
        where: filters,
      });

      return [count, null];
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.COURSE.COUNT_COURSE_FAILED];
  },

  getAllCourse: async (filters, order, offset, limit) => {
    try {
      const options = {};

      options.include = User;

      if (filters) {
        options.where = filters;
      }

      if (order) {
        options.order = order;
      }

      if (offset) {
        options.offset = +offset;
      }

      if (limit) {
        options.limit = +limit;
      }

      const courses = await Course.findAll(options);

      if (courses?.length) {
        return [courses, null];
      } else {
        return [null, MESSAGE_ERROR.COURSE.COURSES_EMPTY];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.COURSE.FIND_COURSE_FAILED];
  },

  getCourse: async (filters) => {
    try {
      const course = await Course.findOne({
        where: filters,
        include: User,
      });

      if (course) {
        return [course, null];
      } else {
        return [null, MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.COURSE.FIND_COURSE_FAILED];
  },

  createCourse: async (
    name,
    price,
    teacherId,
    tryLearn,
    quantity,
    duration
  ) => {
    try {
      const courseExist = await Course.findOne({
        where: {
          name,
          teacherId,
        },
      });

      if (courseExist) {
        return [false, MESSAGE_ERROR.COURSE.COURSE_EXISTED];
      }

      const course = await Course.create({
        name,
        price,
        teacherId,
        tryLearn,
        quantity,
        duration,
      });

      if (course) {
        return [true, MESSAGE_SUCCESS.COURSE.CREATE_COURSE_SUCCESS];
      }
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.COURSE.CREATE_COURSE_FAILED];
  },

  updateCourse: async (
    id,
    name,
    price,
    teacherId,
    tryLearn,
    quantity,
    duration
  ) => {
    try {
      const course = await Course.findByPk(id);

      if (!course) {
        return [false, MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND];
      }

      const statusUpdated = await course.update({
        name,
        price,
        teacherId,
        tryLearn,
        quantity,
        duration,
        updatedAt: momentUtil.getDateNow(),
      });

      if (statusUpdated) {
        return [true, MESSAGE_SUCCESS.COURSE.UPDATE_COURSE_SUCCESS];
      }
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.COURSE.UPDATE_COURSE_FAILED];
  },

  removeCourses: async (courseIdList) => {
    try {
      const courses = await Course.findAll({
        where: {
          id: {
            [Op.in]: courseIdList,
          },
        },
      });

      if (courses?.length !== courseIdList.length) {
        return [false, MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND];
      }

      const statusDeleted = await Course.destroy({
        where: {
          id: {
            [Op.in]: courseIdList,
          },
        },
      });

      if (statusDeleted === courseIdList.length) {
        return [true, MESSAGE_SUCCESS.COURSE.DELETE_COURSE_SUCCESS];
      }
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.COURSE.DELETE_COURSE_FAILED];
  },

  importCourses: async function (fileInfo) {
    try {
      const [dataArr, message] = await fileExcel.readFile(
        fileInfo,
        FIELDS_IMPORT.COURSE_FIELDS
      );

      if (!dataArr) {
        return [false, message];
      }

      await Promise.all(
        dataArr.map(async (data) => {
          const [user] = await userService.getUser({
            email: data.teacher,
          });

          if (user && user.Type.name === "teacher") {
            return await this.createCourse(
              data.name,
              data.price,
              +user.id,
              data.tryLearn,
              data.quantity,
              data.duration
            );
          }
        })
      );

      return [true, MESSAGE_SUCCESS.FILE.IMPORT_COURSES_SUCCESS];
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.FILE.IMPORT_COURSES_FAILED];
  },
};
