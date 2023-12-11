const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");

module.exports = {
  index: async (req, res) => {
    return res.render(renderPath.HOME_ADMIN, {
      user: req.user,
      title: `Home - ${process.env.APP_NAME}`,
      redirectPath,
    });
  },

  usersIndex: async (req, res) => {
    return res.render(renderPath.HOME_ADMIN_USERS, {
      user: req.user,
      title: `Manage Users - ${process.env.APP_NAME}`,
      redirectPath,
    });
  },
};
