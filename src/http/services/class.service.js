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
    this.TeacherCalendar = models.Teacher_Calendar;
    this.StudentAttendance = models.Student_Attendance;
    this.StudentClass = models.Student_Class;
    this.LearningStatus = models.Learning_Status;
    this.Exercise = models.Exercise;
    this.SubmitExercise = models.Submit_Exercise;
    this.Comment = models.Comment;
  }

  async countAll() {
    const count = await this.Class.count();
    return count;
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

  async findExerciseById(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) return null;
    const exercise = await this.Exercise.findByPk(id, {
      include: [
        this.User,
        {
          model: this.SubmitExercise,
          include: this.User,
        },
      ],
    });
    return exercise ? exercise : null;
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
          model: this.StudentClass,
          include: [this.User, this.LearningStatus],
        },
        this.TeacherCalendar,
        {
          model: this.Exercise,
          include: this.SubmitExercise,
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
              await this.TeacherCalendar.create(
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

      await this.TeacherCalendar.destroy(
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
          updatedAt: new Date(),
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
              await this.TeacherCalendar.create(
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
        const classObj = await this.Class.findByPk(id);
        if (!classObj) throw new Error(MESSAGE_ERROR.CLASS.CLASS_NOT_FOUND);
        await classObj.removeClass_Schedules();
        await classObj.removeTeacher_Calendars();
        await classObj.removeUsers();
        await classObj.removeComments();
        await classObj.removeExercises();
        await classObj.removeStudent_Classes();
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
    const existStudentInClass = await this.StudentClass.findOne({
      where: {
        classId,
        studentId: data.student,
      },
    });

    if (existStudentInClass)
      throw new Error(MESSAGE_ERROR.CLASS.STUDENT_JOINED);

    let transaction = await sequelizeInstance.transaction();
    try {
      const studentClass = await this.StudentClass.create(
        {
          studentId: data.student,
          statusId: data.status,
          classId,
          completeDate: data.completeDate
            ? moment(data.completeDate, "DD/MM/YYYY")
            : null,
          dropoutDate: data.dropoutDate
            ? moment(data.dropoutDate, "DD/MM/YYYY")
            : null,
          recoveryDate: data.recoveryDate
            ? moment(data.recoveryDate, "DD/MM/YYYY")
            : null,
          reason: data.reason || null,
        },
        { transaction }
      );

      if (!studentClass) {
        throw new Error(MESSAGE_ERROR.CLASS.ADD_STUDENT_TO_CLASS_FAILED);
      }

      const calendars = await this.TeacherCalendar.findAll({
        where: {
          classId,
        },
      });

      if (!calendars || !calendars.length)
        throw new Error(MESSAGE_ERROR.CLASS.ADD_STUDENT_TO_CLASS_FAILED);

      await Promise.all(
        calendars.map(async (calendar) => {
          await this.StudentAttendance.create(
            {
              studentId: data.student,
              calendarId: calendar.id,
            },
            { transaction }
          );
        })
      );

      await transaction.commit();
      return studentClass;
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      throw new Error(MESSAGE_ERROR.CLASS.ADD_STUDENT_TO_CLASS_FAILED);
    }
  }

  async findStudentInClass(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) return null;

    const studentClass = await this.StudentClass.findByPk(id);

    return studentClass ? studentClass : null;
  }

  async editStudent(data, classId, studentClassId) {
    const existStudentAttendance = await this.StudentClass.findOne({
      where: {
        classId,
        studentId: data.student,
        [Op.not]: {
          id: studentClassId,
        },
      },
    });

    if (existStudentAttendance)
      throw new Error(MESSAGE_ERROR.CLASS.STUDENT_JOINED);

    const status = await this.StudentClass.update(
      {
        studentId: data.student,
        status: data.status,
        completeDate: data.completeDate
          ? moment(data.completeDate, "DD/MM/YYYY")
          : null,
        dropoutDate: data.dropoutDate
          ? moment(data.dropoutDate, "DD/MM/YYYY")
          : null,
        recoverDate: data.recoverDate
          ? moment(data.recoverDate, "DD/MM/YYYY")
          : null,
        reason: data.reason || null,
        updatedAt: new Date(),
      },
      {
        where: {
          id: studentClassId,
        },
      }
    );

    const calendars = await this.TeacherCalendar.findAll({
      where: {
        classId,
      },
    });

    if (!calendars || !calendars.length)
      throw new Error(MESSAGE_ERROR.CLASS.ADD_STUDENT_TO_CLASS_FAILED);

    await Promise.all(
      calendars.map(async (calendar) => {
        const existStudentAttendance = await this.StudentAttendance.findOne({
          where: {
            studentId: data.oldStudentId,
            calendarId: calendar.id,
          },
        });

        if (existStudentAttendance) {
          await existStudentAttendance.update({
            studentId: data.student,
          });
        }
      })
    );

    if (!status)
      throw new Error(MESSAGE_ERROR.CLASS.EDIT_STUDENT_TO_CLASS_FAILED);

    return status;
  }

  async removeStudentsClass(listId) {
    await Promise.all(
      listId.map(async (id) => {
        const studentClass = await this.StudentClass.findByPk(id);

        if (!studentClass)
          throw new Error(MESSAGE_ERROR.CLASS.STUDENT_NOT_FOUND);

        await this.StudentAttendance.destroy({
          where: {
            studentId: studentClass.studentId,
          },
        });

        await studentClass.destroy();
      })
    );
  }

  async findCalendarById(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) return null;

    const calendar = await this.TeacherCalendar.findByPk(id, {
      include: {
        model: this.StudentAttendance,
        include: this.User,
      },
    });

    return calendar ? calendar : null;
  }

  async updateAttendance(data, calendarId) {
    if (data.studentId && data.studentId.length) {
      if (!Array.isArray(data.studentId)) data.studentId = [data.studentId];

      await Promise.all(
        data.studentId.map(async (id, index) => {
          await this.StudentAttendance.update(
            {
              status: data.status[index] ? data.status[index] : null,
            },
            {
              where: {
                calendarId,
                studentId: id,
              },
            }
          );
        })
      );
    }
  }

  async createExercise(data, classId, user) {
    const exercise = await this.Exercise.create({
      title: data.title,
      attachment: data.attachment,
      content: data.content,
      teacherId: user.id,
      classId,
    });

    return exercise ? exercise : null;
  }

  async updateExercise(data, id) {
    const status = await this.Exercise.update(
      {
        title: data.title,
        attachment: data.attachment,
        content: data.content,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );

    return status ? 1 : 0;
  }

  async deleteExercise(listId) {
    await Promise.all(
      listId.map(async (id) => {
        const exercise = await this.Exercise.findByPk(id);
        if (!exercise) throw new Error(MESSAGE_ERROR.CLASS.EXERCISE_NOT_FOUND);
        await exercise.removeSubmit_Exercises();
        await exercise.destroy();
      })
    );
  }

  async removeQuestions(listId) {
    await Promise.all(
      listId.map(async (id) => {
        await this.Comment.destroy({
          where: {
            parentId: id,
          },
        });

        await this.Comment.destroy({
          where: {
            id,
          },
        });
      })
    );
  }

  async createSubmitExercise(data, user) {
    const submitExercise = await this.SubmitExercise.create({
      studentId: user.id,
      attachment: data.attachment ? data.attachment : null,
      exerciseId: data.exerciseId,
    });

    return submitExercise ? submitExercise : null;
  }

  async updateSubmitExercise(data) {
    const status = await this.SubmitExercise.update(
      {
        attachment: data.attachment,
        updatedAt: new Date(),
      },
      {
        where: {
          id: data.submitExerciseId,
        },
      }
    );

    return status ? 1 : 0;
  }

  async deleteSubmitExercise(data) {
    const status = await this.SubmitExercise.destroy({
      where: {
        id: data.submitExerciseId,
      },
    });

    return status ? 1 : 0;
  }

  async createQuestion(data, user) {
    const question = await this.Comment.create({
      title: data.title,
      content: data.content,
      userId: user.id,
      classId: data.classId,
    });

    return question ? question : null;
  }

  async findAllComments(classId, parent) {
    const comments = await this.Comment.findAll({
      where: {
        classId,
        parentId: parent,
      },
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
    });

    return comments;
  }

  async findQuestionById(id) {
    const question = await this.Comment.findOne({
      where: {
        id,
        parentId: null,
      },
      include: this.User,
    });
    return question ? question : null;
  }

  async findAllCommentsByQuestionId(id) {
    const questions = await this.Comment.findAll({
      where: {
        parentId: id,
      },
      include: this.User,
    });

    return questions;
  }

  async updateQuestion(data, id) {
    const status = await this.Comment.update(
      {
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );

    return status ? 1 : 0;
  }

  async createComment(data, parentId, classId, user) {
    const comment = await this.Comment.create({
      content: data.content,
      parentId,
      classId,
      userId: user.id,
    });
    return comment ? comment : null;
  }

  async editComment(data) {
    const status = await this.Comment.update(
      {
        content: data.content,
      },
      {
        where: {
          id: data.commentId,
        },
      }
    );

    return status ? 1 : 0;
  }

  async deleteComment(data) {
    const status = await this.Comment.destroy({
      where: {
        id: data.commentId,
      },
    });

    return status ? 1 : 0;
  }
}

module.exports = ClassService;
