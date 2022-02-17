// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router

const express = require('express');

const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env
const apiRouter = express.Router();
const {
    getAllActivities, 
} = require('../db')



apiRouter.get('/health',async(req,res,next)=>{
    try {
        res.send({message:'all is well'})
    } catch (error) {
        throw error
    }
    
});

apiRouter.use('/users',require('./users'))

module.exports = apiRouter