const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: `UserLogInError`,
      message: `User must be logged in`,
    })
  } else {
    next()
  }
}

module.exports = {
  requireUser,
}
