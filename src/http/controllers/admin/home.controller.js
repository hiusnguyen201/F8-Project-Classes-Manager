const { renderPath } = require("../../../constants/constants.path");
module.exports = {
  index: (req, res) => {
    res.render(renderPath.HOME_ADMIN, { layout: "layouts/main.layout.ejs" });
  },
};
