const messageError = {
  // AUTH
  MISSING_CREDENTIALS: "Please Complete Information",
  WRONG_OTP: "The Otp You've Entered Is Incorrect. Please Try Again",
  EMPTY_OTP: "Please Enter The Otp Below",
  OTP_EXPIRE: "The Otp You've Entered Is Expired. Please Login Again",
  LOGIN_GOOGLE_FAILED: "Account google is not linked",
  INVALID_ACCOUNT_GOOGLE: "Invalid account google or account is already linked",
  INVALID_TOKEN_CSRF: "Invalid token",
  SOMETHING_WRONG: "Something wrong",

  // User
  INVALID_ACCOUNT: "Wrong Email Or Password. Try Again",

  SERVER_ERROR: "Server Error",
  MAIL_ACTIVE_TEMPLATE: "Read Active Mail Template Error",
  MAIL_SEND_VERIFY: "Send Mail To Verify Error",
};

const messageInfo = {
  TWO_FA: "Two-Factor Login Verification",
  SENDED_OTP: "We've Send A Verification Code To Your Email",
};

module.exports = { messageError, messageInfo };
