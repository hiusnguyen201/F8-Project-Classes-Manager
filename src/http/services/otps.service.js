const {
  messageError,
  messageInfo,
} = require("../../constants/constants.message");
const momentUtil = require("../../utils/moment.util");
const tokenUtil = require("../../utils/token.util");
const stringUtil = require("../../utils/string.util");
const sendMailUtil = require("../../utils/sendMail.util");
const job = require("../../helpers/kue.helper");
const models = require("../../models/index");
const UserOtp = models.User_Otp;

module.exports = {
  createUserOtp: async (user) => {
    try {
      // Check Exist Otp
      const existUserOtp = await UserOtp.findOne({
        where: { user_id: +user.id },
      });
      if (existUserOtp) {
        await existUserOtp.destroy();
      }

      // Create new Otp
      const newOtp = tokenUtil.createOtpTokenByOtplib();
      const userOtp = await UserOtp.create({
        otp: newOtp,
        expire: momentUtil.createOtpExpire(),
        user_id: +user.id,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });

      // Get Mail Template
      const mailTemplate = stringUtil.getMailTemplate(user.name, newOtp);

      try {
        // Send Email
        job.createJob(
          "SendMail",
          {
            title: messageInfo.TWO_FA,
            to: user.email,
            name: user.name,
          },
          sendMailUtil(user.email, messageInfo.TWO_FA, mailTemplate)
        );
      } catch (error) {
        throw new Error(messageError.MAIL_SEND_VERIFY);
      }

      return userOtp;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  getUserOtpByUserId: async (userId) => {
    try {
      const userOtp = await UserOtp.findOne({
        where: {
          user_id: +userId,
        },
      });
      return userOtp;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  getUserOtpByOtp: async (otp) => {
    try {
      const userOtp = await UserOtp.findOne({
        where: { otp },
      });
      return userOtp;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  removeUserOtpByOtp: async (otp) => {
    try {
      const status = await UserOtp.destroy({
        where: {
          otp,
        },
      });

      if (status) {
        return status;
      }
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }

    return;
  },
};
