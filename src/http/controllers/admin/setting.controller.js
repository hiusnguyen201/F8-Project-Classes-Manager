const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");
const { messageInfo } = require("../../../constants/constants.message");
const { validationResult } = require("express-validator");
const socialsService = require("../../services/socials.service");
const usersService = require("../../services/users.service");
const csrf = require("../../middlewares/csrf.middleware");
const { checkIncludes } = require("../../../utils/string.util");

module.exports = {
  settings: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");
    const user = req.user;
    const userGoogle = await socialsService.getUserSocialByUserIdAndProvider(
      +user.id,
      "google"
    );
    const userGithub = await socialsService.getUserSocialByUserIdAndProvider(
      +user.id,
      "github"
    );
    const userFacebook = await socialsService.getUserSocialByUserIdAndProvider(
      +user.id,
      "facebook"
    );

    return res.render(renderPath.SETTINGS_ADMIN, {
      title: `Settings - ${process.env.APP_NAME}`,
      user,
      redirectPath,
      userGoogle,
      userGithub,
      userFacebook,
      csrf,
      url: req.path,
      error,
      success,
      checkIncludes,
    });
  },

  handleUpdateProfile: async (req, res) => {
    let { errors } = validationResult(req);
    if (errors[0]?.msg === "Invalid value") {
      errors = [];
    }

    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(redirectPath.SETTINGS_PROFILE_ADMIN);
    }

    const userId = req.user.id;
    const { name, email, phone, address } = req.body;
    await usersService.updateProfile(userId, name, email, phone, address);
    req.flash("success", messageInfo.UPDATED_PROFILE);
    return res.redirect(redirectPath.SETTINGS_PROFILE_ADMIN);
  },

  handleRemoveUserSocial: async (req, res) => {
    const { userSocialId, provider } = req.body;
    const user = req.user;
    const [status, errMessage] = await socialsService.removeUserSocial(
      userSocialId,
      provider,
      user.id
    );

    if (!status) {
      req.flash("error", errMessage);
    }

    req.flash("success", messageInfo.REMOVE_ACCOUNT_SOCIAL_SUCCESS);
    return res.redirect(redirectPath.SETTINGS_SECURITY_ADMIN);
  },

  handleChangePassword: async (req, res) => {
    let { errors } = validationResult(req);
    if (errors[0]?.msg === "Invalid value") {
      errors = [];
    }

    if (!errors?.length) {
      const { confirmPassword } = req.body;
      usersService.updatePassword(req.user.id, confirmPassword);
      req.flash("success", messageInfo.CHANGE_PASS_SUCCESS);
    } else {
      req.flash("error", errors[0].msg);
    }
    return res.redirect(redirectPath.SETTINGS_PASSWORD_ADMIN);
  },
};
