const models = require("../../../models/index");
const {
  STATUS_CODE,
  STATUS_MESSAGE,
} = require("../../../constants/status.constant");
const Apikey = models.Apikey;
module.exports = async (req, res, next) => {
  const apikey = req.headers["x-api-key"];

  const authCheck = await Apikey.findOne({
    where: {
      value: apikey ?? "",
    },
  });

  if (!authCheck) {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({
      status: "Error",
      message: STATUS_MESSAGE.UNAUTHORIZED,
    });
  }

  next();
};
