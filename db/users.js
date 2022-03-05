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
    if (!user)
      throw {
        name: `userNotFoundError`,
        message: `This user was not found`,
      }
    const hashedPassword = user.password
    const passwordsMatch = await bcrypt.compare(password, hashedPassword)
    if (passwordsMatch) {
      delete user.password
      return user
    } else {
      throw {
        name: `IncorrectPassword`,
        message: `Provided password is NOT correct`,
      }
    }
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

    if (!user)
      throw {
        name: `FindUserByUsernameError`,
        message: `Unable to find a user with the username: ${username}`,
      }

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

    if (!user)
      throw {
        name: `UserExistError`,
        message: `User with provided Id does NOT exist`,
      }

    return user
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
