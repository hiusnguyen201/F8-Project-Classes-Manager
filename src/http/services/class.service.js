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
    this.StudentAttendance = models.Student_Attendance;
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

  async findById(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) return null;

    const classObj = await this.Class.findByPk(id, {
      include: [
        {
          model: this.User,
          attributes: {
            exclude: ["password"],
          },
        },
        this.ClassSchedule,
        {
          model: this.Course,
          include: this.User,
        },
        {
          model: this.StudentAttendance,
          include: this.User,
        },
      ],
    });

    return classObj ? classObj : null;
  }

  async findAll() {
    const classObj = await this.Class.findAll({
      include: [this.ClassSchedule, this.Course],
    });

    return classObj;
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
      if (data.assistantId && data.assistantId?.length) {
        for (let i = 0; i < data.assistantId.length; i++) {
          const teacher = await this.User.findByPk(data.assistantId[i]);
          await classObj.addUser(teacher, { transaction });
        }
      }

      await transaction.commit();

      return classObj;
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      throw new Error(MESSAGE_ERROR.CLASS.CREATE_CLASS_FAILED);
    }
  }

  async update(data, id) {
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
      const classObj = await this.Class.findByPk(id, {
        include: this.User,
      });

      await this.ClassSchedule.destroy(
        {
          where: {
            classId: classObj.id,
          },
        },
        { transaction }
      );

      await this.TeacherCalender.destroy(
        {
          where: {
            classId: classObj.id,
          },
        },
        { transaction }
      );

      await classObj.removeUsers(classObj.Users, { transaction });

      await classObj.update(
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
      if (data.assistantId && data.assistantId?.length) {
        for (let i = 0; i < data.assistantId.length; i++) {
          const teacher = await this.User.findByPk(data.assistantId[i]);
          await classObj.addUser(teacher, { transaction });
        }
      }

      await transaction.commit();

      return classObj;
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      throw new Error(MESSAGE_ERROR.CLASS.CREATE_CLASS_FAILED);
    }
  }

  async removeClasses(listId) {
    await Promise.all(
      listId.map(async (id) => {
        const classObj = await this.Class.findByPk(id, {
          include: [this.ClassSchedule, this.User, this.TeacherCalender],
        });

        await this.ClassSchedule.destroy({
          where: {
            classId: classObj.id,
          },
        });

        await this.TeacherCalender.destroy({
          where: {
            classId: classObj.id,
          },
        });

        await classObj.removeUsers(classObj.Users);

        if (!classObj) throw new Error(MESSAGE_ERROR.CLASS.CLASS_NOT_FOUND);

        await classObj.remove;
        await classObj.destroy();
      })
    );
  }

  async importClasses(fileInfo, classFields) {
    const [dataArr, message] = await fileExcel.readFile(fileInfo, classFields);

    if (!dataArr) throw new Error(message);

    await Promise.all(
      dataArr.map(async (data) => {
        const classObj = await this.Class.findOne({
          where: {
            name: data.name,
          },
        });

        if (!classObj) {
          let schedules = data.schedules.split(",");
          schedules.map((schedule, i) => {
            schedules[i] = `${moment
              .weekdays()
              .findIndex((day) => day == schedule)}`;
          });

          const timeLearns = data.timeLearns.split(",");
          const timeLearnStart = [],
            timeLearnEnd = [];
          timeLearns.map((timeLearn) => {
            const [start, end] = timeLearn.split(" - ");
            timeLearnStart.push(start);
            timeLearnEnd.push(end);
          });

          const course = await this.Course.findOne({
            where: {
              name: data.course,
            },
          });

          return await this.create({
            name: data.name,
            quantity: data.quantity,
            startDate: moment(data.startDate).format("DD/MM/YYYY"),
            schedule: schedules,
            timeLearnStart,
            timeLearnEnd,
            courseId: course.id,
          });
        }
      })
    );
  }

  async addStudent(data, classId) {
    const existStudentAttendance = await this.StudentAttendance.findOne({
      where: {
        classId,
        studentId: data.student,
      },
    });

    if (existStudentAttendance)
      throw new Error(MESSAGE_ERROR.CLASS.STUDENT_ATTENDANCED);

    const studentAttendance = await this.StudentAttendance.create({
      studentId: data.student,
      dateLearning: moment(data.dateLearning, "DD/MM/YYYY"),
      status: data.status,
      classId,
    });

    if (!studentAttendance) {
      throw new Error(MESSAGE_ERROR.CLASS.ADD_STUDENT_TO_CLASS_FAILED);
    }

    return studentAttendance;
  }

  async findStudentAttendanceByPk(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) return null;

    const studentAttendance = await this.StudentAttendance.findByPk(id);

    return studentAttendance ? studentAttendance : null;
  }

  async editStudent(data, classId, studentAttendanceId) {
    const existStudentAttendance = await this.StudentAttendance.findOne({
      where: {
        classId,
        studentId: data.student,
        [Op.not]: {
          id: studentAttendanceId,
        },
      },
    });

    if (existStudentAttendance)
      throw new Error(MESSAGE_ERROR.CLASS.STUDENT_ATTENDANCED);

    const status = await this.StudentAttendance.update(
      {
        studentId: data.student,
        dateLearning: moment(data.dateLearning, "DD/MM/YYYY"),
        status: data.status,
      },
      {
        where: {
          id: studentAttendanceId,
        },
      }
    );

    if (!status)
      throw new Error(MESSAGE_ERROR.CLASS.EDIT_STUDENT_TO_CLASS_FAILED);

    return status;
  }

  async removeStudentsAttendance(listId) {
    await Promise.all(
      listId.map(async (id) => {
        const studentAttendance = await this.StudentAttendance.findByPk(id);

        if (!studentAttendance)
          throw new Error(MESSAGE_ERROR.CLASS.STUDENT_NOT_FOUND);

        await studentAttendance.destroy();
      })
    );
  }
}

module.exports = ClassService;
