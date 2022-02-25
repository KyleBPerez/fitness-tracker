const express = require('express');

const activitiesRouter = express.Router();
const {requireUser} = require('./utils')
const {
    getAllActivities, createActivity, getActivityById, updateActivity
} = require('../db')

activitiesRouter.get('/',async(req,res,next)=>{
    try {
        const activities = await getAllActivities()
        res.send(activities)
    } catch (error) {
        next(error)
    }
})

activitiesRouter.post('/',requireUser, async(req,res,next)=>{
    try {
        const activity = req.body
        if(!activity.name || !activity.description){
            next({
            name:"incompletebodyerror",
            message:'Requires a username and description'
        })
        return
        }
        const newActivity = await createActivity(activity)
        res.send(newActivity)
        
    } catch (error) {
        next(error)
    }
})

activitiesRouter.patch('/:activityId', requireUser,async(req,res,next)=>{
    try {
        const {activityId : id } = req.params
        const {name , description} = req.body
        const updateFields = {id,name,description}
        const activity = await getActivityById(id)
        if(!activity){
            next({
                name:'ActivityError',
                message:'This activity does not exist'
            })
            return
        }
        const updatedActivity = await updateActivity(updateFields)
        res.send(updatedActivity)
    } catch (error) {
        next(error)
    }
})
module.exports = activitiesRouter
