const { check } = require("express-validator");
const fs = require("fs");
const { Op } = require("sequelize");
const { MESSAGE_ERROR } = require("../constants/message.constant");
const models = require("../models/index");

const selectorModel = {
  users: models.User,
  types: models.Type,
  courses: models.Course,
  classes: models.Class,
};

const regexPhone = {
  "+84": /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
};

const selectorConstraint = {
  /**
   * @param {string} name
   * @param {string} error
   * @param {string} value
   * @returns {boolean}
   */

  required: function (name, error) {
    return check(name, error || "This field must be required").notEmpty();
  },

  string: function (name, error) {
    return check(name, error || "This field must be string").isString();
  },

  email: function (name, error) {
    return check(name, error || "This field must be email").isEmail();
  },

  phone: function (name, error, value) {
    return check(name).custom((data) => {
      if (!data.match(regexPhone[value])) {
        throw new Error(error || "This field must be phone number");
      }
      return true;
    });
  },

  gt: function (key, error, value) {
    const [name, target] = key.split(".");
    error = error || `This field must greater than ${value}`;

    if (target === "*") {
      return check(name).custom((arr) => {
        if (!Array.isArray(arr)) {
          arr = [arr];
        }

        arr.forEach((val, index) => {
          if (!(+val > +value)) {
            throw new Error(`${error} in position ${index + 1}`);
          }
        });

        return true;
      });
    }

    return check(name, error).custom((val) => {
      return +val > +value;
    });
  },

  gte: function (name, error, value) {
    return check(name, error).custom((val) => {
      return +val >= +value;
    });
  },

  unique: function (name, error, value) {
    return check(name).custom(async (data, { req }) => {
      const [table, column, exceptName, fieldColumn] = value.split(",");
      let filters = {};
      filters[column] = data;

      if (exceptName && fieldColumn) {
        filters[fieldColumn] = {
          [Op.not]: req.body[exceptName] ?? req.params[exceptName],
        };
      }

      const obj = await selectorModel[table].findOne({
        where: filters,
      });

      if (obj) throw new Error(error || "This field must be unique");

      return true;
    });
  },

  exists: function (name, error, value) {
    return check(name).custom(async (data) => {
      const [table, field] = value.split(",");
      let filters = {};
      filters[field] = data;

      const obj = await selectorModel[table].findOne({
        where: filters,
      });

      if (!obj) throw new Error(error || "This field isn't exist");
      return true;
    });
  },

  array: function (name, error) {
    return check(name, error || "This field must be array").isArray();
  },

  integer: function (key, error) {
    const [name, target] = key.split(".");
    error = error || `This field must be integer number`;

    if (target === "*") {
      return check(name).custom((arr) => {
        if (!Array.isArray(arr)) {
          arr = [arr];
        }

        arr.forEach((val, index) => {
          if (!Number.isInteger(+val)) {
            throw new Error(`${error} in position ${index + 1}`);
          }
        });

        return true;
      });
    }

    return check(name, error).isInt();
  },
};

module.exports = {
  make: function (rulesObj) {
    const names = rulesObj.RULES;
    const executeArr = [];

    for (const name in names) {
      const rules = names[name].split("|");
      rules.forEach((rule) => {
        const messErr = rulesObj?.MESSAGES;
        const [constraint, value] = rule.split(":");
        const funcSelected = selectorConstraint[constraint];
        if (funcSelected) {
          executeArr.push(
            funcSelected(
              name,
              messErr ? messErr[`${name}.${rule}`] : null,
              value ?? null
            )
          );
        } else {
          console.log(
            "\x1b[33m%s\x1b[0m",
            `***** Constraint ${constraint} is undefined *****`
          );
        }
      });
    }

    return executeArr;
  },

  // Excel
  fileExcel: () => {
    return [
      check("file").custom((value, { req }) => {
        const fileInfo = req.file;
        const filePath = `./public/uploads/${fileInfo.originalname}`;

        if (fileInfo.size > 1000000 * +process.env.SIZE_FILE_LIMIT) {
          throw new Error(MESSAGE_ERROR.FILE.SIZE_FILE_LIMIT);
        }

        if (
          fileInfo.mimetype !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          try {
            fs.unlinkSync(filePath);
            throw new Error(MESSAGE_ERROR.FILE.MIMETYPE_EXCEL_WRONG);
          } catch (err) {
            console.log(err);
            throw new Error(MESSAGE_ERROR.FILE.REMOVE_FILE_UPLOAD_ERROR);
          }
        }

        return true;
      }),
    ];
  },
};
