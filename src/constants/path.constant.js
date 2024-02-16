const REDIRECT_PATH = {
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

  USERS_ADMIN: "/admin/users",
  IMPORT_USERS: "/admin/users/import",
  EXPORT_USERS: "/admin/users/export",

  COURSES_ADMIN: "/admin/courses",
  IMPORT_COURSES: "/admin/courses/import",
  EXPORT_COURSES: "/admin/courses/export",

  TEACHERS_ADMIN: "/admin/teachers",
  IMPORT_TEACHERS: "/admin/teachers/import",
  EXPORT_TEACHERS: "/admin/teachers/export",

  STUDENTS_ADMIN: "/admin/students",
  IMPORT_STUDENTS: "/admin/students/import",
  EXPORT_STUDENTS: "/admin/students/export",

  CLASSES_ADMIN: "/admin/classes",
  IMPORT_CLASSES: "/admin/classes/import",
  EXPORT_CLASSES: "/admin/classes/export",

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

const RENDER_PATH = {
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
  HOME_ADMIN: "admin/dashboard/index",

  HOME_ADMIN_SETTING: "admin/settings/index",

  HOME_ADMIN_USERS: "admin/users/index",
  ADMIN_IMPORT_USERS: "admin/users/import",

  HOME_ADMIN_COURSES: "admin/courses/index",
  ADMIN_IMPORT_COURSES: "admin/courses/import",

  HOME_ADMIN_TEACHERS: "admin/teachers/index",
  ADMIN_IMPORT_TEACHERS: "admin/teachers/import",

  HOME_ADMIN_STUDENTS: "admin/students/index",
  ADMIN_IMPORT_STUDENTS: "admin/students/import",

  HOME_ADMIN_CLASSES: "admin/classes/index",
  ADMIN_IMPORT_CLASSES: "admin/classes/import",

  // Error
  HOME_ERRORS: "errors/index",
};

module.exports = {
  REDIRECT_PATH,
  RENDER_PATH,
};
