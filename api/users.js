const express = require('express')
const usersRouter = express.Router()
const jwt = require('jsonwebtoken')
const { requireUser } = require('./utils')
const { JWT_SECRET } = process.env
const {
  createUser,
  getUserByUsername,
  getUser,
  getPublicRoutinesByUser,
} = require('../db')

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body
  try {
    if (password.length < 8) {
      next({
        name: `PasswordLengthError`,
        message: 'Password must be 8 characters or more',
      })
      return
    }

    const user = await createUser({ username, password })
    res.send({ user })
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    next({
      name: 'loginCredentialError',
      message: 'Must provide a valid username and password',
    })
    return
  }
  try {
    const user = await getUser({ username, password })
    const token = jwt.sign(user, JWT_SECRET)
    res.send({ token, message: 'Successfully logged In' })
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/me', requireUser, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (err) {
    next(err)
  }
})

usersRouter.get('/:username/routines', async (req, res, next) => {
  try {
    const { username } = req.params
    const user = await getUserByUsername(username)
    const routinesByUser = await getPublicRoutinesByUser(user)
    res.send(routinesByUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
