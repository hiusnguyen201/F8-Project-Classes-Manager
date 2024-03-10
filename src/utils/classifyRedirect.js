module.exports = (typeName, redirectArr) => {
  if (typeName === "admin") {
    return redirectArr[0];
  } else if (typeName === "teacher") {
    return redirectArr[1];
  } else {
    return redirectArr[2];
  }
};
