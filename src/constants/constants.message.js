const messageError = {
  // --------------- AUTH ------------------
  // Login
  MISSING_CREDENTIALS: "Please Complete Information",
  EMAIL_NOT_RIGHT_FORMAT: "Email isn't right format",
  // Otp
  WRONG_OTP: "The Otp You've Entered Is Incorrect. Please Try Again",
  EMPTY_OTP: "Please Enter The Otp Below",
  OTP_EXPIRE: "The Otp You've Entered Is Expired. Please Login Again",
  INVALID_OTP: "Invalid otp",

  // Social
  ACCOUNT_NOT_LINKED: "Account is not linked",
  INVALID_LINK_ACCOUNT: "Invalid account or account is already linked",

  // Csrf
  INVALID_TOKEN_CSRF: "Invalid token",
  SOMETHING_WRONG: "Something wrong",
  // JWT
  JWT_INVALID_TOKEN: "Token is expired. Please try again",

  EMAIL_NOT_EXIST: "Email isn't exist",

  // --------------- User ------------------
  INVALID_ACCOUNT: "Incorrect email or password",
  CREATE_OTP_FAILED: "Create otp failed",
  USER_NOT_FOUND: "User not found",
  REQUIRED_NAME: "Name is required",
  REQUIRED_EMAIL: "Email is required",
  NOT_FOUND: "Not Found",
  SERVER_ERROR: "Server Error",
  BAD_REQUEST: "Bad Request",
  READ_MAIL_HTML: "Read Mail Html Error",
  MAIL_SEND_VERIFY: "Send Mail To Verify Error",

  // --------------- Setting ------------------
  OLD_PASS_INVALID: "Old password isn't valid",
  NEW_PASS_NOT_STRONG:
    "New password at least 6 characters including a number and a lowercase letter",
  CONFIRM_PASS_INVALID: "Confirm passwod isn't match new password",
};

const messageSuccess = {
  SENDED_OTP: "We've Send A Verification Code To Your Email",
  CHANGE_PASS_SUCCESS: "Change password successfully",
  REMOVE_ACCOUNT_SOCIAL_SUCCESS: "Remove social account successfully",
  LINK_ACCOUNT_SOCIAL_SUCCESS: "Link social account  successfully",
  UPDATED_PROFILE: "Updat user profile successfully",
  SENDED_OTP: "We've Send A Verification Code To Your Email",
  SENDED_RESET_PASS: "Check your email for a link to reset your password",
};

const messageInfo = {
  TWO_FA: "Two-Factor Login Verification",
  RESET_PASS_TITLE: "Reset Your Password",
};

module.exports = { messageError, messageInfo, messageSuccess };
