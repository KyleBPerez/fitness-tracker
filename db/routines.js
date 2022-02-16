const client = require('./client')

const createRoutine = async ({ creatorId, isPublic, name, goal }) => {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    )

    return routine
  } catch (err) {
    throw err
  }
}

const getRoutineById = async (routineId) => {
  try {
    const {
      rows: [routineById],
    } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE id=$1;
    `,
      [routineId]
    )

    return routineById
  } catch (err) {
    throw err
  }
}

const getRoutinesWithoutActivities = async () => {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines;
    `)
    return routines
  } catch (err) {
    throw err
  }
}

const getAllRoutines = async () => {
  try {
    // selects the specified columns from the routines table
    // and joins the users table to the routines table
    // where rountines."creatorId" equals user.id
    const { rows: routines } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal, u.username AS "creatorName"
      FROM routines r
      JOIN users u ON r."creatorId" = u.id;
    `)
    // selects all columns from the activities table
    // and joins the routines_activites table to the activities table
    // where routine_activites."activityId" equals activites.id
    const { rows: activities } = await client.query(`
      SELECT * 
      FROM activities a
      JOIN routine_activities ra ON ra."activityId" = a.id;
    `)

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => activity.routineId === routine.id
      )
    })

    return routines
  } catch (err) {
    throw err
  }
}

const getAllPublicRoutines = async () => {
  try {
    // selects the specified columns from the routines table
    // and joins the users table to the routines table
    // ON rountines."creatorId" equals user.id
    // WHERE isPublic equals true
    const { rows: routines } = await client.query(`
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal, u.username AS "creatorName"
      FROM routines r
      JOIN users u ON r."creatorId" = u.id
      WHERE "isPublic" = true;
    `)
    // selects all columns from the activities table
    // and joins the routines_activites table to the activities table
    // where routine_activites."activityId" equals activites.id
    const { rows: activities } = await client.query(`
      SELECT * 
      FROM activities a
      JOIN routine_activities ra ON ra."activityId" = a.id;
    `)

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => activity.routineId === routine.id
      )
    })

    return routines
  } catch (err) {
    throw err
  }
}

const getAllRoutinesByUser = async ({ username }) => {
  try {
    // selects the specified columns from the routines table
    // and joins the users table to the routines table
    // ON rountines."creatorId" equals user.id
    // WHERE users.username equals the obj.username passed into the function
    const { rows: routines } = await client.query(
      `
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal, u.username AS "creatorName"
      FROM routines r
      JOIN users u ON r."creatorId" = u.id
      WHERE u.username = $1;
    `,
      [username]
    )
    // selects all columns from the activities table
    // and joins the routines_activites table to the activities table
    // where routine_activites."activityId" equals activites.id
    const { rows: activities } = await client.query(`
      SELECT * 
      FROM activities a
      JOIN routine_activities ra ON ra."activityId" = a.id;
    `)

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => activity.routineId === routine.id
      )
    })

    return routines
  } catch (err) {
    throw err
  }
}

const getPublicRoutinesByUser = async ({ username }) => {
  try {
    // selects the specified columns from the routines table
    // and joins the users table to the routines table
    // ON rountines."creatorId" equals user.id
    // WHERE users.username equals the obj.username passed into the function
    // AND routines."isPublic" equals true
    const { rows: routines } = await client.query(
      `
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal, u.username AS "creatorName"
      FROM routines r
      JOIN users u ON r."creatorId" = u.id
      WHERE u.username = $1 AND r."isPublic" = true;
    `,
      [username]
    )
    // selects all columns from the activities table
    // and joins the routines_activites table to the activities table
    // where routine_activites."activityId" equals activites.id
    const { rows: activities } = await client.query(`
      SELECT * 
      FROM activities a
      JOIN routine_activities ra ON ra."activityId" = a.id;
    `)

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => activity.routineId === routine.id
      )
    })

    return routines
  } catch (err) {
    throw err
  }
}

const getPublicRoutinesByActivity = async ({ id }) => {
  try {
    // selects the specified columns from the routines table
    // and joins the users table to the routines table
    // and joins routine_activities table on routines for our WHERE clause
    // ON rountines."creatorId" equals user.id
    // WHERE users.username equals the obj.username passed into the function
    // AND routines."isPublic" equals true
    const { rows: routines } = await client.query(
      `
      SELECT r.id, r."creatorId", r."isPublic", r.name, r.goal, u.username AS "creatorName"
      FROM routines r
      JOIN users u ON r."creatorId" = u.id
      JOIN routine_activities ra ON ra."routineId" = r.id
      WHERE ra."activityId" = $1 AND r."isPublic" = true;
    `,
      [id]
    )
    // selects all columns from the activities table
    // and joins the routines_activites table to the activities table
    // where routine_activites."activityId" equals activites.id
    const { rows: activities } = await client.query(`
      SELECT * 
      FROM activities a
      JOIN routine_activities ra ON ra."activityId" = a.id;
    `)

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => activity.routineId === routine.id
      )
    })

    return routines
  } catch (err) {
    throw err
  }
}

const updateRoutine = async (routineObj) => {
  // creates an array from the Object values
  const setString = Object.keys(routineObj)
    // loops through keys array creating ["5"=$1, "isPublic"=$2,...]
    // then joins them with a ', '
    // setString = `"5"=$1, "isPublic"=$2, "name"=$3`
    // allowing  for varying fields to be inputed
    .map((key, idx) => `"${key}"=$${idx + 1}`)
    .join(', ')

  try {
    const {
      rows: [updatedRoutine],
    } = await client.query(
      `
      UPDATE routines 
      SET ${setString}
      WHERE id=${routineObj.id}
      RETURNING *;
    `,
      Object.values(routineObj)
    )

    return updatedRoutine
  } catch (err) {
    throw err
  }
}

const destroyRoutine = async (routineId) => {
  try {
    await client.query(
      `
      DELETE FROM routines r
      USING routine_activities
      WHERE r.id=$1;
    `,
      [routineId]
    )
  } catch (err) {
    throw err
  }
}

module.exports = {
  createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
}
