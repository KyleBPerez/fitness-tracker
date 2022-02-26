// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express')
const apiRouter = express.Router()
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const { getUserById } = require('../db')

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer '
  const auth = req.header('Authorization')

  if (!auth) {
    next()
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length)
    try {
      const { id } = jwt.verify(token, JWT_SECRET)
      if (id) {
        req.user = await getUserById(id)
        next()
      }
    } catch (error) {
      next(error)
    }
  } else {
    next({
      name: `AuthorizationError`,
      message: `Authorization must start with ${prefix}`,
    })
  }
})

apiRouter.get('/health', async (req, res, next) => {
  try {
    res.send({ message: 'all is well' })
  } catch (error) {
    next(error)
  }
})

apiRouter.use('/users', require('./users'))
apiRouter.use('/activities',require('./activities'))
apiRouter.use('/routines',require('./routines'))

module.exports = apiRouter
