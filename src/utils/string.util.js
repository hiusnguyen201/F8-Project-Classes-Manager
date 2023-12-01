const path = require("path");
const fs = require("fs");
const { messageError } = require("../constants/constants.message");

module.exports = {
  getMailTemplate: (name, otp) => {
    const mailTemplatePath = path.join(
      path.dirname(__dirname),
      "/resources/views/auth/otp-mail.html"
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
    } catch (error) {
      throw new Error(messageError.MAIL_ACTIVE_TEMPLATE);
    }
  },

  checkIncludes: (url, key) => {
    return url.includes(key);
  },
};
