const pool = require("../database/db");
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const createUser = async (req, res, next) => {
  const { username, password } = req.body;
  if ( !username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  } 
  try {
    const sql1 = `
      SELECT "username"
      FROM "user"
      WHERE "username" = $1
    `;
    const queryParams1 = [username]
    const queryResult = await pool.query(sql1, queryParams1)
    const [userDetails] = queryResult.rows
    if (userDetails) {
      throw new ClientError(400, 'username already exists');
    }
    const hashedPassword = await argon2.hash(password)
    const sql2 = `
      INSERT INTO "user" ("username", "hashedPassword")
      VALUES ($1, $2)
      RETURNING *
    `; 
    const queryParams2 = [username, hashedPassword];
    const queryResults2 = await pool.query(sql2, queryParams2)
    const [newUser] = queryResults2.rows
    res.status(201).json(newUser)
  } catch(err) {
    next(err)
  }
}

const authenticateUser = async (req, res, next) => {
  const { username, password } = req.body;
  if ( !username || !password) {
    throw console.error('username and password are required fields', 400);
  }
  try {
    const sql = `
      SELECT "id", "hashedPassword"
      FROM "user"
      WHERE "username" = $1
    `;
    const queryParams = [username];
    const queryResult = await pool.query(sql, queryParams)
    const [userDetails] = queryResult.rows
    if (!userDetails) {
      throw console.err('invalid login')
    }
    const { id, hashedPassword } = userDetails;
    const isPwMatching = await argon2.verify(hashedPassword, password)
    if (!isPwMatching) {
      throw console.error('invalid login')
    }
    const payload = { id, username };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET) 
    res.json({ token, user: payload})
  } catch(err) {
    next(err)
  }
}

module.exports = { createUser, authenticateUser }