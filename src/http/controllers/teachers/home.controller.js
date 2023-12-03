const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");
module.exports = {
  index: (req, res) => {
    const user = req.user;
    res.render(renderPath.HOME_TEACHER, {
      layout: "layouts/main.layout.ejs",
      user,
      redirectPath,
    });
  },
};
