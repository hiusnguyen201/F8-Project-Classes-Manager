const {
  MESSAGE_ERROR,
  MESSAGE_INFO,
  MESSAGE_SUCCESS,
} = require("../../constants/message.constant");

const momentUtil = require("../../utils/moment");
const tokenUtil = require("../../utils/token");
const stringUtil = require("../../utils/string");
const sendMailUtil = require("../../utils/sendMail");

const tokenService = require("./token.service");

const models = require("../../models/index");
const UserOtp = models.User_Otp;

module.exports = {
  createUserOtp: async (id, email, name) => {
    try {
      const existUserOtp = await UserOtp.findOne({
        where: { userId: +id },
      });
      if (existUserOtp) {
        await existUserOtp.destroy();
      }

      const otp = tokenUtil.createOtpTokenByOtplib();
      const userOtp = await UserOtp.create({
        otp,
        expire: momentUtil.createOtpExpire(),
        userId: +id,
      });

      if (userOtp) {
        const otpMailHtml = stringUtil.getOtpMailHtml(name, otp);

        sendMailUtil(email, MESSAGE_INFO.TWO_FA, otpMailHtml);

        return [userOtp, MESSAGE_SUCCESS.OTP.SENDED_OTP];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.OTP.CREATE_OTP_FAILED];
  },

  verifyOtp: async (otp, userId) => {
    try {
      const userOtp = await UserOtp.findOne({
        where: { userId: +userId },
      });

      if (
        momentUtil.comparisonDate(userOtp.expire, momentUtil.getDateNow()) > 0
      ) {
        await userOtp.destroy();
        return [null, MESSAGE_ERROR.OTP.OTP_EXPIRE];
      }

      if (otp !== userOtp.otp) {
        return [null, MESSAGE_ERROR.OTP.WRONG_OTP];
      }

      await UserOtp.destroy({
        where: {
          otp,
        },
      });

      const [loginToken, message] = await tokenService.createLoginToken(
        +userId
      );
      if (loginToken) {
        return [loginToken, null];
      } else {
        return [null, message];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.OTP.VERIFY_OTP_FAILED];
  },

  removeUserOtpByUserId: async (userId) => {
    try {
      const userOtp = await UserOtp.findOne({
        where: {
          userId: +userId,
        },
      });

      if (!userOtp) {
        return [false, MESSAGE_ERROR.OTP.OTP_NOT_FOUND];
      }

      const status = await userOtp.destroy();
      if (status) {
        return [true, null];
      }
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.OTP.REMOVE_OTP_FAILED];
  },
};
