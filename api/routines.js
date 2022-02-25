const express = require('express')

const routineRouter = express.Router()
const { getAllRoutines } = require('../db')

routineRouter.get('/',async(req,res,next)=>{
    try {
        const routines = await getAllRoutines()
        res.send(routines)
    } catch (error) {
        next(error)
    }
})

module.exports = routineRouter