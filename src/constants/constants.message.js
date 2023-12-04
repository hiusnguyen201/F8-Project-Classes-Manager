const messageError = {
  // AUTH
  MISSING_CREDENTIALS: "Please Complete Information",
  WRONG_OTP: "The Otp You've Entered Is Incorrect. Please Try Again",
  EMPTY_OTP: "Please Enter The Otp Below",
  OTP_EXPIRE: "The Otp You've Entered Is Expired. Please Login Again",
  ACCOUNT_NOT_LINKED: "Account is not linked",
  INVALID_LINK_ACCOUNT: "Invalid account or account is already linked",
  INVALID_TOKEN_CSRF: "Invalid token",
  SOMETHING_WRONG: "Something wrong",

  // Settings Page
  OLD_PASS_INVALID: "Old password isn't valid",
  NEW_PASS_NOT_STRONG:
    "New password at least 6 characters including a number and a lowercase letter",
  CONFIRM_PASS_INVALID: "Confirm passwod isn't match new password",

  // User
  INVALID_ACCOUNT: "Wrong Email Or Password. Try Again",

  SERVER_ERROR: "Server Error",
  MAIL_ACTIVE_TEMPLATE: "Read Active Mail Template Error",
  MAIL_SEND_VERIFY: "Send Mail To Verify Error",
};

const messageInfo = {
  TWO_FA: "Two-Factor Login Verification",
  SENDED_OTP: "We've Send A Verification Code To Your Email",
  SOCIAL_ACCOUNT_LINKED: "Account social is linked",
  CHANGE_PASS_SUCCESS: "Change password is successfully",
  REMOVE_ACCOUNT_SOCIAL_SUCCESS: "Remove account social is successfully",
  LINK_ACCOUNT_SOCIAL_SUCCESS: "Link account social is successfully",
};

module.exports = { messageError, messageInfo };
