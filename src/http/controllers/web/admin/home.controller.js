const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");

module.exports = {
  index: async (req, res) => {
    return res.render(RENDER_PATH.ADMIN.HOME_ADMIN, {
      req,
      user: req.user,
      title: `Home`,
      REDIRECT_PATH,
      currPage: "dashboard",
    });
  },
};
