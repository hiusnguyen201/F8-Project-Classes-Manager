const { validationResult } = require("express-validator");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const socialService = require("../../../services/social.service");
const userService = require("../../../services/user.service");
const csrf = require("../../../middlewares/web/csrf.middleware");
const stringUtil = require("../../../../utils/string");

module.exports = {
  settings: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    let currPage = null;
    if (req.originalUrl.includes("profile")) {
      currPage = "profile";
    } else if (req.originalUrl.includes("security")) {
      currPage = "security";
    } else if (req.originalUrl.includes("password")) {
      currPage = "password";
    }

    const user = req.user;
    const [userGoogle] = await socialService.getUserSocial({
      userId: +user.id,
      provider: "google",
    });
    const [userGithub] = await socialService.getUserSocial({
      userId: +user.id,
      provider: "github",
    });
    const [userFacebook] = await socialService.getUserSocial({
      userId: +user.id,
      provider: "facebook",
    });

    return res.render(RENDER_PATH.HOME_ADMIN_SETTING, {
      title: `Settings - ${process.env.APP_NAME}`,
      req,
      user,
      currPage,
      REDIRECT_PATH,
      userGoogle,
      userGithub,
      userFacebook,
      csrf,
      error,
      success,
      stringUtil,
    });
  },

  handleUpdateProfile: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.SETTINGS_PROFILE_ADMIN);
    }

    const userId = req.user.id;
    const { name, email, phone, address } = req.body;
    const [status, message] = await userService.updateUser(
      +userId,
      name,
      email,
      phone,
      address
    );
    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }
    return res.redirect(REDIRECT_PATH.SETTINGS_PROFILE_ADMIN);
  },

  handleRemoveUserSocial: async (req, res) => {
    const { userSocialId, provider } = req.body;

    const userId = req.user.id;
    const [status, message] = await socialService.removeUserSocial(
      userSocialId,
      provider,
      userId
    );

    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }

    return res.redirect(REDIRECT_PATH.SETTINGS_SECURITY_ADMIN);
  },

  handleChangePassword: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.SETTINGS_PASSWORD_ADMIN);
    }

    const userId = req.user.id;
    const { confirmPassword } = req.body;
    const [status, message] = await userService.updatePassword(
      +userId,
      confirmPassword
    );
    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }
    return res.redirect(REDIRECT_PATH.SETTINGS_PASSWORD_ADMIN);
  },
};
