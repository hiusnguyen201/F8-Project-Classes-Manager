const { MESSAGE_ERROR } = require("../constants/message.constant");

const USER_RULES = {
  GET: {
    RULES: {
      id: "required|integer|gt:0|exists:users,id",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.USER.INVALID_USER,
      "id.integer": MESSAGE_ERROR.USER.INVALID_USER,
      "id.gt:0": MESSAGE_ERROR.USER.INVALID_USER,
      "id.exists:users,id": MESSAGE_ERROR.USER.INVALID_USER,
    },
  },

  CREATE: {
    RULES: {
      name: "required|string",
      email: "required|email|unique:users,email",
      phone: "required|phone:+84",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:+84": MESSAGE_ERROR.USER.INVALID_PHONE,
    },
  },

  EDIT: {
    RULES: {
      id: "required|integer|gt:0|exists:users,id",
      name: "required|string",
      email: "required|email|unique:users,email,id,id",
      phone: "required|phone:+84",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.USER.INVALID_USER,
      "id.integer": MESSAGE_ERROR.USER.INVALID_USER,
      "id.gt:0": MESSAGE_ERROR.USER.INVALID_USER,
      "id.exists:users,id": MESSAGE_ERROR.USER.INVALID_USER,
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email,id,id": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:+84": MESSAGE_ERROR.USER.INVALID_PHONE,
    },
  },

  DELETE: {
    RULES: {
      id: "required",
      "id.*": "integer|gt:0",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.USER.INVALID_USER,
      "id.*.integer": MESSAGE_ERROR.USER.INVALID_USER,
      "id.*.gt:0": MESSAGE_ERROR.USER.INVALID_USER,
    },
  },
};

const COURSE_RULES = {
  GET: {
    RULES: {
      id: "required|integer|gt:0|exists:courses,id",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "id.integer": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "id.gt:0": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "id.exists:courses,id": MESSAGE_ERROR.COURSE.INVALID_COURSE,
    },
  },

  CREATE: {
    RULES: {
      name: "required|string",
      price: "required|integer|gte:0",
      teacherId: "required|integer|gt:0|exists:users,id",
      tryLearn: "required|integer|gte:0",
      quantity: "required|integer|gt:0",
      duration: "required|integer|gt:0",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.COURSE.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.COURSE.INVALID_NAME,
      "price.required": MESSAGE_ERROR.COURSE.REQUIRED_PRICE,
      "price.integer": MESSAGE_ERROR.COURSE.INVALID_PRICE,
      "price.gte:0": MESSAGE_ERROR.COURSE.INVALID_PRICE,
      "teacherId.required": MESSAGE_ERROR.COURSE.REQUIRED_TEACHER,
      "teacherId.integer": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "teacherId.gt:0": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "teacherId.exists:users,id": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "tryLearn.required": MESSAGE_ERROR.COURSE.REQUIRED_TRYLEARN,
      "tryLearn.integer": MESSAGE_ERROR.COURSE.INVALID_TRYLEARN,
      "tryLearn.gte:0": MESSAGE_ERROR.COURSE.INVALID_TRYLEARN,
      "quantity.required": MESSAGE_ERROR.COURSE.REQUIRED_QUANTITY,
      "quantity.integer": MESSAGE_ERROR.COURSE.INVALID_QUANTITY,
      "quantity.gt:0": MESSAGE_ERROR.COURSE.INVALID_QUANTITY,
      "duration.required": MESSAGE_ERROR.COURSE.REQUIRED_DURATION,
      "duration.integer": MESSAGE_ERROR.COURSE.INVALID_DURATION,
      "duration.gt:0": MESSAGE_ERROR.COURSE.INVALID_DURATION,
    },
  },

  EDIT: {
    RULES: {
      id: "required|integer|gt:0|exists:courses,id",
      name: "required|string",
      price: "required|integer|gte:0",
      teacherId: "required|integer|gt:0|exists:users,id",
      tryLearn: "required|integer|gte:0",
      quantity: "required|integer|gt:0",
      duration: "required|integer|gt:0",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.COURSE.REQUIRED_COURSE,
      "id.integer": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "id.gt:0": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "id.exists:courses,id": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "name.required": MESSAGE_ERROR.COURSE.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.COURSE.INVALID_NAME,
      "price.required": MESSAGE_ERROR.COURSE.REQUIRED_PRICE,
      "price.integer": MESSAGE_ERROR.COURSE.INVALID_PRICE,
      "price.gte:0": MESSAGE_ERROR.COURSE.INVALID_PRICE,
      "teacherId.required": MESSAGE_ERROR.COURSE.REQUIRED_TEACHER,
      "teacherId.integer": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "teacherId.gt:0": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "teacherId.exists:users,id": MESSAGE_ERROR.COURSE.INVALID_TEACHER,
      "tryLearn.required": MESSAGE_ERROR.COURSE.REQUIRED_TRYLEARN,
      "tryLearn.integer": MESSAGE_ERROR.COURSE.INVALID_TRYLEARN,
      "tryLearn.gte:0": MESSAGE_ERROR.COURSE.INVALID_TRYLEARN,
      "quantity.required": MESSAGE_ERROR.COURSE.REQUIRED_QUANTITY,
      "quantity.integer": MESSAGE_ERROR.COURSE.INVALID_QUANTITY,
      "quantity.gt:0": MESSAGE_ERROR.COURSE.INVALID_QUANTITY,
      "duration.required": MESSAGE_ERROR.COURSE.REQUIRED_DURATION,
      "duration.integer": MESSAGE_ERROR.COURSE.INVALID_DURATION,
      "duration.gt:0": MESSAGE_ERROR.COURSE.INVALID_DURATION,
    },
  },

  DELETE: {
    RULES: {
      id: "required",
      "id.*": "integer|gt:0",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "id.*.integer": MESSAGE_ERROR.COURSE.INVALID_COURSE,
      "id.*.gt:0": MESSAGE_ERROR.COURSE.INVALID_COURSE,
    },
  },
};

const TEACHER_RULES = {
  GET: {
    RULES: {
      id: "required|integer|gt:0|exists:users,id",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.USER.INVALID_USER,
      "id.integer": MESSAGE_ERROR.USER.INVALID_USER,
      "id.gt:0": MESSAGE_ERROR.USER.INVALID_USER,
      "id.exists:users,id": MESSAGE_ERROR.USER.INVALID_USER,
    },
  },

  CREATE: {
    RULES: {
      name: "required|string",
      email: "required|email|unique:users,email",
      phone: "required|phone:+84",
      typeId: "required|integer|gt:0|exists:types,id",
    },
    MESSAGES: {
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:+84": MESSAGE_ERROR.USER.INVALID_PHONE,
      "typeId.required": MESSAGE_ERROR.USER.REQUIRED_TYPE,
      "typeId.integer": MESSAGE_ERROR.USER.INVALID_TYPE,
      "typeId.gt:0": MESSAGE_ERROR.USER.INVALID_TYPE,
      "typeId.exists:types,id": MESSAGE_ERROR.USER.INVALID_TYPE,
    },
  },

  EDIT: {
    RULES: {
      id: "required|integer|gt:0|exists:users,id",
      name: "required|string",
      email: "required|email|unique:users,email,id,id",
      phone: "required|phone:+84",
      typeId: "required|integer|gt:0|exists:types,id",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.USER.INVALID_USER,
      "id.integer": MESSAGE_ERROR.USER.INVALID_USER,
      "id.gt:0": MESSAGE_ERROR.USER.INVALID_USER,
      "id.exists:users,id": MESSAGE_ERROR.USER.INVALID_USER,
      "name.required": MESSAGE_ERROR.USER.REQUIRED_NAME,
      "name.string": MESSAGE_ERROR.USER.INVALID_NAME,
      "email.required": MESSAGE_ERROR.USER.REQUIRED_EMAIL,
      "email.email": MESSAGE_ERROR.USER.INVALID_EMAIL,
      "email.unique:users,email,id,id": MESSAGE_ERROR.USER.EMAIL_REGISTERED,
      "phone.required": MESSAGE_ERROR.USER.REQUIRED_PHONE,
      "phone.phone:+84": MESSAGE_ERROR.USER.INVALID_PHONE,
      "typeId.required": MESSAGE_ERROR.USER.REQUIRED_TYPE,
      "typeId.integer": MESSAGE_ERROR.USER.INVALID_TYPE,
      "typeId.gt:0": MESSAGE_ERROR.USER.INVALID_TYPE,
      "typeId.exists:types,id": MESSAGE_ERROR.USER.INVALID_TYPE,
    },
  },

  DELETE: {
    RULES: {
      id: "required",
      "id.*": "integer|gt:0",
    },
    MESSAGES: {
      "id.required": MESSAGE_ERROR.USER.INVALID_USER,
      "id.*.integer": MESSAGE_ERROR.USER.INVALID_USER,
      "id.*.gt:0": MESSAGE_ERROR.USER.INVALID_USER,
    },
  },
};

const RULES_REQUEST = {
  USER_RULES,
  COURSE_RULES,
  TEACHER_RULES,
};

module.exports = {
  RULES_REQUEST,
};
