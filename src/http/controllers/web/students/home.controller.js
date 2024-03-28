const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");

module.exports = {
  index: (req, res) => {
    return res.render(RENDER_PATH, REDIRECT_PATH.HOME_STUDENT, {
      title: `Home`,
      user: req.user,
      REDIRECT_PATH,
    });
  },
};
