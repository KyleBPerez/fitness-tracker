const client = require('./client')

const createActivity = async ({ name, description }) => {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      INSERT INTO activities(name, description)
      VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
      `,
      [name, description]
    )
    return activity
  } catch (err) {
    throw err
  }
}

const getAllActivities = async () => {
  try {
    const { rows: activities } = await client.query(`
    SELECT * FROM activities;
    `)
    return activities
  } catch (err) {
    throw err
  }
}

const updateActivity = async ({ id, name, description }) => {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      UPDATE activities
      SET name = $1, description = $2
      WHERE id=$3
      RETURNING *;
    `,
      [name, description, id]
    )
    if (!activity) return
    return activity
  } catch (err) {
    throw err
  }
}

const getActivityById = async (activityId) => {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE id=$1;
    `,
      [activityId]
    )
    return activity
  } catch (err) {
    throw err
  }
}

module.exports = {
  createActivity,
  getAllActivities,
  updateActivity,
  getActivityById,
}
