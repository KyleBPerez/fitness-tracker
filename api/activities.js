const express = require('express')

const activitiesRouter = express.Router()
const { requireUser } = require('./utils')
const {
  getAllActivities,
  createActivity,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require('../db')

activitiesRouter.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities()
    res.send(activities)
  } catch (error) {
    next(error)
  }
})

activitiesRouter.post('/', requireUser, async (req, res, next) => {
  try {
    const { name, description } = req.body
    if (!name || !description) {
      next({
        name: 'incompletebodyerror',
        message: 'Requires a username and description',
      })
      return
    }
    const newActivity = await createActivity({ name, description })
    res.send(newActivity)
  } catch (error) {
    next(error)
  }
})

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
  try {
    const { activityId: id } = req.params
    const { name, description } = req.body
    const updateFields = { id, name, description }
    const updatedActivity = await updateActivity(updateFields)
    res.send(updatedActivity)
  } catch (error) {
    next(error)
  }
})

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
  const { activityId: id } = req.params
  try {
    const activity = await getActivityById(id)
    const routineActivities = await getPublicRoutinesByActivity(activity)
    res.send(routineActivities)
  } catch (error) {
    next(error)
  }
})
module.exports = activitiesRouter
