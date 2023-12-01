const { renderPath } = require("../../../constants/constants.path");
const { redirectPath } = require("../../../constants/constants.path");
const socialsService = require("../../services/socials.service");

const user = {
  id: 51,
  name: "Hello",
  tpye: 3,
};
module.exports = {
  index: (req, res) => {
    res.render(renderPath.HOME_ADMIN, {
      layout: "layouts/main.layout.ejs",
      user,
      redirectPath,
    });
  },

  settings: async (req, res) => {
    const userSocial = await socialsService.getUserSocialByUserId(user.id);
    console.log(userSocial);
    res.render(renderPath.SETTINGS_ADMIN, {
      layout: "layouts/main.layout.ejs",
      user,
      redirectPath,
      userSocial,
    });
  },
};
//