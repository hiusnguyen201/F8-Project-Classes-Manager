const createHttpError = require("http-errors");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} = require("../../../../constants/message.constant");
const { STATUS_CODE } = require("../../../../constants/status.constant");
const { LIST_SOCIALS } = require("../../../../constants/setting.constant");

const stringUtil = require("../../../../utils/string");
const { createHashByBcrypt } = require("../../../../utils/token");

const csrf = require("../../../middlewares/web/csrf.middleware");

const SocialService = require("../../../services/social.service");
const userSocialService = new SocialService();
const UserService = require("../../../services/user.service");
const userService = new UserService();

module.exports = {
  profile: async (req, res, next) => {
    try {
      const userEdit = await userService.findById(req.user.id);
      return res.render(RENDER_PATH.PROFILE_SETTING_ADMIN, {
        title: `Settings - ${process.env.APP_NAME}`,
        req,
        user: req.user,
        oldValues: req.flash("oldValues")[0] || userEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        currPage: "profile",
        REDIRECT_PATH,
        csrf,
        error: req.flash("error"),
        success: req.flash("success"),
        stringUtil,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleEditProfile: async (req, res) => {
    try {
      await userService.update(req.body, req.user.id);
      req.flash("success", MESSAGE_SUCCESS.USER.EDIT_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.EDIT_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.PROFILE_SETTINGS_ADMIN);
  },

  security: async (req, res, next) => {
    try {
      const user = req.user;
      const userSocials = await userSocialService.findAll(
        +user.id,
        LIST_SOCIALS
      );

      return res.render(RENDER_PATH.SECURITY_SETTING_ADMIN, {
        title: `Settings - ${process.env.APP_NAME}`,
        req,
        user,
        listSocials: LIST_SOCIALS,
        currPage: "security",
        REDIRECT_PATH,
        userSocials: Array.isArray(userSocials) ? userSocials : [userSocials],
        csrf,
        error: req.flash("error"),
        success: req.flash("success"),
        stringUtil,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleRemoveUserSocial: async (req, res) => {
    try {
      await userSocialService.delete(req.body.provider, req.user.id);
      req.flash(
        "success",
        MESSAGE_SUCCESS.SOCIAL.REMOVE_ACCOUNT_SOCIAL_SUCCESS
      );
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.SOCIAL.REMOVE_ACCOUNT_SOCIAL_FAILED);
    }

    return res.redirect(REDIRECT_PATH.SECURITY_SETTING_ADMIN);
  },

  password: async (req, res, next) => {
    try {
      return res.render(RENDER_PATH.PASSWORD_SETTING_ADMIN, {
        title: `Settings - ${process.env.APP_NAME}`,
        req,
        user: req.user,
        errorsValidate: req.flash("errors")[0] || {},
        currPage: "password",
        REDIRECT_PATH,
        csrf,
        error: req.flash("error"),
        success: req.flash("success"),
        stringUtil,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleChangePassword: async (req, res) => {
    try {
      await userService.update(
        {
          password: createHashByBcrypt(req.body.confirmPassword),
        },
        req.user.id
      );

      req.flash("success", MESSAGE_SUCCESS.USER.CHANGE_PASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.CHANGE_PASS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.PASSWORD_SETTING_ADMIN);
  },
};
