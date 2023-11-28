const path = require("path");
const fs = require("fs");

const { messageError } = require("../../constants/constants.message");
const momentUtil = require("../../utils/moment.util");
const otpLibUtil = require("../../utils/otplib.util");
const models = require("../../models/index");
const UserOtp = models.User_Otp;

module.exports = {
  createOtp: async function (userId) {
    let newOtp = otpLibUtil.createOtpToken();

    const existOtp = await this.getUserOtpByOtp(newOtp);

    if (existOtp) {
      this.createOtp(userId);
    } else {
      const userOtp = await UserOtp.create({
        otp: newOtp,
        expire: momentUtil.createOtpExpire(),
        user_id: userId,
      });

      if (!userOtp) {
        throw new Error(messageError.SERVER_ERROR);
      }

      return userOtp;
    }
  },

  getUserOtpByOtp: async (otp) => {
    const userOtp = await UserOtp.findOne({
      where: { otp },
    });
    return userOtp;
  },

  getMailTemplate: (name, otp) => {
    const mailTemplatePath = path.join(
      path.dirname(__dirname),
      "../resources/views/auth/otp-mail.html"
    );
    let mailTemplate = fs.readFileSync(mailTemplatePath).toString();

    if (!mailTemplate) {
      throw new Error(messageError.MAIL_ACTIVE_TEMPLATE);
    }

    mailTemplate = mailTemplate
      .replaceAll("{{brand}}", process.env.APP_NAME)
      .replaceAll("{{name}}", name)
      .replaceAll("{{otp}}", otp)
      .replaceAll("{{expire}}", process.env.OTP_EXPIRE_MINUTES);
    return mailTemplate;
  },

  removeUserOtpByOtp: async (otp) => {
    const status = await UserOtp.destroy({
      where: {
        otp,
      },
    });

    if (!status) {
      throw new Error(messageError.SERVER_ERROR);
    }

    return;
  },
};
