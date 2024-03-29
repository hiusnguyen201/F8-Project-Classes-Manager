const REDIRECT_PATH = {
  ADMIN: {
    HOME_ADMIN: "/admin",

    // Users
    HOME_USERS: "/admin/users",
    DETAILS_USER: "/admin/users/details",
    CREATE_USER: "/admin/users/create",
    EDIT_USER: "/admin/users/edit",
    IMPORT_USERS: "/admin/users/import",
    EXPORT_USERS: "/admin/users/export",

    // Courses
    HOME_COURSES: "/admin/courses",
    DETAILS_COURSE: "/admin/courses/details",
    CREATE_COURSE: "/admin/courses/create",
    EDIT_COURSE: "/admin/courses/edit",
    IMPORT_COURSES: "/admin/courses/import",
    EXPORT_COURSES: "/admin/courses/export",
    CREATE_MODULE: "/modules/create",
    EDIT_MODULE: "/modules/edit",
    DELETE_MODULE: "/modules/delete",

    // Teachers
    HOME_TEACHERS: "/admin/teachers",
    DETAILS_TEACHER: "/admin/teachers/details",
    CALENDARS_TEACHER: "/calendars",
    CREATE_TEACHER: "/admin/teachers/create",
    EDIT_TEACHER: "/admin/teachers/edit",
    IMPORT_TEACHERS: "/admin/teachers/import",
    EXPORT_TEACHERS: "/admin/teachers/export",

    // Students
    HOME_STUDENTS: "/admin/students",
    DETAILS_STUDENT: "/admin/students/details",
    CREATE_STUDENT: "/admin/students/create",
    EDIT_STUDENT: "/admin/students/edit",
    IMPORT_STUDENTS: "/admin/students/import",
    EXPORT_STUDENTS: "/admin/students/export",

    // Classes
    HOME_CLASSES: "/admin/classes",
    DETAILS_CLASS: "/admin/classes/details",
    CREATE_CLASS: "/admin/classes/create",
    EDIT_CLASS: "/admin/classes/edit",
    IMPORT_CLASSES: "/admin/classes/import",
    EXPORT_CLASSES: "/admin/classes/export",
    MANAGE_STUDENTS_CLASS: "/students",
    ADD_STUDENT_CLASS: "/students/add",
    EDIT_STUDENT_CLASS: "/students/edit",
    DELETE_STUDENT_CLASS: "/students/delete",
    MANAGE_CALENDARS_CLASS: "/calendars",
    MANAGE_EXERCISES_CLASS: "/exercises",
    CREATE_EXERCISE_CLASS: "/exercises/create",
    EDIT_EXERCISE_CLASS: "/exercises/edit",
    DETAILS_EXERCISE_CLASS: "/exercises/details",
    MANAGE_QUESTIONS_CLASS: "/questions",
    CREATE_QUESTION_CLASS: "/questions/create",
    EDIT_QUESTION_CLASS: "/questions/edit",
    DETAILS_QUESTION_CLASS: "/questions/details",

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
    CALENDARS_TEACHER: "admin/teachers/calendars",
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
    IMPORT_CLASSES: "admin/classes/import",
    MANAGE_STUDENTS_CLASS: "admin/classes/manageStudents",
    ADD_STUDENT_CLASS: "admin/classes/addStudent",
    EDIT_STUDENT_CLASS: "admin/classes/editStudent",
    MANAGE_CALENDARS_CLASS: "admin/classes/manageCalendars",
    CALENDAR_ATTENDANCES: "admin/classes/calendarsAttendance",
    MANAGE_EXERCISES_CLASS: "admin/classes/manageExercises",
    CREATE_EXERCISE_CLASS: "admin/classes/createExercise",
    EDIT_EXERCISE_CLASS: "admin/classes/editExercise",
    DETAILS_EXERCISE_CLASS: "admin/classes/detailsExercise",
    MANAGE_QUESTIONS_CLASS: "admin/classes/manageQuestions",
    CREATE_QUESTION_CLASS: "admin/classes/createQuestion",
    EDIT_QUESTION_CLASS: "admin/classes/editQuestion",
    DETAILS_QUESTION_CLASS: "admin/classes/detailsQuestion",

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
