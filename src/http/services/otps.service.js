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
const tokensService = require("../services/tokens.service");
const usersService = require("../services/users.service");
const UserOtp = models.User_Otp;

module.exports = {
  // Done
  createUserOtp: async (userId) => {
    try {
      // Check Exist Otp
      const existUserOtp = await UserOtp.findOne({
        where: { user_id: +userId },
      });
      if (existUserOtp) {
        await existUserOtp.destroy();
      }

      // Create new Otp
      const newOtp = tokenUtil.createOtpTokenByOtplib();
      const userOtp = await UserOtp.create({
        otp: newOtp,
        expire: momentUtil.createOtpExpire(),
        user_id: +userId,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });

      if (userOtp) {
        const user = await usersService.getUserById(userOtp.user_id);
        // Get Mail Template
        const mailTemplate = stringUtil.getMailTemplate(user.name, newOtp);

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

        return userOtp;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  verifyOtp: async (otp, userId) => {
    try {
      const userOtp = await UserOtp.findOne({
        where: { user_id: +userId },
      });

      if (
        momentUtil.comparisonDate(userOtp.expire, momentUtil.getDateNow()) > 0
      ) {
        return [null, messageError.OTP_EXPIRE];
      }

      if (otp !== userOtp.otp) {
        return [null, messageError.WRONG_OTP];
      }

      await UserOtp.destroy({
        where: {
          otp,
        },
      });

      const loginToken = await tokensService.createLoginToken(+userId);
      if (loginToken) {
        return [loginToken, null];
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  getUserOtpByUserId: async (userId) => {
    try {
      const userOtp = await UserOtp.findOne({
        where: { user_id: +userId },
      });
      if (userOtp) {
        return userOtp;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  removeUserOtpByUserId: async (userId) => {
    try {
      const userOtp = await UserOtp.findOne({
        where: {
          user_id: +userId,
        },
      });

      if (userOtp) {
        await userOtp.destroy();
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
