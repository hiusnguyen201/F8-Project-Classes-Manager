const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");

module.exports = {
  index: async (req, res) => {
    res.render(renderPath.HOME_ADMIN, {
      layout: "layouts/main.layout.ejs",
      user: req.user,
      redirectPath,
    });
  },
};
//