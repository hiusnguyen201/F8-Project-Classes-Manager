const path = require("path");
const fs = require("fs");
const { messageError } = require("../constants/constants.message");

module.exports = {
  getOtpMailHtml: (name, otp) => {
    const mailTemplatePath = path.join(
      path.dirname(__dirname),
      "/resources/views/mail/otp.mail.html"
    );
    try {
      let mailTemplate = fs.readFileSync(mailTemplatePath).toString();

      if (mailTemplate) {
        mailTemplate = mailTemplate
          .replaceAll("{{brand}}", process.env.APP_NAME)
          .replaceAll("{{name}}", name)
          .replaceAll("{{otp}}", otp)
          .replaceAll("{{expire}}", process.env.OTP_EXPIRE_MINUTES);
        return mailTemplate;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.READ_MAIL_HTML);
    }
  },

  getResetPasswordMailHtml: (name, linkReset, token) => {
    const mailTemplatePath = path.join(
      path.dirname(__dirname),
      "/resources/views/mail/resetPassword.mail.html"
    );

    try {
      let mailTemplate = fs.readFileSync(mailTemplatePath).toString();

      if (mailTemplate) {
        mailTemplate = mailTemplate
          .replaceAll("{{brand}}", process.env.APP_NAME)
          .replaceAll("{{name}}", name)
          .replaceAll("{{expire}}", process.env.JWT_EXPIRE)
          .replaceAll("{{linkReset}}", linkReset)
          .replaceAll("{{token}}", token);
        return mailTemplate;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.READ_MAIL_HTML);
    }
  },

  checkIncludes: (url, key) => {
    return url.includes(key);
  },
};
