const { check } = require("express-validator");
const { Op } = require("sequelize");
const fs = require("fs");
const { MESSAGE_ERROR } = require("../constants/message.constant");
const models = require("../models/index");
const tokenUtil = require("../utils/token");

const selectorModel = {
  users: models.User,
  types: models.Type,
  courses: models.Course,
  classes: models.Class,
  course_modules: models.Course_Module,
  learning_statuses: models.Learning_Status,
};

const mimetype = {
  excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pdf: "application/pdf",
};

const selectorRule = {
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
    return check(
      name,
      error || "This field must be phone number"
    ).isMobilePhone(value);
  },

  integer: function (name, error, value) {
    return check(name, error || "This field must be integer number").isInt();
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

  currentPassword: function (name, error) {
    return check(name).custom(async (data, { req }) => {
      const user = await models.User.findByPk(req.user.id);
      const result = tokenUtil.compareHashByBcrypt(data, user.password);
      if (!result) {
        throw new Error(
          error || "The value of field not match with current password"
        );
      }

      return true;
    });
  },

  strongPassword: function (name, error) {
    return check(
      name,
      error || "The field isn't strong password"
    ).isStrongPassword({
      minLength: 4,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    });
  },

  confirmed: function (name, error, value) {
    return check(name).custom((data, { req }) => {
      if (req.body[value] !== data) {
        throw new Error(
          error || `The value of field not match with the value of ${name}`
        );
      }

      return true;
    });
  },

  date: function (name, error, value) {
    return check(name, error || "The field must be date").isDate({
      format: value,
    });
  },

  time: function (name, error) {
    return check(name, error || "The field must be time").isTime({
      hourFormat: "hour24",
    });
  },

  min: (name, error, value) => {
    return check(name).custom((data, { req }) => {
      if (Number.isInteger(+data)) {
        if (+data < value)
          throw new Error(
            error || `This field must have value minimum is ${value}`
          );
      } else if (Array.isArray(data)) {
        if (data.length < value)
          throw new Error(
            error || `This field must have length minimum is ${value}`
          );
      }
    });
  },
};

module.exports = {
  make: function (rulesObj) {
    return async (req, res, next) => {
      const { RULES, MESSAGES } = rulesObj;
      const validations = {};
      for (const [name, rulesStr] of Object.entries(RULES)) {
        const rules = rulesStr.split("|");

        let nullable = false;
        for (const rule of rules) {
          const [ruleName, ruleValue] = rule.split(":");
          const funcSelected = selectorRule[ruleName];

          if (ruleName == "nullable" && !req.body[name]) {
            nullable = true;
          }

          if (!funcSelected && !nullable) {
            console.log(
              "\x1b[33m%s\x1b[0m",
              `***** Rule '${rule}' is undefined *****`
            );
            continue;
          }

          if (ruleName != "nullable" && !nullable) {
            const { errors } = await funcSelected(
              name,
              MESSAGES ? MESSAGES[`${name}.${rule}`] : null,
              ruleValue ?? null
            ).run(req);

            if (errors?.length) {
              validations[name] = errors[0].msg;
              break;
            }
          }
        }
      }

      if (Object.keys(validations)?.length) {
        req.flash("oldValues", req.body);
        req.flash("errors", validations);
        req.flash("method", req.method);
        return res.redirect(req.originalUrl);
      }

      return next();
    };
  },

  file: (exceptType) => {
    return [
      check("file").custom((value, { req }) => {
        const files = req.files;

        if (files && files.length) {
          files.forEach((fileInfo) => {
            const filePath = `./public/uploads/${fileInfo.originalname}`;

            if (fileInfo.size > 2000000 * +process.env.SIZE_FILE_LIMIT) {
              throw new Error(MESSAGE_ERROR.FILE.SIZE_FILE_LIMIT);
            }

            exceptType = Array.isArray(exceptType) ? exceptType : [exceptType];

            let count = 0;
            for (var i = 0; i < exceptType.length; i++) {
              if (fileInfo.mimetype == mimetype[type]) break;
              if (count == exceptType.length) {
                try {
                  fs.unlinkSync(filePath);
                  throw new Error(MESSAGE_ERROR.FILE.MIMETYPE_WRONG);
                } catch (err) {
                  console.log(err);
                  throw new Error(MESSAGE_ERROR.FILE.REMOVE_FILE_UPLOAD_ERROR);
                }
              }
              count++;
            }
          });
        }

        return true;
      }),
    ];
  },
};
