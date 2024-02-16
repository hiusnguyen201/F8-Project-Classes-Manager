const multer = require("multer");
const fs = require("fs");
const { MESSAGE_ERROR } = require("../../../constants/message.constant");

module.exports = (req, res, next) => {
  if (req.session.fileUploaded) {
    next();
  } else {
    const uploadFolder = "./public/uploads";
    if (!fs.existsSync(uploadFolder)) {
      try {
        fs.mkdirSync(uploadFolder);
      } catch (err) {
        console.log(err);
        req.flash("error", MESSAGE_ERROR.FILE.CREATE_FOLDER_FAILED);
        return res.redirect(req.originalUrl);
      }
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadFolder);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const upload = multer({ storage: storage }).single("file");

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
        req.flash("error", MESSAGE_ERROR.FILE.ERROR_MULTER_UPLOAD);
        return res.redirect(req.originalUrl);
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
        req.flash("error", MESSAGE_ERROR.FILE.UNKNOWN_ERROR_UPLOAD);
        return res.redirect(req.originalUrl);
      }
      next();
    });
  }
};
