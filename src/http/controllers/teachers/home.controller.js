const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");
module.exports = {
  index: (req, res) => {
    return res.render(renderPath.HOME_TEACHER, {
      title: `Home - ${process.env.APP_NAME}`,
      user: req.user,
      redirectPath,
    });
  },
};
