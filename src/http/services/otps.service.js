const {
  messageError,
  messageInfo,
} = require("../../constants/constants.message");
const momentUtil = require("../../utils/moment.util");
const tokenUtil = require("../../utils/token.util");
const stringUtil = require("../../utils/string.util");
const sendMailUtil = require("../../utils/sendMail.util");
const models = require("../../models/index");
const tokensService = require("../services/tokens.service");
const UserOtp = models.User_Otp;

module.exports = {
  // Done
  createUserOtp: async (user) => {
    try {
      const { id, email, name } = user;
      // Check Exist Otp
      const existUserOtp = await UserOtp.findOne({
        where: { user_id: +id },
      });
      if (existUserOtp) {
        await existUserOtp.destroy();
      }

      // Create new Otp
      const otp = tokenUtil.createOtpTokenByOtplib();
      const userOtp = await UserOtp.create({
        otp,
        expire: momentUtil.createOtpExpire(),
        user_id: +id,
      });

      if (userOtp) {
        // Get Otp Mail Html
        const otpMailHtml = stringUtil.getOtpMailHtml(name, otp);

        // Send Email
        sendMailUtil(email, messageInfo.TWO_FA, otpMailHtml);

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
        await userOtp.destroy();
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
