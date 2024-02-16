const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");

const stringUtil = require("../../../../utils/string");

module.exports = {
  index: async (req, res) => {
    return res.render(RENDER_PATH.HOME_ADMIN, {
      req,
      user: req.user,
      title: `Home - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      stringUtil,
      currPage: "dashboard",
    });
  },
};
