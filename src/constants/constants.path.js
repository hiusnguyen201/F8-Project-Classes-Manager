const redirectPath = {
  // Auth
  LOGIN_AUTH: "/auth/login",
  OTP_AUTH: "/auth/otp",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  EMAIL_PASS_RESET: "/auth/passwordreset",
  RESET_PASSWORD_LINK: "/auth/passwordreset/:token",
  LOGIN_GOOGLE: "/auth/google/redirect",
  LOGIN_GITHUB: "/auth/github/redirect",
  LOGIN_FACEBOOK: "/auth/facebook/redirect",

  // Student
  HOME_STUDENT: "/",

  // Teacher
  HOME_TEACHER: "/teacher",

  // Admin
  HOME_ADMIN: "/admin",
  HOME_ADMIN_USERS: "/admin/users",

  // Setting
  SETTINGS_ADMIN: "/admin/settings",
  SETTINGS_TEACHER: "/teacher/settings",
  SETTINGS_STUDENT: "/settings",

  SETTINGS_PROFILE_ADMIN: "/admin/settings/profile",
  SETTINGS_SECURITY_ADMIN: "/admin/settings/security",
  SETTINGS_PASSWORD_ADMIN: "/admin/settings/password",

  SETTINGS_PROFILE_TEACHER: "/teacher/settings/profile",
  SETTINGS_SECURITY_TEACHER: "/teacher/settings/security",
  SETTINGS_PASSWORD_TEACHER: "/teacher/settings/password",

  SETTINGS_PROFILE_STUDENT: "/settings/profile",
  SETTINGS_SECURITY_STUDENT: "/settings/security",
  SETTINGS_PASSWORD_STUDENT: "/settings/password",

  // Error
  HOME_ERRORS: "/errors",
};

const renderPath = {
  // Auth
  LOGIN_AUTH: "auth/login",
  OTP_AUTH: "auth/otp",
  EMAIL_PASS_RESET: "auth/emailPassReset",
  RESET_PASSWORD_LINK: "auth/resetPassword",

  // Student
  HOME_STUDENT: "students/home/index",

  // Teacher
  HOME_TEACHER: "teachers/home/index",

  // Admin
  HOME_ADMIN: "admin/home/index",
  HOME_ADMIN_USERS: "admin/users/index",

  // Setting
  HOME_SETTING: "settings/index",

  // Error
  HOME_ERRORS: "errors/index",
};

module.exports = {
  redirectPath,
  renderPath,
};
//
