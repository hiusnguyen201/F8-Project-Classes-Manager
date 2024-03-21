const REDIRECT_PATH = {
  ADMIN: {
    HOME_ADMIN: "/admin",

    HOME_USERS: "/admin/users",
    DETAILS_USER: "/admin/users/details",
    CREATE_USER: "/admin/users/create",
    EDIT_USER: "/admin/users/edit",
    IMPORT_USERS: "/admin/users/import",
    EXPORT_USERS: "/admin/users/export",

    HOME_COURSES: "/admin/courses",
    DETAILS_COURSE: "/admin/courses/details",
    CREATE_COURSE: "/admin/courses/create",
    EDIT_COURSE: "/admin/courses/edit",
    IMPORT_COURSES: "/admin/courses/import",
    EXPORT_COURSES: "/admin/courses/export",

    CREATE_MODULE: "/modules/create",
    EDIT_MODULE: "/modules/edit",
    DELETE_MODULE: "/modules/delete",

    HOME_TEACHERS: "/admin/teachers",
    DETAILS_TEACHER: "/admin/teachers/details",
    CREATE_TEACHER: "/admin/teachers/create",
    EDIT_TEACHER: "/admin/teachers/edit",
    IMPORT_TEACHERS: "/admin/teachers/import",
    EXPORT_TEACHERS: "/admin/teachers/export",

    HOME_STUDENTS: "/admin/students",
    DETAILS_STUDENT: "/admin/students/details",
    CREATE_STUDENT: "/admin/students/create",
    EDIT_STUDENT: "/admin/students/edit",
    IMPORT_STUDENTS: "/admin/students/import",
    EXPORT_STUDENTS: "/admin/students/export",

    HOME_CLASSES: "/admin/classes",
    DETAILS_CLASS: "/admin/classes/details",
    CREATE_CLASS: "/admin/classes/create",
    EDIT_CLASS: "/admin/classes/edit",
    IMPORT_CLASSES: "/admin/classes/import",
    EXPORT_CLASSES: "/admin/classes/export",

    PROFILE_SETTING: "/admin/settings/profile",
    SECURITY_SETTING: "/admin/settings/security",
    PASSWORD_SETTING: "/admin/settings/password",
  },

  AUTH: {
    LOGIN: "/auth/login",
    OTP: "/auth/otp",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    EMAIL_PASS_RESET: "/auth/passwordreset",
    CHANGE_PASSWORD: "/auth/passwordreset/:token",
    LOGIN_GOOGLE: "/auth/google/redirect",
    LOGIN_GITHUB: "/auth/github/redirect",
    LOGIN_FACEBOOK: "/auth/facebook/redirect",
  },

  // Student
  HOME_STUDENT: "/",

  // Teacher
  HOME_TEACHER: "/teacher",

  SETTINGS_PROFILE_TEACHER: "/teacher/settings/profile",
  SETTINGS_SECURITY_TEACHER: "/teacher/settings/security",
  SETTINGS_PASSWORD_TEACHER: "/teacher/settings/password",

  SETTINGS_PROFILE_STUDENT: "/settings/profile",
  SETTINGS_SECURITY_STUDENT: "/settings/security",
  SETTINGS_PASSWORD_STUDENT: "/settings/password",

  // Error
};

const RENDER_PATH = {
  ADMIN: {
    HOME_ADMIN: "admin/dashboard/index",

    HOME_USERS: "admin/users/index",
    DETAILS_USER: "admin/users/details",
    CREATE_USER: "admin/users/create",
    EDIT_USER: "admin/users/edit",
    IMPORT_USERS: "admin/users/import",

    HOME_COURSES: "admin/courses/index",
    DETAILS_COURSE: "admin/courses/details",
    CREATE_COURSE: "admin/courses/create",
    EDIT_COURSE: "admin/courses/edit",
    IMPORT_COURSES: "admin/courses/import",

    CREATE_MODULE: "admin/courses/createModule",
    EDIT_MODULE: "admin/courses/editModule",

    HOME_TEACHERS: "admin/teachers/index",
    DETAILS_TEACHER: "admin/teachers/details",
    CREATE_TEACHER: "admin/teachers/create",
    EDIT_TEACHER: "admin/teachers/edit",
    IMPORT_TEACHERS: "admin/teachers/import",

    HOME_STUDENTS: "admin/students/index",
    DETAILS_STUDENT: "admin/students/details",
    CREATE_STUDENT: "admin/students/create",
    EDIT_STUDENT: "admin/students/edit",
    IMPORT_STUDENTS: "admin/students/import",

    HOME_CLASSES: "admin/classes/index",
    DETAILS_CLASS: "admin/classes/details",
    CREATE_CLASS: "admin/classes/create",
    EDIT_CLASS: "admin/classes/edit",
    IMPORT_CLASS: "admin/classes/import",

    PROFILE_SETTING: "admin/settings/profile",
    SECURITY_SETTING: "admin/settings/security",
    PASSWORD_SETTING: "admin/settings/password",
  },

  AUTH: {
    LOGIN: "auth/login",
    OTP: "auth/otp",
    EMAIL_PASS_RESET: "auth/emailPassReset",
    CHANGE_PASSWORD: "auth/resetPassword",
  },

  // Student
  HOME_STUDENT: "students/home/index",

  // Teacher
  HOME_TEACHER: "teachers/home/index",

  // Error
  NOT_FOUND_PAGE: "errors/404",
};

module.exports = {
  REDIRECT_PATH,
  RENDER_PATH,
};
