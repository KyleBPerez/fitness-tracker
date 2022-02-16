const client = require('./client')

const addActivityToRoutine = async ({
  routineId,
  activityId,
  count,
  duration,
}) => {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
  `,
      [routineId, activityId, count, duration]
    )
    return routineActivity
  } catch (err) {
    throw err
  }
}

const getRoutineActivitiesByRoutine = async ({ id }) => {
  try {
    const { rows: activitiesByRoutine } = await client.query(
      `
      SELECT *
      FROM routine_activities ra
      WHERE ra."routineId" = $1
    `,
      [id]
    )

    return activitiesByRoutine
  } catch (err) {
    throw err
  }
}

const updateRoutineActivity = async (routineActivityObj = {}) => {
  try {
    const setString = Object.keys(routineActivityObj)
      .map((key, idx) => `"${key}"=$${idx + 1}`)
      .join(', ')

    if (setString.length === 0) return

    const {
      rows: [updatedRoutineActivity],
    } = await client.query(
      `
        UPDATE routine_activities
        SET ${setString}
        WHERE id = ${routineActivityObj.id}
        RETURNING *;
      `,
      Object.values(routineActivityObj)
    )

    return updatedRoutineActivity
  } catch (err) {
    throw err
  }
}

module.exports = {
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
}
