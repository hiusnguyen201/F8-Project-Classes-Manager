const { Op, where } = require("sequelize");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} = require("../../constants/message.constant");
const { FIELDS_IMPORT } = require("../../constants/fileExcel.constant");

const fileExcel = require("../../utils/fileExcel");
const momentUtil = require("../../utils/moment");

const courseService = require("./course.service");
const model = require("../../models/index");
const Class = model.Class;

module.exports = {
  countAllClass: async (filters) => {
    try {
      const { count } = await Class.findAndCountAll({
        where: filters,
      });

      return [count, null];
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.CLASS.COUNT_COURSE_FAILED];
  },

  getAllClass: async (filters, offset, limit) => {
    try {
      const options = {};

      if (filters) {
        options.where = filters;
      }

      if (offset) {
        options.offset = +offset;
      }

      if (limit) {
        options.limit = +limit;
      }

      const classes = await Class.findAll(options);

      if (classes?.length) {
        return [classes, null];
      } else {
        return [null, MESSAGE_ERROR.CLASS.CLASSES_EMPTY];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.CLASS.FIND_CLASS_FAILED];
  },

  createClass: async (
    name,
    quantity,
    startDate,
    schedule,
    timeLearn,
    courseId,
    assistantId
  ) => {
    // try {
    //   const [course, message] = await courseService.getCourse({
    //     where: {
    //       id: +courseId,
    //     },
    //   });
    //   if (!course) {
    //     return [null, message];
    //   }
    //   const totalWeeks =
    //     course.duration % schedules.length === 0
    //       ? course.duration / schedules.length
    //       : course.duration / schedules.length + 1;
    // } catch (err) {
    //   console.log(err);
    //   return [null, MESSAGE_ERROR.CLASS.CREATE_CLASS_FAILED];
    // }
  },
};
