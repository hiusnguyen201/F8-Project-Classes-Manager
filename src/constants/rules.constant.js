const { MESSAGE_ERROR } = require("../constants/message.constant");

const USER_RULES = {
  CREATE: {
    RULES: {
      name: "required|string",
      email: "required|email|unique:users,email",
      phone: "required|phone:vi-VN",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:vi-VN": MESSAGE_ERROR.USER.INVALID_PHONE,
    },
  },

  EDIT: {
    RULES: {
      name: "required|string",
      email: "required|email|unique:users,email,id,id",
      phone: "required|phone:vi-VN",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email,id,id": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:vi-VN": MESSAGE_ERROR.USER.INVALID_PHONE,
    },
  },

  CHANGE_PASS: {
    RULES: {
      oldPassword: "required|string|currentPassword",
      newPassword: "required|string|strongPassword",
      confirmPassword: "confirmed:newPassword",
    },
    MESSAGES: {
      "oldPassword.required": MESSAGE_ERROR.USER.REQUIRED_PASS,
      "oldPassword.string": MESSAGE_ERROR.USER.INVALID_PASS,
      "oldPassword.currentPassword": MESSAGE_ERROR.USER.CURPASS_NOT_MATCH,
      "newPassword.required": MESSAGE_ERROR.USER.REQUIRED_NEWPASS,
      "newPassword.string": MESSAGE_ERROR.USER.INVALID_PASS,
      "newPassword.strongPassword": MESSAGE_ERROR.USER.NEWPASS_NOT_STRONG,
      "confirmPassword.confirmed:newPassword":
        MESSAGE_ERROR.USER.INVALID_CONFIRM_PASS,
    },
  },
};

const COURSE_RULES = {
  CREATE: {
    RULES: {
      name: "required|string",
      price: "required|integer",
      teacherId: "required|integer|exists:users,id",
      tryLearn: "required|integer",
      quantity: "required|integer",
      duration: "required|integer|min:1",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.COURSE.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.COURSE.INVALID_NAME,
      "price.required": MESSAGE_ERROR.COURSE.REQUIRED_PRICE,
      "price.integer": MESSAGE_ERROR.COURSE.INVALID_PRICE,
      "teacherId.required": MESSAGE_ERROR.COURSE.REQUIRED_TEACHER,
      "teacherId.integer": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "teacherId.exists:users,id": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "tryLearn.required": MESSAGE_ERROR.COURSE.REQUIRED_TRYLEARN,
      "tryLearn.integer": MESSAGE_ERROR.COURSE.INVALID_TRYLEARN,
      "quantity.required": MESSAGE_ERROR.COURSE.REQUIRED_QUANTITY,
      "quantity.integer": MESSAGE_ERROR.COURSE.INVALID_QUANTITY,
      "duration.required": MESSAGE_ERROR.COURSE.REQUIRED_DURATION,
      "duration.integer": MESSAGE_ERROR.COURSE.INVALID_DURATION,
    },
  },

  EDIT: {
    RULES: {
      name: "required|string",
      price: "required|integer",
      teacherId: "required|integer|exists:users,id",
      tryLearn: "required|integer",
      quantity: "required|integer",
      duration: "required|integer|min:1",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.COURSE.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.COURSE.INVALID_NAME,
      "price.required": MESSAGE_ERROR.COURSE.REQUIRED_PRICE,
      "price.integer": MESSAGE_ERROR.COURSE.INVALID_PRICE,
      "teacherId.required": MESSAGE_ERROR.COURSE.REQUIRED_TEACHER,
      "teacherId.integer": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "teacherId.exists:users,id": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "tryLearn.required": MESSAGE_ERROR.COURSE.REQUIRED_TRYLEARN,
      "tryLearn.integer": MESSAGE_ERROR.COURSE.INVALID_TRYLEARN,
      "quantity.required": MESSAGE_ERROR.COURSE.REQUIRED_QUANTITY,
      "quantity.integer": MESSAGE_ERROR.COURSE.INVALID_QUANTITY,
      "duration.required": MESSAGE_ERROR.COURSE.REQUIRED_DURATION,
      "duration.integer": MESSAGE_ERROR.COURSE.INVALID_DURATION,
    },
  },
};

const MODULE_RULES = {
  CREATE: {
    RULES: {
      name: "required|string|unique:course_modules,name",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.COURSE.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.COURSE.INVALID_NAME,
      "name.unique:course_modules,name":
        MESSAGE_ERROR.COURSE.NAME_MODULE_EXISTED,
    },
  },

  EDIT: {
    RULES: {
      name: "required|string|unique:course_modules,name,id,id",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.COURSE.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.COURSE.INVALID_NAME,
      "name.unique:course_modules,name,id,id":
        MESSAGE_ERROR.COURSE.NAME_MODULE_EXISTED,
    },
  },
};

const TEACHER_RULES = {
  CREATE: {
    RULES: {
      name: "required|string",
      email: "required|email|unique:users,email",
      phone: "required|phone:vi-VN",
      typeId: "required|integer|exists:types,id",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:vi-VN": MESSAGE_ERROR.USER.INVALID_PHONE,
      "typeId.required": MESSAGE_ERROR.USER.REQUIRED_TYPE,
      "typeId.integer": MESSAGE_ERROR.USER.INVALID_TYPE,
      "typeId.exists:types,id": MESSAGE_ERROR.USER.INVALID_TYPE,
    },
  },

  EDIT: {
    RULES: {
      name: "required|string",
      email: "required|email|unique:users,email,id,id",
      phone: "required|phone:vi-VN",
      typeId: "required|integer|exists:types,id",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email,id,id": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:vi-VN": MESSAGE_ERROR.USER.INVALID_PHONE,
      "typeId.required": MESSAGE_ERROR.USER.REQUIRED_TYPE,
      "typeId.integer": MESSAGE_ERROR.USER.INVALID_TYPE,
      "typeId.exists:types,id": MESSAGE_ERROR.USER.INVALID_TYPE,
    },
  },
};

const OTP_RULES = {
  RULES: {
    "otp.*": "required",
  },
  MESSAGES: {
    "otp.*.required": MESSAGE_ERROR.OTP.EMPTY_OTP,
  },
};

const CLASS_RULES = {
  CREATE: {
    RULES: {
      name: "required|string|unique:classes,name",
      quantity: "required|integer",
      startDate: "required|string|date:DD/MM/YYYY",
      schedule: "required",
      timeLearnStart: "required|time",
      timeLearnEnd: "required|time",
      courseId: "required|integer",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.CLASS.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.CLASS.INVALID_NAME,
      "name.unique:classes,name": MESSAGE_ERROR.CLASS.CLASS_EXISTED,
      "quantity.required": MESSAGE_ERROR.CLASS.REQUIRED_QUANTITY,
      "quantity.integer": MESSAGE_ERROR.CLASS.INVALID_QUANTITY,
      "startDate.required": MESSAGE_ERROR.CLASS.REQUIRED_START_DATE,
      "startDate.string": MESSAGE_ERROR.CLASS.INVALID_START_DATE,
      "startDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_START_DATE,
      "schedule.required": MESSAGE_ERROR.CLASS.REQUIRED_SCHEDULE,
      "timeLearnStart.required": MESSAGE_ERROR.CLASS.REQUIRED_TIMELEARN,
      "timeLearnEnd.required": MESSAGE_ERROR.CLASS.REQUIRED_TIMELEARN,
      "courseId.required": MESSAGE_ERROR.CLASS.REQUIRED_COURSE,
      "courseId.integer": MESSAGE_ERROR.CLASS.INVALID_COURSE,
    },
  },
  EDIT: {
    RULES: {
      name: "required|string",
      quantity: "required|integer",
      startDate: "required|string|date:DD/MM/YYYY",
      schedule: "required",
      timeLearnStart: "required|time",
      timeLearnEnd: "required|time",
      courseId: "required|integer",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.CLASS.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.CLASS.INVALID_NAME,
      "quantity.required": MESSAGE_ERROR.CLASS.REQUIRED_QUANTITY,
      "quantity.integer": MESSAGE_ERROR.CLASS.INVALID_QUANTITY,
      "startDate.required": MESSAGE_ERROR.CLASS.REQUIRED_START_DATE,
      "startDate.string": MESSAGE_ERROR.CLASS.INVALID_START_DATE,
      "startDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_START_DATE,
      "schedule.required": MESSAGE_ERROR.CLASS.REQUIRED_SCHEDULE,
      "timeLearnStart.required": MESSAGE_ERROR.CLASS.REQUIRED_TIMELEARN,
      "timeLearnEnd.required": MESSAGE_ERROR.CLASS.REQUIRED_TIMELEARN,
      "courseId.required": MESSAGE_ERROR.CLASS.REQUIRED_COURSE,
      "courseId.integer": MESSAGE_ERROR.CLASS.INVALID_COURSE,
    },
  },
  ADD_STUDENT: {
    RULES: {
      student: "required|integer|exists:users,id",
      status: "required|integer|exists:learning_statuses,id",
      completeDate: "nullable|string|date:DD/MM/YYYY",
      dropoutDate: "nullable|string|date:DD/MM/YYYY",
      recoverDate: "nullable|string|date:DD/MM/YYYY",
      reason: "nullable|string",
    },
    MESSAGES: {
      "student.required": MESSAGE_ERROR.CLASS.REQUIRED_STUDENT,
      "student.integer": MESSAGE_ERROR.CLASS.STUDENT_NOT_FOUND,
      "student.exists:users,id": MESSAGE_ERROR.CLASS.STUDENT_NOT_FOUND,
      "status.required": MESSAGE_ERROR.CLASS.REQUIRED_STATUS,
      "status.integer": MESSAGE_ERROR.CLASS.INVALID_STATUS,
      "status.exists:learning_statuses,id": MESSAGE_ERROR.CLASS.INVALID_STATUS,
      "completeDate.string": MESSAGE_ERROR.CLASS.INVALID_COMPLETE_DATE,
      "completeDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_COMPLETE_DATE,
      "dropoutDate.string": MESSAGE_ERROR.CLASS.INVALID_DROPOUT_DATE,
      "dropoutDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_DROPOUT_DATE,
      "recoverDate.string": MESSAGE_ERROR.CLASS.INVALID_RECOVERY_DATE,
      "recoverDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_RECOVERY_DATE,
      "reason.string": MESSAGE_ERROR.CLASS.INVALID_REASON,
    },
  },
  EDIT_STUDENT: {
    RULES: {
      student: "required|integer|exists:users,id",
      status: "required|integer|exists:learning_statuses,id",
      completeDate: "nullable|string|date:DD/MM/YYYY",
      dropoutDate: "nullable|string|date:DD/MM/YYYY",
      recoverDate: "nullable|string|date:DD/MM/YYYY",
      reason: "nullable|string",
    },
    MESSAGES: {
      "student.required": MESSAGE_ERROR.CLASS.REQUIRED_STUDENT,
      "student.integer": MESSAGE_ERROR.CLASS.STUDENT_NOT_FOUND,
      "student.exists:users,id": MESSAGE_ERROR.CLASS.STUDENT_NOT_FOUND,
      "status.required": MESSAGE_ERROR.CLASS.REQUIRED_STATUS,
      "status.integer": MESSAGE_ERROR.CLASS.INVALID_STATUS,
      "status.exists:learning_statuses,id": MESSAGE_ERROR.CLASS.INVALID_STATUS,
      "completeDate.string": MESSAGE_ERROR.CLASS.INVALID_COMPLETE_DATE,
      "completeDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_COMPLETE_DATE,
      "dropoutDate.string": MESSAGE_ERROR.CLASS.INVALID_DROPOUT_DATE,
      "dropoutDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_DROPOUT_DATE,
      "recoverDate.string": MESSAGE_ERROR.CLASS.INVALID_RECOVERY_DATE,
      "recoverDate.date:DD/MM/YYYY": MESSAGE_ERROR.CLASS.INVALID_RECOVERY_DATE,
      "reason.string": MESSAGE_ERROR.CLASS.INVALID_REASON,
    },
  },
  CREATE_EXERCISE: {
    RULES: {
      title: "required|string|min:4|max:200|unique:exercises,title",
      content: "required|string",
      attachment: "nullable|string|max:200",
    },
    MESSAGES: {
      "title.required": "Title is required",
      "title.string": "Title must be characters",
      "title.min:4": "Title must has a minimum length of 4",
      "title.max:200": "Title must has a maximum length of 200",
      "title.unique:exercises,title": "Title is existed",
      "content.required": "Content is required",
      "content.string": "Content must be characters",
      "attachment.string": "Attachment must be characters",
      "attachment.max:200": "Attachment must has a maximum length of 200",
    },
  },
  EDIT_EXERCISE: {
    RULES: {
      title: "required|string|min:4|max:200|unique:exercises,title,id,id",
      content: "nullable|string",
      attachment: "nullable|string|max:200",
    },
    MESSAGES: {
      "title.required": "Title is required",
      "title.string": "Title must be characters",
      "title.min:4": "Title must has a minimum length of 4",
      "title.max:200": "Title must has a maximum length of 200",
      "title.unique:exercises,title": "Title is existed",
      "content.string": "Content must be characters",
      "attachment.string": "Attachment must be characters",
      "attachment.max:200": "Attachment must has a maximum length of 200",
    },
  },
  CREATE_SUBMIT_EXERCISE: {
    RULES: {
      attachment: "required|string|max:200",
    },
    MESSAGES: {
      "attachment.required": "Attachment is required",
      "attachment.string": "Attachment must be characters",
      "attachment.max:200": "Attachment must has a maximum length of 200",
    },
  },
  EDIT_SUBMIT_EXERCISE: {
    RULES: {
      attachment: "required|string|max:200",
    },
    MESSAGES: {
      "attachment.required": "Attachment is required",
      "attachment.string": "Attachment must be characters",
      "attachment.max:200": "Attachment must has a maximum length of 200",
    },
  },

  CREATE_QUESTION: {
    RULES: {
      title: "required|string|min:4|max:200",
      content: "nullable|string",
    },
    MESSAGES: {
      "title.required": "Title is required",
      "title.string": "Title must be characters",
      "title.min:4": "Title must has a minimum length of 4",
      "title.max:200": "Title must has a maximum length of 200",
      "content.required": "Content is required",
      "content.string": "Content must be characters",
    },
  },
  EDIT_QUESTION: {
    RULES: {
      title: "required|string|min:4|max:200",
      content: "nullable|string",
    },
    MESSAGES: {
      "title.required": "Title is required",
      "title.string": "Title must be characters",
      "title.min:4": "Title must has a minimum length of 4",
      "title.max:200": "Title must has a maximum length of 200",
      "content.required": "Content is required",
      "content.string": "Content must be characters",
    },
  },

  CREATE_COMMENT: {
    RULES: {
      content: "string",
    },
    MESSAGES: {
      "content.required": "Content is required",
      "content.string": "Content must be characters",
    },
  },
  EDIT_COMMENT: {
    RULES: {
      content: "string",
    },
    MESSAGES: {
      "content.required": "Content is required",
      "content.string": "Content must be characters",
    },
  },
};

const RULES_REQUEST = {
  OTP_RULES,
  USER_RULES,
  COURSE_RULES,
  TEACHER_RULES,
  CLASS_RULES,
  MODULE_RULES,
};

module.exports = {
  RULES_REQUEST,
};
