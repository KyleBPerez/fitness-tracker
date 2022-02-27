const express = require('express')

const routineRouter = express.Router()
const {
  getAllPublicRoutines,
  getRoutineById,
  updateRoutine,
  createRoutine,
  destroyRoutine,
  addActivityToRoutine,
} = require('../db')
const { requireUser } = require('./utils')

routineRouter.get('/', async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines()
    res.send(routines)
  } catch (error) {
    next(error)
  }
})

routineRouter.post('/', requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body
  const { id } = req.user
  console.log('id :>> ', id)
  try {
    const newRoutine = await createRoutine({
      creatorId: req.user.id,
      isPublic,
      name,
      goal,
    })
    res.send(newRoutine)
  } catch (err) {}
})

routineRouter.patch('/:routineId', requireUser, async (req, res, next) => {
  const { routineId: id } = req.params
  const { isPublic, name, goal } = req.body
  const updateFields = { id }

  if (isPublic) {
    updateFields.isPublic = isPublic
  }
  if (name) {
    updateFields.name = name
  }
  if (goal) {
    updateFields.goal = goal
  }
  try {
    const originalRoutine = await getRoutineById(id)
    if (!originalRoutine) {
      next({
        name: 'RoutineError',
        message: 'This Routine does not exist',
      })
      return
    }
    if (originalRoutine.creatorId === req.user.id) {
      const newRoutine = await updateRoutine(updateFields)
      res.send(newRoutine)
    } else {
      next({
        name: 'Unauthorized User',
        message: 'Can not update routine unless you are the owner',
      })
    }
  } catch (error) {
    next(error)
  }
})

routineRouter.delete('/:routineId', requireUser, async (req, res, next) => {
  const { routineId: id } = req.params
  try {
    const routine = await getRoutineById(id)
    if (!routine) {
      next({
        name: 'noRoutine',
        message: 'No routine was found',
      })
      return
    }
    if (routine.creatorId === req.user.id) {
      const deleteRoutine = await destroyRoutine(id)
      res.send(deleteRoutine)
    }
  } catch (error) {
    next(error)
  }
})

routineRouter.post('/:routineId/activities', async (req, res, next) => {
  const { routineId } = req.params
  const { count, duration, activityId } = req.body
  try {
    const routActivities = await addActivityToRoutine({
      count,
      duration,
      routineId,
      activityId,
    })
    res.send(routActivities)
  } catch (error) {
    next(error)
  }
})

module.exports = routineRouter
