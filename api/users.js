
const express = require('express');
const usersRouter = express.Router();
const {
    createUser,
    getUserByUsername,
    getUser
} = require('../db');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env



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
        res.send({ user:user })
    } catch (error) {
        next(error)
    }
})

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    console.log('hello');
    if (!username || !password) {
        next({
            name: 'username does not exist',
            message: 'please provide a valid credentials'
        })
        return
    }
    try {
        const user = await getUser({ username, password })
        if(!user){
            next({message:'password dont match'})
            return
        }
        
        const token = jwt.sign(user, JWT_SECRET);
        console.log(token)
        res.send({ token, message: 'Successfully logged In' })
    } catch (error) {
        next(error)
    }

})

module.exports = usersRouter
