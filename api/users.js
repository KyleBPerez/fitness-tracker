const express = require('express');
const usersRouter = express.Router();
const{
    createUser,
    getUserByUsername
} = require('../db');




usersRouter.post('/register',async(req,res,next)=>{
    
    try {
        const {username,password} = req.body
        console.log(req)
        const userCheck = await getUserByUsername(username)
        if(userCheck){
            throw new Error('Username already exists')
        }
        if(password.length < 8){
            throw new Error('Password too short')
        }

        const user = await createUser({username,password})
        res.send({user})
    } catch (error) {
         next(error)
    }
})

usersRouter.post('/login',async(req,res,next)=>{
    const {username,password} = req.body

})

module.exports = usersRouter
