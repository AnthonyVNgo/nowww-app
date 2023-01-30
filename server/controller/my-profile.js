const ClientError = require('../middleware/client-error');
const pool = require("../database/db");

const getMyProfile = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  try {
    const sql = `
      SELECT "username", "profilePicture", "tagline", "bio", "linkedin", "github",  "dribbble",  "medium",  "twitter",  "youtube",  "instagram"
      FROM "user"
      WHERE "id" = $1
    `;
    const paramQueryValue = [id];
    const queryResult = await pool.query(sql, paramQueryValue)
    if (!queryResult.rows[0]) {
      throw new ClientError(404, `cannot find user with userId: ${id}`);
    }
    res.json(queryResult.rows[0]);
  } catch(err) {
    next(err)
  }
}

const editMyProfile = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const { tagline, bio, linkedin, github, dribbble, medium, twitter, youtube, instagram } = req.body;
    const sql = `
      UPDATE "user"
      SET "tagline" = coalesce($1, "tagline"),
          "bio" = coalesce($2, "bio"),
          "linkedin" = coalesce($3, "linkedin"),
          "github" = coalesce($4, "github"),
          "dribbble" = coalesce($5, "dribbble"),
          "medium" = coalesce($6, "medium"),
          "twitter" = coalesce($7, "twitter"),
          "youtube" = coalesce($8, "youtube"),
          "instagram" = coalesce($9, "instagram")
      WHERE "id" = $10
      RETURNING *
    `;
    const queryParams = [tagline, bio, linkedin, github, dribbble, medium, twitter, youtube, instagram, id];
    const queryResult = await pool.query(sql, queryParams)
    if (!queryResult.rows[0]) {
      throw new ClientError(404, `cannot find user with userId ${userId}`);
    }
    res.send(`Profile updated`)
  } catch(err) {
    next(err)
  }
}

const deleteMyProfile = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const sql = `
    DELETE FROM "user"
    WHERE "id" = $1
    `;
    const queryParams = [id];
    const queryResult = await pool.query(sql, queryParams)
    if (!queryResult.rows[0]) {
      throw new ClientError(`Couldn't delete profile of user with ID: ${id}`);
    }
    res.send(`Profile deleted`)
  } catch(err) {
    next(err)
  }
}

const addNowEntry = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  try {
    const {input, category} = req.body
    const sql = `
      INSERT INTO "nowwww-entry" ("content", "user_id", "category_id")
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const sqlParameters = [input, id, category];
    const queryResult = await pool.query(sql, sqlParameters)
    if (!queryResult.rows[0]) {
      throw new ClientError(404, `cannot find user with userId ${userId}`);
    }
    res.status(201).send(`User ${id} added: ${input}`)
  } catch(err) {
   next(err) 
  }
}

const getNowEntries = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  try {
  const sql = `
    SELECT * 
    FROM "nowwww-entry" 
    WHERE "user_id" = $1
  `;
  const queryParams = [id];
  const queryResult = await pool.query(sql, queryParams);
  if (!queryResult.rows[0]) {
    res.json(queryResult.rows);
    throw new ClientError(404, `cannot find entries for user with id: ${id}`);
  }
  res.json(queryResult.rows);
  } catch (err) {
    next(err);
  }
}

const editNowEntry = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const entryId = Number(req.params.entryId)
    const { input, category } = req.body 
    const sql = `
      UPDATE "nowwww-entry"
      SET "content" = coalesce($1, "content"),
          "category_id" = coalesce($2, "category_id")
      WHERE "user_id" = $3
      AND "id" = $4
      RETURNING *
    `;
    const queryParams = [input, category, id, entryId];
    const queryResults = await pool.query(sql, queryParams)
    if (!queryResults.rows[0]) {
      throw new ClientError(404, `cannot edit entry with given parameters`);
    }
    res.send(`Entry ${entryId} updated`)
  } catch(err) {
    next(err)
  }
}

const deleteNowEntry = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const entryId = Number(req.params.entryId);
    const sql = `
      DELETE FROM "nowwww-entry"
      WHERE "id" = $1
      AND "user_id" = $2
    `;
    const queryParams = [entryId, id];
    const queryResult = await pool.query(sql, queryParams)
    if (!queryResult.rows[0]) {
      throw new ClientError(`Could not delete entry with given parameters`);
    }
    res.send(`Entry ${entryId} deleted`)
  } catch(err) {
    next(err)
  }
}

const deleteAllNowEntries = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const sql = `
      DELETE FROM "nowwww-entry"
      WHERE "user_id" = $1
    `;
    const queryParams = [id];
    const queryResult = await pool.query(sql, queryParams)
    if (!queryResult.rows[0]) {
      throw new ClientError(`Could not complete deletion of all entries`);
    }
    res.send(`Entry ${entryId} deleted`)
  } catch(err) {
    next(err)
  }
}

module.exports = { getMyProfile, editMyProfile, deleteMyProfile, addNowEntry, getNowEntries, editNowEntry, deleteNowEntry, deleteAllNowEntries }