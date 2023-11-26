const redirectPath = {
  // Auth
  LOGIN_AUTH: "/auth/login",
  OTP_AUTH: "/auth/otp",
  REGISTER: "/auth/register",

  // Student
  HOME_STUDENT: "/",

  // Teacher
  HOME_TEACHER: "/teacher",

  // Admin
  HOME_ADMIN: "/admin",
};

const renderPath = {
  // Auth
  LOGIN_AUTH: "auth/login",
  OTP_AUTH: "auth/otp",

  // Student
  HOME_STUDENT: "students/home/index",

  // Teacher
  HOME_TEACHER: "teachers/home/index",

  // Teacher
  HOME_ADMIN: "admin/home/index",
};

module.exports = {
  redirectPath,
  renderPath,
};
//