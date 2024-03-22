const { Op, Sequelize } = require("sequelize");
const { development } = require("../../config/config");
const sequelizeInstance = new Sequelize(development);

const moment = require("moment");
const { MESSAGE_ERROR } = require("../../constants/message.constant");
const { LIMIT_PAGE } = require("../../constants/setting.constant");

const fileExcel = require("../../utils/fileExcel");

const models = require("../../models/index");
class ClassService {
  constructor() {
    this.Class = models.Class;
    this.Course = models.Course;
    this.User = models.User;
    this.ClassSchedule = models.Class_Schedule;
    this.TeacherCalender = models.Teacher_Calender;
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

    const count = await this.Class.count({
      where: filters,
    });

    limit = LIMIT_PAGE.includes(+limit) ? +limit : 10;
    const totalPage = Math.ceil(count / +limit);
    if (+page < 1 || +page > totalPage) {
      page = 1;
    }
    const offset = (+page - 1) * +limit;

    const classes = await this.Class.findAll({
      where: filters,
      include: {
        model: this.Course,
        attributes: {
          exclude: ["password"],
        },
        include: this.User,
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
    const course = await this.Course.findByPk(data.courseId, {
      include: this.User,
    });
    if (!course) throw new Error(MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND);

    data.schedule = Array.isArray(data.schedule)
      ? data.schedule
      : [data.schedule];
    data.timeLearnStart = Array.isArray(data.timeLearnStart)
      ? data.timeLearnStart
      : [data.timeLearnStart];
    data.timeLearnEnd = Array.isArray(data.timeLearnEnd)
      ? data.timeLearnEnd
      : [data.timeLearnEnd];

    if (data.assistantId) {
      data.assistantId = Array.isArray(data.assistantId)
        ? data.assistantId
        : [data.assistantId];
    }
    data.startDate = moment(data.startDate, "DD/MM/YYYY");
    const totalWeeks = Math.ceil(course.duration / data.schedule.length);
    let remainingDays = course.duration % data.schedule.length;

    // Calcute end date
    let endDate = data.startDate.clone().add(totalWeeks, "weeks");
    if (!remainingDays) remainingDays = 1;

    while (remainingDays !== 0) {
      endDate.subtract(1, "day");
      if (data.schedule.includes(`${endDate.weekday()}`)) {
        remainingDays--;
      }
    }

    let transaction = await sequelizeInstance.transaction();
    try {
      const classObj = await this.Class.create(
        {
          name: data.name,
          quantity: data.quantity,
          startDate: data.startDate,
          endDate,
          courseId: data.courseId,
        },
        { transaction }
      );

      // Add schedules
      await Promise.all(
        data.schedule.map(async (schedule, i) => {
          await this.ClassSchedule.create(
            {
              schedule,
              timeLearn: `${data.timeLearnStart[i]} - ${data.timeLearnEnd[i]}`,
              classId: classObj.id,
            },
            { transaction }
          );

          // Create calender for teacher follow class
          const dayNeeded = data.startDate.clone().weekday(+schedule);
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
        })
      );

      // Add Teacher to class
      await classObj.addUser(course.User, { transaction });
      // Add asssistant to class
      for (let i = 0; i < data.assistantId.length; i++) {
        const teacher = await this.User.findByPk(data.assistantId[i]);
        await classObj.addUser(teacher, { transaction });
      }

      await transaction.commit();

      return classObj;
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      throw new Error(MESSAGE_ERROR.CLASS.CREATE_CLASS_FAILED);
    }
  }
}

module.exports = ClassService;
