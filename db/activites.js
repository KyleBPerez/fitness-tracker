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

module.exports = {
  createActivity,
  getAllActivities,
}
