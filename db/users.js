const client = require('./client')
const bcrypt = require('bcrypt')

const createUser = async ({ username, password }) => {
  try {
    const SALT_COUNT = 10
    const hashPassword = await bcrypt.hash(password, SALT_COUNT)
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username;
    `,
      [username, hashPassword]
    )

    if (!user)
      throw {
        name: `UsernameExistError`,
        message: `This username already exists`,
      }

    return user
  } catch (err) {
    throw err
  }
}

const getUser = async ({ username, password }) => {
  try {
    const user = await getUserByUsername(username)
    const hashedPassword = user.password
    const passwordsMatch = await bcrypt.compare(password, hashedPassword)
    if (!passwordsMatch)
      throw {
        name: `UserPasswordError`,
        message: `Provided password does NOT match`,
      }

    delete user.password
    return user
  } catch (err) {
    throw err
  }
}

const getUserByUsername = async (username) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    )

    return user
  } catch (err) {
    throw err
  }
}

const getUserById = async (userId) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT id, username
    FROM users
    WHERE id=$1;
  `,
      [userId]
    )
    return user || {}
  } catch (err) {
    throw err
  }
}

module.exports = {
  createUser,
  getUser,
  getUserByUsername,
  getUserById,
}
