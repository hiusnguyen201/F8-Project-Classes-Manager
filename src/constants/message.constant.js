const MESSAGE_ERROR = {
  USER: {
    // Login
    MISSING_CREDENTIALS: "Please Complete Information",
    INVALID_EMAIL: "Invalid email",
    INVALID_ACCOUNT: "Incorrect email or password",
    LOGOUT_FAILED: "Log out error",

    // Feature
    CREATE_USER_FAILED: "Create user failed",
    UPDATE_USER_FAILED: "Update user information failed",
    CHANGE_PASS_FAILED: "Change password failed",
    DELETE_USER_FAILED: "Delete user failed",
    CHANGE_PASS_FAILED: "Change password user failed",
    LOGIN_FAILED: "Login failed",
    FIND_USER_FAILED: "Find user failed",
    SEND_RESET_PASS: "Send password reset failed",
    COUNT_USER_FAILED: "Count user failed",

    // Validate
    USER_NOT_FOUND: "User not found",
    REQUIRED_NAME: "",
    REQUIRED_EMAIL: "Email is required",
    REQUIRED_USER: "User is required",
    EMAIL_REGISTERD: "Email was registered",
    EMAIL_NOT_EXIST: "Email isn't exist",
    INVALID_PHONE: "Invalid phone",
    REQUIRED_TYPE: "Type is required",
    INVALID_TYPE: "Invalid type",
    INVALID_USER: "Invalid user",
    TYPE_NOT_FOUND: "Type is not found",
    INVALID_OLD_PASS: "Old password isn't valid",
    NEW_PASS_NOT_STRONG:
      "New password at least 6 characters including a number and a lowercase letter",
    INVALID_CONFIRM_PASS: "Confirm passwod isn't match new password",

    USERS_EMPTY: "Users is empty",
  },

  TYPE: {
    TYPE_NOT_FOUND: "Type not found",
    TYPES_EMPTY: "Types is empty",
    FIND_TYPE_FAILED: "Find type failed",
  },

  SOCIAL: {
    ACCOUNT_NOT_LINKED: "Account is not linked",
    INVALID_LINK_ACCOUNT: "Invalid account or account is already linked",

    REMOVE_ACCOUNT_SOCIAL_FAILED: "Unlink social failed",
    CREATE_SOCIAL_FAILED: "Link social failed",
    FIND_SOCIAL_FAILED: "Find social failed",
  },

  OTP: {
    VERIFY_OTP_FAILED: "Verify otp failed",
    WRONG_OTP: "Otp Is Incorrect. Please Try Again",
    EMPTY_OTP: "Please Enter The Otp Below",
    OTP_EXPIRE: "Otp Is Expired. Please Login Again",
    INVALID_OTP: "Invalid otp",
    OTP_NOT_FOUND: "Otp not found",
    REMOVE_OTP_FAILED: "Remove otp failed",
    FIND_OTP_FAILED: "Find otp failed",
    CREATE_OTP_FAILED: "Create otp failed",
  },

  TOKEN: {
    VERIFY_TOKEN_FAILED: "Verify token failed",
    REMOVE_TOKEN_FAILED: "Delete token failed",
    CREATE_TOKEN_FAILED: "Create token failed",
    FIND_TOKEN_FAILED: "Find token failed",
    LOGIN_TOKEN_NOT_FOUND: "Login token not found",
  },

  COURSE: {
    // Validate
    REQUIRED_TEACHER: "Teacher is required",
    REQUIRED_NAME: "Name is required",
    REQUIRED_PRICE: "Price is required",
    INVALID_PRICE: "Invalid price",
    INVALID_TEACHER: "Invalid teacher",
    REQUIRED_TRYLEARN: "Try Learn is required",
    INVALID_TRYLEARN: "Invalid try learn",
    REQUIRED_QUANTITY: "Quantity is required",
    INVALID_QUANTITY: "Invalid quantity",
    REQUIRED_DURATION: "Duration is required",
    INVALID_DURATION: "Invalid duration",
    REQUIRED_COURSE: "Course is required",
    INVALID_COURSE: "Invalid course",

    COURSE_EXISTED: "Course is existed",
    COURSE_NOT_FOUND: "Course not found",
    COURSES_EMPTY: "Courses is empty",
    // Feature
    CREATE_COURSE_FAILED: "Create course failed",
    UPDATE_COURSE_FAILED: "Update course information failed",
    DELETE_COURSE_FAILED: "Delete course failed",
    FIND_COURSE_FAILED: "Find course failed",
    COUNT_COURSE_FAILED: "Count course failed",
  },

  CLASS: {
    CLASS_EXISTED: "Class is existed",
    CLASS_NOT_FOUND: "Class not found",
    CLASSES_EMPTY: "Classes is empty",

    REQUIRED_NAME: "Name is required",
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

    // Feature
    CREATE_CLASS_FAILED: "Create class failed",
    UPDATE_CLASS_FAILED: "Update class information failed",
    DELETE_CLASS_FAILED: "Delete class failed",
    FIND_CLASS_FAILED: "Find class failed",
    COUNT_CLASS_FAILED: "Count class failed",
  },

  OTHER: {
    // Token
    INVALID_TOKEN_CSRF: "Invalid token",
    JWT_INVALID_TOKEN: "Token is expired. Please try again",

    // Mail
    SEND_MAIL_FAILED: "Send mail failed",
    READ_MAIL_HTML: "Read Mail Html Error",

    // Common
    REQUIRED_FIELD: "Field is required",
  },

  FILE: {
    // Validate
    SIZE_FILE_LIMIT: "File is too large to upload",
    MIMETYPE_EXCEL_WRONG: "Please upload only excel format",
    REMOVE_FILE_UPLOAD_ERROR: "Remove file upload error",
    CREATE_FOLDER_FAILED: "Create folder is failed",
    INVALID_KEY: "Invalid key",

    // Upload
    ERROR_MULTER_UPLOAD: "Multer error occurred when uploading",
    UNKNOWN_ERROR_UPLOAD: "Unknown error occurred when uploading",

    // Import
    INVALID_HEADERS: "Invalid headers",

    IMPORT_USERS_FAILED: "Import users failed",
    IMPORT_COURSES_FAILED: "Import courses failed",

    // Export
    EXPORT_USERS_FAILED: "Export users failed",
    EXPORT_COURSES_FAILED: "Export courses failed",
  },
};

const MESSAGE_SUCCESS = {
  OTP: {
    SENDED_OTP: "We've Send A Verification Code To Your Email",
  },

  USER: {
    SENDED_RESET_PASS: "Check your email for a link to reset your password",
    CREATE_USER_SUCCESS: "Create user successfully",
    UPDATE_USER_SUCCESS: "Update user information successfully",
    DELETE_USER_SUCCESS: "Delete user successfully",
    CHANGE_PASS_SUCCESS: "Change password successfully",
  },

  FILE: {
    EXPORT_USERS_SUCCESS: "Export users successfully",
    IMPORT_USERS_SUCCESS: "Import users successfully",

    EXPORT_COURSES_SUCCESS: "Export courses successfully",
    IMPORT_COURSES_SUCCESS: "Import courses successfully",
  },

  SOCIAL: {
    REMOVE_ACCOUNT_SOCIAL_SUCCESS: "Remove social account successfully",
    LINK_ACCOUNT_SOCIAL_SUCCESS: "Link social account successfully",
  },

  COURSE: {
    CREATE_COURSE_SUCCESS: "Create course successfully",
    UPDATE_COURSE_SUCCESS: "Update course successfully",
    DELETE_COURSE_SUCCESS: "Delete course successfully",
  },
};

const MESSAGE_INFO = {
  TWO_FA: "Two-Factor Login Verification",
  RESET_PASS_TITLE: "Reset Your Password",
  PASSWORD_ACTIVE_ACCOUNT: "Password Active Account",
};

module.exports = {
  MESSAGE_ERROR,
  MESSAGE_INFO,
  MESSAGE_SUCCESS,
};
