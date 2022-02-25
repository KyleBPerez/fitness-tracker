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
  try {
    const { username, password } = req.body
    const userCheck = await getUserByUsername(username)
    if (userCheck) {
      next('Username already exists')
      return
    }
    if (password.length < 8) {
      next('Password too short')
      return
    }

    const user = await createUser({ username, password })
    res.send({ user: user })
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    next({
      name: 'username does not exist',
      message: 'please provide a valid credentials',
    })
    return
  }
  try {
    const user = await getUser({ username, password })
    if (!user) {
      next({ message: 'password dont match' })
      return
    }

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
    // localhost:3000/api/albert/routines
    const { username } = req.params
    const user = await getUserByUsername(username)
    if (!user) {
      next({
        name: `UserExistError`,
        message: `This username does NOT exist`,
      })
      return
    }
    const routinesByUser = await getPublicRoutinesByUser(user)
    res.send(routinesByUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
