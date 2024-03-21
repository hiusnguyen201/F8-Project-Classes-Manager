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
    this.Class = models.Class;
    this.Course_Module = models.Course_Module;
    this.Module_Document = models.Module_Document;
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
      include: [
        {
          model: this.User,
          attributes: {
            exclude: ["password"],
          },
        },
        this.Class,
        {
          model: this.Course_Module,
          include: this.Module_Document,
        },
      ],
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

  async getModuleById(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) return null;

    const module = await this.Course_Module.findByPk(id);

    return module ? module : null;
  }

  async createModule(data, files, courseId) {
    const module = await this.Course_Module.create({
      name: data.name,
      courseId,
    });

    if (!module) throw new Error(MESSAGE_ERROR.COURSE.CREATE_MODULE_FAILED);
    await Promise.all(
      files.map(async (file) => {
        console.log(file);
        return await this.Module_Document.create({
          moduleId: module.id,
          pathName: "/uploads/" + file.filename,
          name: file.filename,
        });
      })
    );

    return true;
  }

  async editModule(data, files, moduleId) {
    const module = await this.Course_Module.findByPk(moduleId);
    if (!module) throw new Error(MESSAGE_ERROR.COURSE.MODULE_NOT_FOUND);

    await module.update({
      updatedAt: new Date(),
      name: data.name,
    });

    if (files && files.length) {
      await module.removeModule_Documents(module.Module_Document);

      await Promise.all(
        files.map(async (file) => {
          return await this.Module_Document.create({
            moduleId: module.id,
            name: file.filename,
            pathName: "/uploads/" + file.filename,
          });
        })
      );
    }

    return true;
  }

  async removeModules(listId) {
    await Promise.all(
      listId.map(async (id) => {
        const module = await this.Course_Module.findByPk(id, {
          include: this.Module_Document,
        });

        if (!module) throw new Error(MESSAGE_ERROR.COURSE.MODULE_NOT_FOUND);

        await module.destroy();
      })
    );
  }
}

module.exports = CourseService;
