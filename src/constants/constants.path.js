const redirectPath = {
  // Auth
  LOGIN_AUTH: "/auth/login",
  OTP_AUTH: "/auth/otp",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",

  // Student
  HOME_STUDENT: "/",

  // Teacher
  HOME_TEACHER: "/teacher",

  // Admin
  HOME_ADMIN: "/admin",
  SETTINGS_ADMIN: "/admin/settings",
  SETTINGS_PROFILE_ADMIN: "/admin/settings/profile",
  SETTINGS_SECURITY_ADMIN: "/admin/settings/security",
};

const renderPath = {
  // Auth
  LOGIN_AUTH: "auth/login",
  OTP_AUTH: "auth/otp",

  // Student
  HOME_STUDENT: "students/home/index",

  // Teacher
  HOME_TEACHER: "teachers/home/index",

  // Admin
  HOME_ADMIN: "admin/home/index",
  SETTINGS_ADMIN: "admin/home/settings",
};

module.exports = {
  redirectPath,
  renderPath,
};
