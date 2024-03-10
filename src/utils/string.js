const path = require("path");
const fs = require("fs");
const { MESSAGE_ERROR } = require("../constants/message.constant");

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
      throw new Error(MESSAGE_ERROR.OTHER.READ_MAIL_HTML);
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
          .replaceAll("{{token}}", token)
          .replaceAll("{{website}}", process.env.WEBSITE);
        return mailTemplate;
      }
    } catch (err) {
      console.log(err);
      throw new Error(MESSAGE_ERROR.OTHER.READ_MAIL_HTML);
    }
  },

  getPassActiveAccountMailHtml: (email, password) => {
    const mailTemplatePath = path.join(
      path.dirname(__dirname),
      "/resources/views/mail/passActiveAccount.mail.html"
    );
    try {
      let mailTemplate = fs.readFileSync(mailTemplatePath).toString();

      if (mailTemplate) {
        mailTemplate = mailTemplate
          .replaceAll("{{brand}}", process.env.APP_NAME)
          .replaceAll("{{email}}", email)
          .replaceAll("{{password}}", password);
        return mailTemplate;
      }
    } catch (err) {
      console.log(err);
      throw new Error(MESSAGE_ERROR.OTHER.READ_MAIL_HTML);
    }
  },

  getPaginateUrl: (req, page = 1, limit = 10) => {
    const query = req.query;
    query.page = page;
    query.limit = limit;
    return new URLSearchParams(query).toString();
  },

  formatCurrency: (string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(string);
  },

  extractErr: (errors) => {
    const obj = {};

    if (errors && errors?.length) {
      errors.map((err) => {
        if (!obj[err.path]) {
          obj[err.path] = err.msg;
        }
      });
    }

    return obj;
  },

  findProvider: (userSocials, provider) => {
    return userSocials.find((social) => social.provider === provider);
  },
};
