const { check } = require("express-validator");
const { messageError } = require("../constants/constants.message");
const usersService = require("../http/services/users.service");
const tokenUtil = require("../utils/token.util");

module.exports = {
  validateLoginAndPassword: (...params) => {
    const executeArr = [];
    if (params.includes("email")) {
      executeArr.push(
        check("email", messageError.MISSING_CREDENTIALS).notEmpty(),
        check("email", messageError.EMAIL_NOT_RIGHT_FORMAT).isEmail()
      );
    }

    if (params.includes("password")) {
      executeArr.push(
        check("password", messageError.MISSING_CREDENTIALS).notEmpty()
      );
    }

    if (params.includes("oldPassword")) {
      executeArr.push(
        check("oldPassword", messageError.MISSING_CREDENTIALS).notEmpty(),
        check("oldPassword").custom(async (value, { req }) => {
          const user = await usersService.getUserById(+req.user.id);
          if (!tokenUtil.compareHashByBcrypt(value, user.password)) {
            throw new Error(messageError.OLD_PASS_INVALID);
          }
        })
      );
    }

    if (params.includes("newPassword")) {
      executeArr.push(
        check("newPassword", messageError.MISSING_CREDENTIALS).notEmpty(),
        check("newPassword", messageError.NEW_PASS_NOT_STRONG).isStrongPassword(
          {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 0,
            minUppercase: 0,
          }
        )
      );

      if (params.includes("confirmPassword")) {
        executeArr.push(
          check("confirmPassword", messageError.MISSING_CREDENTIALS).notEmpty(),
          check("confirmPassword").custom((value, { req }) => {
            const { newPassword } = req.body;
            if (value !== newPassword) {
              throw new Error(messageError.CONFIRM_PASS_INVALID);
            }
          })
        );
      }
    }

    return executeArr;
  },

  validateUserProfile: () => {
    return [
      check("name", messageError.REQUIRED_NAME).notEmpty(),
      check("email", messageError.REQUIRED_EMAIL).notEmpty(),
      check("email", messageError.EMAIL_NOT_RIGHT_FORMAT).isEmail(),
    ];
  },
};
