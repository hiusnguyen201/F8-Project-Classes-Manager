"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PASS,
  },
});

module.exports = async (sendTo, subject, html) => {
  return await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM}>`,
    to: sendTo,
    subject,
    html,
  });
};
