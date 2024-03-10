const { Op, Sequelize } = require("sequelize");
const sequelize = require("sequelize");
const { development } = require("../../config/config");
const sequelizeInstance = new sequelize(development);
const {
  MESSAGE_ERROR,
  MESSAGE_INFO,
} = require("../../constants/message.constant");
const { LIMIT_PAGE } = require("../../constants/setting.constant");
const { readFile } = require("../../utils/fileExcel");
const moment = require("moment");

const models = require("../../models/index");

const CourseService = require("./course.service");
const courseService = new CourseService();

class ClassService {
  constructor() {
    this.Class = models.Class;
    this.Course = models.Course;
    this.User = models.User;
    this.TeacherCalender = models.Teacher_Calender;
    this.attributes = [
      "id",
      "name",
      "quantity",
      "startDate",
      "endDate",
      "courseId",
      [Sequelize.fn("GROUP_CONCAT", Sequelize.col("schedule")), "schedule"],
      [Sequelize.fn("GROUP_CONCAT", Sequelize.col("timeLearn")), "timeLearn"],
    ];
  }

  async findByName(name) {
    const classObj = await this.Class.findOne({
      where: {
        name,
      },
      group: ["name"],
      attributes: this.attributes,
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
    });

    return classObj;
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

    let count = await this.Class.count({
      where: filters,
      group: ["name"],
    });

    count = count.length;

    limit = LIMIT_PAGE.includes(+limit) ? +limit : 10;
    const totalPage = Math.ceil(count / +limit);
    if (+page < 1 || +page > totalPage) {
      page = 1;
    }
    const offset = (+page - 1) * +limit;

    const classes = await this.Class.findAll({
      where: filters,
      group: ["name"],
      attributes: this.attributes,
      include: {
        model: this.Course,
        include: {
          model: this.User,
          attributes: {
            exclude: ["password"],
          },
        },
      },
      offset,
      limit,
    });

    return {
      meta: { page, offset, totalPage, limit, count },
      data: classes,
    };
  }

  async create(data) {
    // convert data to array
    data.schedule = Array.isArray(data.schedule)
      ? data.schedule
      : [data.schedule];
    data.timeLearnStart = Array.isArray(data.timeLearnStart)
      ? data.timeLearnStart
      : [data.timeLearnStart];
    data.timeLearnEnd = Array.isArray(data.timeLearnEnd)
      ? data.timeLearnEnd
      : [data.timeLearnEnd];
    data.assistantId = Array.isArray(data.assistantId)
      ? data.assistantId
      : data.assistantId
      ? [data.assistantId]
      : [];
    data.startDate = moment(data.startDate, "DD/MM/YYYY");

    const course = await courseService.findById(data.courseId);
    if (!course) throw new Error(MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND);

    const classLength = data.schedule.length;
    const totalWeeks = Math.ceil(course.duration / classLength);
    let remainingDays = course.duration % classLength;

    // Calcute end date
    let endDate = data.startDate.clone().add(totalWeeks, "weeks");
    if (!remainingDays) remainingDays = 1;

    while (remainingDays !== 0) {
      endDate.subtract(1, "day");
      if (data.schedule.includes(`${endDate.weekday()}`)) {
        remainingDays--;
      }
    }

    // Add teacher to array
    data.assistantId.push(course.User.id);

    // Create classes
    for (let i = 0; i < classLength; i++) {
      let transaction;
      try {
        transaction = await sequelizeInstance.transaction();

        const classObj = await this.Class.create(
          {
            name: data.name,
            quantity: data.quantity,
            startDate: data.startDate,
            endDate,
            schedule: data.schedule[i],
            timeLearn: `${data.timeLearnStart[i]} - ${data.timeLearnEnd[i]}`,
            courseId: data.courseId,
          },
          { transaction }
        );

        // Add teacher and asssistant to class
        const teacherClassLength = data.assistantId.length;
        for (let i = 0; i < teacherClassLength; i++) {
          const teacher = await this.User.findByPk(data.assistantId[i]);
          await classObj.addUser(teacher, { transaction });
        }

        // Create calender for teacher
        const dayNeeded = data.startDate.clone().weekday(+data.schedule[i]);
        while (dayNeeded.diff(endDate) <= 0) {
          if (dayNeeded.diff(data.startDate) >= 0) {
            await this.TeacherCalender.create(
              {
                scheduleDate: dayNeeded,
                teacherId: course.User.id,
                classId: classObj.id,
              },
              { transaction }
            );
          }
          dayNeeded.add(1, "week");
        }

        await transaction.commit();
      } catch (err) {
        console.log(err);
        if (transaction) await transaction.rollback();
        throw new Error(MESSAGE_ERROR.CLASS.CREATE_CLASS_FAILED);
      }
    }

    return true;
  }

  async update(data, name) {
    const classesArr = await this.Class.findAll({
      where: {
        name,
      },
      include: this.TeacherCalender,
    });

    if (!classesArr?.length) return false;

    try {
      classesArr.forEach(async (classObj) => {
        const users = await classObj.getUsers();
        for (let i = 0; i < users.length; i++) {
          await classObj.removeUser(users[i]);
        }

        for (let i = 0; i < classObj.Teacher_Calenders.length; i++) {
          await classObj.Teacher_Calenders[i].destroy();
        }

        await classObj.destroy({
          force: true,
        });
      });
    } catch (err) {
      console.log(err);
      throw new Error(MESSAGE_ERROR.CLASS.EDIT_CLASS_FAILED);
    }

    this.create(data);
    return true;
  }

  async removeClasses(listId) {
    const classes = await this.Class.findAll({
      where: {
        name: {
          [Op.in]: listId,
        },
      },
    });

    classes.forEach(async (classObj) => {
      await classObj.destroy();
    });

    return true;
  }
}

module.exports = ClassService;
