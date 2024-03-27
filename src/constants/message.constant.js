const MESSAGE_ERROR = {
  USER: {
    // Login
    MISSING_CREDENTIALS: "Please Complete Information",
    INVALID_ACCOUNT: "Incorrect email or password",

    // Feature
    LOGOUT_FAILED: "Log out error",
    CREATE_USER_FAILED: "Create user failed",
    EDIT_USER_FAILED: "Edit user information failed",
    CHANGE_PASS_FAILED: "Change password failed",
    DELETE_USER_FAILED: "Delete user failed",

    // Validate create user
    REQUIRED_NAME: "Name is required",
    INVALID_NAME: "Name must be string",
    REQUIRED_EMAIL: "Email is required",
    INVALID_EMAIL: "Invalid email",
    EMAIL_REGISTERED: "Email was registered",
    REQUIRED_PHONE: "Phone is required",
    INVALID_PHONE: "Phone must be Vietnam phone number",
    USER_NOT_FOUND: "User not found",
    REQUIRED_TYPE: "Type is required",
    INVALID_TYPE: "Invalid type",

    // Feature change pass
    REQUIRED_PASS: "Password is required",
    INVALID_PASS: "Password must be string",
    CURPASS_NOT_MATCH: "Password is not correct",
    REQUIRED_NEWPASS: "New password is required",
    INVALID_NEWPASS: "New password must be string",
    NEWPASS_NOT_STRONG:
      "New password at least 4 characters including a number and a lowercase letter",
    INVALID_CONFIRM_PASS: "Confirm password isn't match new password",

    USER_NOT_FOUND: "User not found",
  },

  TYPE: {
    TYPE_NOT_FOUND: "Type not found",
  },

  SOCIAL: {
    SOCIAL_NOT_FOUND: "Account social not found",
    ACCOUNT_NOT_LINKED: "Account is not linked",
    INVALID_LINK_ACCOUNT: "Invalid account or account is already linked",
    LINK_ACCOUNT_FAILED: "Link account failed",
    REMOVE_ACCOUNT_SOCIAL_FAILED: "Unlink social failed",
  },

  OTP: {
    WRONG_OTP: "Otp Is Incorrect. Please Try Again",
    EMPTY_OTP: "Please Enter The Otp Below",
    OTP_EXPIRE: "Otp Is Expired. Please Login Again",
    INVALID_OTP: "Invalid otp",
    OTP_NOT_FOUND: "Otp not found",
    CREATE_OTP_FAILED: "Create otp failed",
  },

  TOKEN: {
    VERIFY_TOKEN_FAILED: "Verify token failed",
    LOGIN_TOKEN_NOT_FOUND: "Login token not found",
  },

  COURSE: {
    // Validate
    REQUIRED_NAME: "Name is required",
    INVALID_NAME: "Name must be string",
    REQUIRED_PRICE: "Price is required",
    INVALID_PRICE: "Invalid price",
    REQUIRED_TEACHER: "Teacher is required",
    INVALID_TEACHER: "Invalid teacher",
    REQUIRED_TRYLEARN: "Try Learn is required",
    INVALID_TRYLEARN: "Invalid try learn",
    REQUIRED_QUANTITY: "Quantity is required",
    INVALID_QUANTITY: "Invalid quantity",
    REQUIRED_DURATION: "Duration is required",
    INVALID_DURATION: "Invalid duration",
    REQUIRED_COURSE: "Course is required",
    INVALID_COURSE: "Invalid course",
    REQUIRED_MODULE: "Module is required",
    MODULE_NOT_FOUND: "Module not found",
    NAME_MODULE_EXISTED: "Name is existed",

    // Feature
    COURSE_EXISTED: "Course is existed",
    COURSE_NOT_FOUND: "Course not found",
    CREATE_COURSE_FAILED: "Create course failed",
    EDIT_COURSE_FAILED: "Edit course failed",
    DELETE_COURSE_FAILED: "Delete course failed",
    CREATE_MODULE_FAILED: "Create module failed",
    EDIT_MODULE_FAILED: "Edit module failed",
    DELETE_MODULE_FAILED: "Delete module failed",
  },

  CLASS: {
    REQUIRED_NAME: "Name is required",
    NAME_EXISTED: "Name is existed",
    INVALID_NAME: "Invalid name",
    REQUIRED_QUANTITY: "Quantity is required",
    INVALID_QUANTITY: "Invalid quantity",
    REQUIRED_SCHEDULE: "Schedule is required",
    INVALID_SCHEDULE: "Invalid schedule",
    REQUIRED_START_DATE: "Start date is required",
    INVALID_START_DATE: "Invalid start date",
    REQUIRED_CLASS: "Class is required",
    INVALID_CLASS: "Invalid class",
    REQUIRED_TIMELEARN: "Time learn is required",
    INVALID_TIMELEARN: "Invalid time learn",
    REQUIRED_COURSE: "Course is required",
    INVALID_COURSE: "Invalid course",
    INVALID_ASSISTANT: "Invalid assistant",
    REQUIRED_STUDENT: "Student is required",
    STUDENT_NOT_FOUND: "Student not found",
    REQUIRED_DATELEARNING: "Date learning is required",
    INVALID_DATELEARNING: "Invalid Date learning",
    REQUIRED_STATUS: "Status is required",
    INVALID_STATUS: "Invalid status",
    INVALID_COMPLETE_DATE: "Invalid complete date",
    INVALID_DROPOUT_DATE: "Invalid dropout date",
    INVALID_RECOVERY_DATE: "Invalid recovery date",
    INVALID_REASON: "Invalid reason",
    REQUIRED_TITLE: "Title is required",
    INVALID_TITLE: "Invalid title",
    EXISTED_TITLE: "Title is existed",
    REQUIRED_TEACHER: "Teacher is required",
    TEACHER_NOT_FOUND: "Teacher is not found",
    INVALID_CONTENT: "Invalid content",
    INVALID_ATTACHMENT: "Invalid attachment",

    STUDENT_JOINED: "This student already in class",
    EXERCISE_NOT_FOUND: "Exercise is not found",

    // Feature
    CLASS_EXISTED: "Class is existed",
    CLASS_NOT_FOUND: "Class not found",
    CREATE_CLASS_FAILED: "Create class failed",
    EDIT_CLASS_FAILED: "Edit class information failed",
    DELETE_CLASS_FAILED: "Delete class failed",
    ADD_STUDENT_TO_CLASS_FAILED: "Add student to class failed",
    EDIT_STUDENT_TO_CLASS_FAILED: "Edit student to class failed",
    DELETE_STUDENT_CLASS_FAILED: "Delete student failed",
    EDIT_ATTENDANCE_CALENDAR_FAILED: "Edit attendance failed",
    CREATE_EXERCISE_FAILED: "Create exercise failed",
    EDIT_EXERCISE_FAILED: "Edit exercise failed",
    DELETE_EXERCISE_FAILED: "Delete exercise failed",
  },

  OTHER: {
    // Token
    INVALID_TOKEN_CSRF: "Invalid token",
    JWT_INVALID_TOKEN: "Token is expired. Please try again",

    // Mail
    SEND_MAIL_FAILED: "Send mail failed",
    READ_MAIL_HTML: "Read Mail Html Error",
  },

  FILE: {
    // Validate
    SIZE_FILE_LIMIT: "File is too large to upload",
    MIMETYPE_WRONG: "File is not right format",
    REMOVE_FILE_UPLOAD_ERROR: "Remove file upload error",
    CREATE_FOLDER_FAILED: "Create folder is failed",

    // Upload
    ERROR_MULTER_UPLOAD: "Multer error occurred when uploading",
    UNKNOWN_ERROR_UPLOAD: "Unknown error occurred when uploading",
    INVALID_HEADERS: "Invalid headers",

    IMPORT_USERS_FAILED: "Import users failed",
    EXPORT_USERS_FAILED: "Export users failed",

    IMPORT_COURSES_FAILED: "Import courses failed",
    EXPORT_COURSES_FAILED: "Export courses failed",

    EXPORT_CLASSES_FAILED: "Export classes failed",
    IMPORT_CLASSES_FAILED: "Import classes failed",
  },
};

const MESSAGE_SUCCESS = {
  OTP: {
    SENDED_OTP: "We've Send A Verification Code To Your Email",
  },

  USER: {
    SENDED_RESET_PASS: "Check your email for a link to reset your password",
    CREATE_USER_SUCCESS: "Create user successfully",
    EDIT_USER_SUCCESS: "Edit user successfully",
    DELETE_USER_SUCCESS: "Delete user successfully",
    CHANGE_PASS_SUCCESS: "Change password successfully",
  },

  FILE: {
    EXPORT_USERS_SUCCESS: "Export users successfully",
    IMPORT_USERS_SUCCESS: "Import users successfully",

    EXPORT_COURSES_SUCCESS: "Export courses successfully",
    IMPORT_COURSES_SUCCESS: "Import courses successfully",

    EXPORT_CLASSES_SUCCESS: "Export classes successfully",
    IMPORT_CLASSES_SUCCESS: "Import classes successfully",
  },

  SOCIAL: {
    REMOVE_ACCOUNT_SOCIAL_SUCCESS: "Remove social account successfully",
    LINK_ACCOUNT_SOCIAL_SUCCESS: "Link social account successfully",
  },

  COURSE: {
    CREATE_COURSE_SUCCESS: "Create course successfully",
    EDIT_COURSE_SUCCESS: "Edit course successfully",
    DELETE_COURSE_SUCCESS: "Delete course successfully",
    CREATE_MODULE_SUCCESS: "Create module succesfully",
    EDIT_MODULE_SUCCESS: "Edit module succesfully",
    DELETE_MODULE_SUCCESS: "Delete module succesfully",
  },

  CLASS: {
    CREATE_CLASS_SUCCESS: "Create class successfully",
    EDIT_CLASS_SUCCESS: "Edit class successfully",
    DELETE_CLASS_SUCCESS: "Delete class successfully",
    ADD_STUDENT_TO_CLASS_SUCCESS: "Add student to class successfully",
    EDIT_STUDENT_TO_CLASS_SUCCESS: "Edit student to class successfully",
    DELETE_STUDENT_CLASS_SUCCESS: "Delete student successfully",
    EDIT_ATTENDANCE_CALENDAR_SUCCESS: "Edit attendance successfully",
    CREATE_EXERCISE_SUCCESS: "Create exercise successfully",
    EDIT_EXERCISE_SUCCESS: "Edit exercise successfully",
    DELETE_EXERCISE_SUCCESS: "Delete exercise successfully",
  },
};

const MESSAGE_INFO = {
  TWO_FA: "Two-Factor Login Verification",
  RESET_PASS_TITLE: "Reset Your Password",
  PASSWORD_ACTIVE_ACCOUNT: "Password Active Account",

  FILE: {
    NOTHING_EXPORT: "Nothing to export",
  },
};

module.exports = {
  MESSAGE_ERROR,
  MESSAGE_INFO,
  MESSAGE_SUCCESS,
};
