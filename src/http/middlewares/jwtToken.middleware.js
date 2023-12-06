module.exports = (req, res, next) => {
  const { token: tokenReset } = req.params;

  if (!tokenReset) {
    return res.redirect(redirectPath.EMAIL_PASS_RESET);
  }

  const userIdReset = tokenUtil.verifyTokenByJwt(tokenReset);
  if (req.user && !userIdReset) {
    req.flash("error", messageError.JWT_INVALID_TOKEN);
    return res.redirect(redirectPath.LOGIN_AUTH);
  } else if (!userIdReset) {
    req.flash("error", messageError.JWT_INVALID_TOKEN);
    return res.redirect(redirectPath.EMAIL_PASS_RESET);
  }
  next();
};
