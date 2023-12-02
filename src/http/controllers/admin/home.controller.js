const { renderPath } = require("../../../constants/constants.path");
const { redirectPath } = require("../../../constants/constants.path");
const socialsService = require("../../services/socials.service");
const csrf = require("../../../http/middlewares/csrf.middleware");
const { checkIncludes } = require("../../../utils/string.util");

module.exports = {
  index: (req, res) => {
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

    const url = req.path;

    res.render(renderPath.SETTINGS_ADMIN, {
      layout: "layouts/main.layout.ejs",
      user: req.user,
      redirectPath,
      userGoogle,
      csrf,
      url,
      error,
      checkIncludes,
    });
  },

  handleRemoveUserSocial: async (req, res) => {
    const { userSocialId, provider } = req.body;
    const [status, errMessage] = await socialsService.removeUserSocial(
      userSocialId,
      provider,
      req.user.id
    );

    if (!status) {
      req.flash("error", errMessage);
    }

    return res.redirect(redirectPath.SETTINGS_SECURITY_ADMIN);
  },
};
//