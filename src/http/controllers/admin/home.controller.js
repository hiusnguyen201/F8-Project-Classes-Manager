const { renderPath } = require("../../../constants/constants.path");
const { redirectPath } = require("../../../constants/constants.path");
const socialsService = require("../../services/socials.service");
const csrf = require("../../../http/middlewares/csrf.middleware");
const { checkIncludes } = require("../../../utils/string.util");

module.exports = {
  index: async (req, res) => {
    res.render(renderPath.HOME_ADMIN, {
      layout: "layouts/main.layout.ejs",
      user: req.user,
      redirectPath,
    });
  },

  settings: async (req, res) => {
    const error = req.flash("error");
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

    res.render(renderPath.SETTINGS_ADMIN, {
      layout: "layouts/main.layout.ejs",
      user,
      redirectPath,
      userGoogle,
      userGithub,
      userFacebook,
      csrf,
      url: req.path,
      error,
      checkIncludes,
    });
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

    return res.redirect(redirectPath.SETTINGS_SECURITY_ADMIN);
  },
};
//