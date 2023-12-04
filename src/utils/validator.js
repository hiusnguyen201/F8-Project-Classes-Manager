const { body } = require("express-validator");
const { messageError } = require("../constants/constants.message");
const usersService = require("../http/services/users.service");
const tokenUtil = require("../utils/token.util");

const validateChangePassword = () => {
  return [
    body("oldPassword", messageError.MISSING_CREDENTIALS).notEmpty(),
    body("oldPassword").custom(async (value, { req }) => {
      const user = await usersService.getUserById(+req.user.id);
      if (!tokenUtil.compareHashByBcrypt(value, user.password)) {
        throw new Error(messageError.OLD_PASS_INVALID);
      }
    }),
    body("newPassword", messageError.MISSING_CREDENTIALS).notEmpty(),
    body("newPassword", messageError.NEW_PASS_NOT_STRONG).isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    }),
    body("confirmPassword", messageError.MISSING_CREDENTIALS).notEmpty(),
    body("confirmPassword").custom((value, { req }) => {
      const { newPassword } = req.body;
      if (value !== newPassword) {
        throw new Error(messageError.CONFIRM_PASS_INVALID);
      }
    }),
  ];
};

module.exports = { validateChangePassword };
