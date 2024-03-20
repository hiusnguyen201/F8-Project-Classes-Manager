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

  async create(data, ids) {
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
      : [data.assistantId];

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

    // Create classes
    for (let i = 0; i < classLength; i++) {
      let transaction = await sequelizeInstance.transaction();
      try {
        const id = ids && ids.length ? ids[i] : null;

        const classObj = await this.Class.create(
          {
            id: id,
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

        // Add asssistant to class
        const teacherClassLength = data.assistantId.length;
        for (let i = 0; i < teacherClassLength; i++) {
          const teacher = await this.User.findByPk(data.assistantId[i]);
          await classObj.addUser(teacher, { transaction });
        }

        // Add Teacher to class
        await classObj.addUser(course.User, { transaction });

        // Create calender for teacher follow class
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
    const ids = [];
    try {
      const classesArr = await this.Class.findAll({
        where: {
          name,
        },
        include: this.TeacherCalender,
      });

      if (!classesArr?.length) return false;

      await Promise.all(
        classesArr.map(async (classObj) => {
          const users = await classObj.getUsers();
          for (let i = 0; i < users.length; i++) {
            await classObj.removeUser(users[i]);
          }

          for (let i = 0; i < classObj.Teacher_Calenders.length; i++) {
            await classObj.Teacher_Calenders[i].destroy();
          }

          ids.push(classObj.id);

          await classObj.destroy({
            force: true,
          });
        })
      );
    } catch (err) {
      console.log(err);
      throw new Error(MESSAGE_ERROR.CLASS.EDIT_CLASS_FAILED);
    }

    await this.create(data, ids);
    return true;
  }

  async removeClasses(listId) {
    const classes = await this.Class.findAll({
      where: {
        name: {
          [Op.in]: listId,
        },
      },
      include: [this.User, this.TeacherCalender],
    });

    await Promise.all(
      classes.map(async (classObj) => {
        await classObj.removeUsers(classObj.Users);

        classObj.Teacher_Calenders.forEach(async (calender) => {
          await calender.destroy();
        });

        await classObj.destroy();
      })
    );

    return true;
  }

  // async importClasses(fileInfo, classFields) {
  //   const [dataArr, message] = await fileExcel.readFile(fileInfo, classFields);

  //   if (!dataArr) throw new Error(message);

  //   await Promise.all(
  //     dataArr.map(async (data) => {
  //       const teacher = await courseService.findById(data.teacher);
  //       if (teacher && teacher.Type.name === "teacher") {
  //         return await this.create(
  //           data.name,
  //           data.price,
  //           teacher.id,
  //           data.tryLearn,
  //           data.quantity,
  //           data.duration
  //         );
  //       }
  //     })
  //   );
  // }
}

module.exports = ClassService;
