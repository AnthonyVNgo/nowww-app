const express = require('express')
const router = express.Router()
const pool = require("../database/db");
require("dotenv").config();

// Middleware 
const errorMiddleware = require('../middleware/error-middleware')
const ClientError = require('../middleware/client-error');
const authorizationMiddleware = require('../middleware/authorization-middleware')
const uploadsMiddleware = require('../middleware/upload-middleware')
const generateFileName = require('../middleware/filename-generator')
const { s3, bucketName, getSignedUrl, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('../middleware/aws-middleware')

// Controller Functions
const {createUser, authenticateUser } = require('../controller/auth')
const { getProfile, editMyProfile, deleteMyProfile, addNowEntry, getNowEntries, editNowEntry, deleteNowEntry, deleteAllNowEntries } = require('../controller/user-profile')
const { getGallery } = require('../controller/gallery')

// Sign-up 
router.post('/sign-up', createUser)

// Login 
router.post('/login', authenticateUser)

// AUTHORIZATON MIDDLEWARE 
router.use(authorizationMiddleware);
// AUTHORIZATON MIDDLEWARE 

// GET My Profile
router.get('/my-profile', getProfile);

// GET !My Profile
router.get('/user/:userId', getProfile);

// Edit Profile
router.put('/edit-profile', editMyProfile)

// Delete Profile  
router.delete('/delete-profile', deleteMyProfile)

// Add Nowww Entry
router.post('/add-entry', addNowEntry);

// Get My Nowww Entries 
router.get('/my-entries', getNowEntries);

// Get !My Nowww Entries 
router.get('/user/:userId/entries', getNowEntries);

// Edit Nowww Entry 
router.put('/edit-entry/:entryId', editNowEntry)

// Delete Nowww Entry 
router.delete('/delete-entry/:entryId', deleteNowEntry);

// Delete All Nowww Entries 
router.delete('/delete-all-entries', deleteAllNowEntries)

// Gallery 
router.get('/gallery', getGallery)

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
    const queryResult2 = await pool.query(sql, sqlParameters)
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