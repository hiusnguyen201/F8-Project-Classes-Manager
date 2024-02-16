const { check } = require("express-validator");
const { Op } = require("sequelize");
const fs = require("fs");
const { MESSAGE_ERROR } = require("../constants/message.constant");
const moment = require("moment");
const userService = require("../http/services/user.service");
const tokenUtil = require("../utils/token");
const models = require("../models/index");
const User = models.User;

module.exports = {
  validateFile: (type) => {
    const executeArr = [];
    if (type === "excel") {
      executeArr.push(
        check("file").custom((value, { req }) => {
          if (req.session.fileUploaded) {
            return true;
          }

          const fileInfo = req.file;
          const filePath = `./public/uploads/${fileInfo.originalname}`;

          if (fileInfo.size > 1000000 * +process.env.SIZE_FILE_LIMIT) {
            throw new Error(MESSAGE_ERROR.FILE.SIZE_FILE_LIMIT);
          }

          if (
            fileInfo.mimetype !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            try {
              fs.unlinkSync(filePath);
              throw new Error(MESSAGE_ERROR.FILE.MIMETYPE_EXCEL_WRONG);
            } catch (err) {
              console.log(err);
              throw new Error(MESSAGE_ERROR.FILE.REMOVE_FILE_UPLOAD_ERROR);
            }
          }
          return true;
        })
      );
    }

    return executeArr;
  },

  /*
    
  */

  // validateRequest: (params, objValidates) => {
  //   const arrValidate = [];

  //   objValidates.forEach((item) => {
  //     if (params.includes(item.name)) {
  //       arrValidate.push(item);
  //     }
  //   });

  //   arrValidate.forEach(({name, rules}) => {

  //   })

  //   return executeArr;
  // },
};
