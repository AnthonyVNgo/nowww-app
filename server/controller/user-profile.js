const ClientError = require('../middleware/client-error');
const pool = require("../database/db");
const generateFileName = require('../middleware/filename-generator')
const { s3, bucketName, getSignedUrl, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('../middleware/aws-middleware')

const getProfile = async (req, res, next) => {
  const endpoint = req.originalUrl
  let id = endpoint === '/api/my-profile' || endpoint === '/api/edit-profile' ? req.user.id : Number(req.params.userId)
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
  const endpoint = req.originalUrl
  let id = endpoint === '/api/my-entries' ? req.user.id : Number(req.params.userId)
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

const addProfilePicture = async (req, res, next) => {
  const {id} = req.user
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const image = req.file.buffer
    const sqlGuard = `
      SELECT "image_url"
      FROM "profile-picture"
      WHERE "user_id" = $1
    `;
    const guardQueryParams = [id]
    const queryResult = await pool.query(sqlGuard, guardQueryParams)
    if (queryResult.rows.length) {
      throw new ClientError(404, `Pre-existing file found. Delete before uploading a new file.`);
    }
    const filename = generateFileName()
    const putObjectParams = {
      Bucket: bucketName,
      Key: filename,
      Body: image,
      ContentType: req.file.mimetype,
    }
    const command = new PutObjectCommand(putObjectParams)
    await s3.send(command)
    const sql = `
      INSERT INTO "profile-picture" ("image_url", "user_id")
      VALUES ($1, $2)
      RETURNING *
    `;
    const sqlParameters = [filename, id]
    const queryResult2 = await pool.query(sql, sqlParameters)
    if (!queryResult2.rows[0]) {
      throw new ClientError(404, `cannot find user with user_id ${id}`);
    }
    res.status(201).send(`Image added`)
  } catch(err) {
    next(err)
  }
}

const getProfilePicture =  async (req, res, next) => {
  const endpoint = req.originalUrl
  let id = endpoint === '/api/profile-picture' ? req.user.id : Number(req.params.userId)
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const sql = `
      SELECT "image_url"
      FROM "profile-picture"
      WHERE "user_id" = $1
    `;
    const queryParams = [id]
    const queryResult = await pool.query(sql, queryParams)
    if (!queryResult.rows[0]) {
      throw new ClientError(404, `cannot find profile picture for user with user id: ${id}`);
    }
    const imageName = queryResult.rows[0].image_url
    const getObjectParams = {
      Bucket: bucketName,
      Key: imageName
    }
    const command = new GetObjectCommand(getObjectParams)
    const imageUrl = await getSignedUrl(s3, command, {expiresIn: 3600})
    res.json(imageUrl)
  } catch(err) {
    next(err)
  }
}

const deleteProfilePicture = async (req, res, next) => {
  const {id} = req.user
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer')
  }
  const sql = `
    SELECT "image_url"
    FROM "profile-picture"
    WHERE "user_id" = $1
  `;
  const queryParams = [id]
  pool.query(sql, queryParams)
    .then(queryResult => {
      const imageName = queryResult.rows[0].image_url
      const sql2 = `
        DELETE FROM "profile-picture"
        WHERE "user_id" = $1 AND "image_url" = $2
      `;
      const queryParams2 = [id, imageName]
      pool.query(sql2, queryParams2)
        .then(() => {
          const deleteObjectParams = {
            Bucket: bucketName,
            Key: imageName
          }
          const command = new DeleteObjectCommand(deleteObjectParams)
          s3.send(command) 
          res.send('Image deleted')
        })
    })
    .catch(err => next(err));
}

module.exports = { getProfile, editMyProfile, deleteMyProfile, addNowEntry, getNowEntries, editNowEntry, deleteNowEntry, deleteAllNowEntries, addProfilePicture, getProfilePicture, deleteProfilePicture}