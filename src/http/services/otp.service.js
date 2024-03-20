const {
  MESSAGE_ERROR,
  MESSAGE_INFO,
  MESSAGE_SUCCESS,
} = require("../../constants/message.constant");

const momentUtil = require("../../utils/moment");
const tokenUtil = require("../../utils/token");
const stringUtil = require("../../utils/string");
const sendMailUtil = require("../../utils/sendMail");
const TokenService = require("./token.service");
const tokenService = new TokenService();
const models = require("../../models/index");
class OtpService {
  constructor() {
    this.UserOtp = models.User_Otp;
  }

  async findByUserId(userId) {
    const userOtp = await this.UserOtp.findOne({
      where: { userId },
    });

    return userOtp ? userOtp : null;
  }

  async findByOtp(otp) {
    const userOtp = await this.UserOtp.findOne({
      where: { otp },
    });

    return userOtp ? userOtp : null;
  }

  async create(userId, email, name) {
    const existUserOtp = await this.findByUserId(userId);
    if (existUserOtp) {
      await existUserOtp.destroy();
    }

    const otp = tokenUtil.createOtpTokenByOtplib();
    const userOtp = await this.UserOtp.create({
      otp,
      expire: momentUtil.createOtpExpire(),
      userId,
    });

    if (userOtp) {
      const otpMailHtml = stringUtil.getOtpMailHtml(name, otp);
      sendMailUtil(email, MESSAGE_INFO.TWO_FA, otpMailHtml);
      return userOtp;
    }
  }

  async verify(otp) {
    const userOtp = await this.findByOtp(otp);

    if (!userOtp) {
      throw new Error(MESSAGE_ERROR.OTP.WRONG_OTP);
    }

    if (
      momentUtil.comparisonDate(userOtp.expire, momentUtil.getDateNow()) > 0
    ) {
      await userOtp.destroy();
      throw new Error(MESSAGE_ERROR.OTP.OTP_EXPIRE);
    }

    return true;
  }

  async remove(userId) {
    const userOtp = await this.findByUserId(userId);

    if (!userOtp) {
      throw new Error(MESSAGE_ERROR.OTP.OTP_NOT_FOUND);
    }

    const status = await userOtp.destroy();
    return status;
  }
}

module.exports = OtpService;
