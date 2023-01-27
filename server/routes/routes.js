const express = require('express')
const router = express.Router()
const pool = require("../database/db");
require("dotenv").config();

// Authentication 
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

// Middleware 
const errorMiddleware = require('../middleware/error-middleware')
const ClientError = require('../middleware/client-error');
const authorizationMiddleware = require('../middleware/authorization-middleware')
const uploadsMiddleware = require('../middleware/upload-middleware')

// Amazon S3 
const crypto = require('crypto')
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { response } = require('express');

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const bucketAccessKey = process.env.BUCKET_ACCESS_KEY
const bucketSecretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretAccessKey
  },
  region: bucketRegion
})

// Sign-up 
router.post('/sign-up', async (req, res, next) => {
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
      RETURNING *;
    `; 
    const queryParams2 = [username, hashedPassword];
    const queryResults2 = await pool.query(sql2, queryParams2)
    const [newUser] = queryParams2.rows
    res.status(201).json(newUser)
  } catch(err) {
    next(err)
  }
})

// Login 
router.post('/login', async (req, res, next) => {
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
})

// AUTHORIZATON MIDDLEWARE 
router.use(authorizationMiddleware);
// AUTHORIZATON MIDDLEWARE 

// GET My Profile
router.get('/my-profile', async (req, res, next) => {
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
});

// GET !My Profile
router.get('/user/:userId', async (req, res, next) => {
  const userId = Number(req.params.userId)
  if (!userId) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const userId = Number(req.params.userId)
    const sql = `
      SELECT "username", "profilePicture", "tagline", "bio", "linkedin", "github",  "dribbble",  "medium",  "twitter",  "youtube",  "instagram"
      FROM "user"
      WHERE "id" = $1
    `;
    const paramQueryValue = [userId];
    const queryResult = await pool.query(sql, paramQueryValue)
    if (!queryResult.rows[0]) {
      throw new ClientError(404, `cannot find user with userId: ${userId}`);
    }
    res.json(queryResult.rows[0]);
  } catch(err) {
    next(err)
  }
});

// PUT Edit Profile
router.put('/edit-profile', async (req, res, next) => {
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
})

// Delete Profile  
router.delete('/delete-profile', async (req, res, next) => {
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
})

// Add Nowww Entry
router.post('/add-entry', async (req, res, next) => {
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
});

// Get My Nowww Entries 
router.get('/my-entries', async (req, res, next) => {
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
});

// Get !My Nowww Entries 
router.get('/user/:userId/entries', async (req, res, next) => {
  const { id } = req.user
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  try {
    const userId = Number(req.params.userId)
    const sql = `
      SELECT * 
      FROM "nowwww-entry"
      WHERE "user_id" = $1
    `;
    const queryParams = [userId]
    const queryResult = await pool.query(sql, queryParams)
    if (!queryResult.rows[0]) {
      res.json(queryResult.rows);
      throw new ClientError(404, `cannot find entries for user with id: ${id}`);
    }
    res.json(queryResult.rows);
  } catch(err) {
    next(err);
  }
});

// Edit Nowww Entry 
router.put('/edit-entry/:entryId', async (req, res, next) => {
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
})

// Delete Nowww Entry 
router.delete('/delete-entry/:entryId', async (req, res, next) => {
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
});

// Delete All Nowww Entries 
router.delete('/delete-all-entries', async (req, res, next) => {
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
})

// Gallery 
router.get('/gallery', async (req, res, next) => {
  try {
    const sql = ` 
      SELECT "id", "username", "tagline"
      FROM "user"
    `;
    const response = await pool.query(sql)
    res.json(response.rows)
  } catch(error) {
    next(error)
  }
})

// Post Profile Picture AMAZON S3
router.post('/upload-profile-picture', uploadsMiddleware, async (req, res, next) => {
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
    const queryResult2 = pool.query(sql, sqlParameters)
    if (!queryResult2.rows[0]) {
      throw new ClientError(404, `cannot find user with user_id ${id}`);
    }
    res.status(201).send(`Image added`)
  } catch(err) {
    next(err)
  }
})

router.get('/profile-picture', async (req, res, next) => {
  const {id} = req.user
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
})

router.get('/profile-picture/user/:userId', async (req, res, next) => {
  const {id} = req.user
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  try {
    const userId = Number(req.params.userId)
    const sql = `
      SELECT "image_url"
      FROM "profile-picture"
      WHERE "user_id" = $1
    `;
    const queryParams = [userId]
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
})

router.delete('/delete-profile-picture', async (req, res, next) => {
  const {id} = req.user
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
})

router.use(errorMiddleware);

module.exports = router