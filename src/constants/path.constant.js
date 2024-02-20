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

  HOME_USERS_ADMIN: "/admin/users",
  CREATE_USER: "/admin/users/create",
  EDIT_USER: "/admin/users/edit",
  IMPORT_USERS: "/admin/users/import",
  EXPORT_USERS: "/admin/users/export",

  HOME_COURSES_ADMIN: "/admin/courses",
  CREATE_COURSE: "/admin/courses/create",
  EDIT_COURSE: "/admin/courses/edit",
  IMPORT_COURSES: "/admin/courses/import",
  EXPORT_COURSES: "/admin/courses/export",

  HOME_TEACHERS_ADMIN: "/admin/teachers",
  CREATE_TEACHER: "/admin/teachers/create",
  EDIT_TEACHER: "/admin/teachers/edit",
  IMPORT_TEACHERS: "/admin/teachers/import",
  EXPORT_TEACHERS: "/admin/teachers/export",

  HOME_STUDENTS_ADMIN: "/admin/students",
  CREATE_STUDENT: "/admin/students/create",
  EDIT_STUDENT: "/admin/students/edit",
  IMPORT_STUDENTS: "/admin/students/import",
  EXPORT_STUDENTS: "/admin/students/export",

  HOME_CLASSES_ADMIN: "/admin/classes",
  CREATE_CLASS: "/admin/classes/create",
  EDIT_CLASS: "/admin/classes/edit",
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

  HOME_SETTING_ADMIN: "admin/settings/index",

  HOME_USERS_ADMIN: "admin/users/index",
  CREATE_USER: "admin/users/create",
  EDIT_USER: "admin/users/edit",
  IMPORT_USERS: "admin/users/import",

  HOME_COURSES_ADMIN: "admin/courses/index",
  CREATE_COURSE: "admin/courses/create",
  EDIT_COURSE: "admin/courses/edit",
  IMPORT_COURSES: "admin/courses/import",

  HOME_TEACHERS_ADMIN: "admin/teachers/index",
  CREATE_TEACHER: "admin/teachers/create",
  EDIT_TEACHER: "admin/teachers/edit",
  IMPORT_TEACHERS: "admin/teachers/import",

  HOME_STUDENTS_ADMIN: "admin/students/index",
  CREATE_STUDENT: "admin/students/create",
  EDIT_STUDENT: "admin/students/edit",
  IMPORT_STUDENTS: "admin/students/import",

  HOME_CLASSES_ADMIN: "admin/classes/index",
  CREATE_CLASS: "admin/classes/create",
  EDIT_CLASS: "admin/classes/edit",
  IMPORT_CLASSES: "admin/classes/import",

  // Error
  NOT_FOUND_PAGE: "errors/404",
};

module.exports = {
  REDIRECT_PATH,
  RENDER_PATH,
};
