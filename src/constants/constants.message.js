const messageError = {
  // AUTH
  MISSING_CREDENTIALS: "Please Complete Information",
  WRONG_OTP: "The Otp You've Entered Is Incorrect. Please Try Again",
  EMPTY_OTP: "Please Enter The Otp Below",
  OTP_EXPIRE: "The Otp You've Entered Is Expired. Please Login Again",

  // User
  INVALID_ACCOUNT: "Wrong Email Or Password. Try Again",
  EMPTY_FIELD: "Field Is Empty",

  SERVER_ERROR: "Server Error",
  MAIL_ACTIVE_TEMPLATE: "Read Active Mail Template Error",
};

const messageInfo = {
  TWO_FA: "Two-Factor Login Verification",
  SENDED_OTP: "We've Send A Verification Code To Your Email",
};

module.exports = { messageError, messageInfo };
