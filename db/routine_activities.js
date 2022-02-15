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

module.exports = {
  addActivityToRoutine,
}
