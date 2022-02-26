const express = require("express");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
} = require("../db");
const { requireUser } = require("./utils");

const routine_ActivitiesRouter = express.Router();

routine_ActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId: id } = req.params;
    const { count, duration } = req.body;
    const updateFields = { id };
    if (count) {
      updateFields.count = count;
    }
    if (duration) {
      updateFields.duration = duration;
    }
    try {
      const routactivity = await getRoutineActivityById(id);
      const routine = await getRoutineById(routactivity.routineId);
      if (req.user.id === routine.creatorId) {
        const newRouteActivity = await updateRoutineActivity(updateFields);
        res.send(newRouteActivity);
      } else {
        next({
          name: `UserOwnerError`,
          message: `User must be the owner to update`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routine_ActivitiesRouter;
