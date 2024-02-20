const excelJS = require("exceljs");
const { MESSAGE_ERROR } = require("../constants/message.constant");

module.exports = {
  readFile: async (fileInfo, fieldsArr) => {
    const filePath = `./public/uploads/${fileInfo.originalname}`;

    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    if (worksheet.actualColumnCount !== fieldsArr.length) {
      return [
        null,
        `${
          MESSAGE_ERROR.FILE.INVALID_HEADERS
        }, must be follow "${fieldsArr.join(", ")}"`,
      ];
    }

    const dataArr = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const rows = row.values;
      let dataObj = {};

      rows.forEach((value, index) => {
        if (Object.prototype.toString.call(value) === "[object Object]") {
          dataObj[fieldsArr[index - 1]] = value.text;
        } else {
          dataObj[fieldsArr[index - 1]] = value;
        }
      });

      if (rowNumber > 1) {
        dataArr.push(dataObj);
      }
    });

    return [dataArr, null];
  },

  writeFile: (res, headers, fileName, executeFunc) => {
    const workbook = new excelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet 1");

    sheet.columns = headers;
    for (var i = 1; i <= sheet.actualColumnCount; i++) {
      sheet.getRow(1).getCell(i).font = {
        color: { argb: "FFFFFFFF" },
        bold: true,
      };
      sheet.getRow(1).getCell(i).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF008000" },
      };
    }

    executeFunc(sheet);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + fileName + ".xlsx"
    );

    workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
        return true;
      })
      .catch((err) => {
        console.log(err.message);
        return false;
      });
  },
};
