const FIELDS_IMPORT = {
  USER_FIELDS: ["name", "email", "phone", "address"],
  COURSE_FIELDS: [
    "name",
    "price",
    "teacher",
    "tryLearn",
    "quantity",
    "duration",
  ],
  TEACHER_FIELDS: ["name", "email", "phone", "address", "type"],
  STUDENT_FIELDS: ["name", "email", "phone", "address"],
};

const FILE_NAME_EXPORT = {
  USER: "UsersReport",
  COURSE: "CoursesReport",
  TEACHER: "TeachersReport",
  STUDENT: "StudentsReport",
};

const SHEET_HEADERS_EXPORT = {
  HEADERS_USER: [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 35 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Address", key: "address", width: 15 },
  ],

  HEADERS_COURSE: [
    { header: "Name", key: "name", width: 20 },
    { header: "Price", key: "price", width: 15 },
    { header: "Teacher", key: "teacher", width: 20 },
    { header: "Try Learn", key: "tryLearn", width: 10 },
    { header: "Quantity", key: "quantity", width: 10 },
    { header: "Duration", key: "duration", width: 10 },
  ],

  HEADERS_TEACHER: [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 35 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Address", key: "address", width: 15 },
    { header: "Type", key: "type", width: 15 },
  ],

  HEADERS_STUDENT: [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 35 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Address", key: "address", width: 15 },
  ],
};

module.exports = {
  FIELDS_IMPORT,
  FILE_NAME_EXPORT,
  SHEET_HEADERS_EXPORT,
};
