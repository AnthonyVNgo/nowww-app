const express = require("express");
const app = express();
const routes = require('./routes')

const cors = require("cors");
const pool = require("./db");
const path = require("path");
const PORT = process.env.PORT || 5000;
// require('dotenv').config({ path: './.env' })
require("dotenv").config();

// Authentication 
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

// Middleware 
const errorMiddleware = require('./error-middleware')
const ClientError = require('./client-error');
const authorizationMiddleware = require('./authorization-middleware')
const uploadsMiddleware = require('./upload-middleware')

// Amazon S3 
const crypto = require('crypto')
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

app.use(cors()); 
app.use(express.json()) 
app.use('/api', routes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

// AUTHORIZATON MIDDLEWARE 
app.use(authorizationMiddleware);
// AUTHORIZATON MIDDLEWARE 

// // Gallery 
// app.get('/gallery', (req, res, next) => {
//   const sql = ` 
//     SELECT "id", "username", "tagline"
//     FROM "user"
//   `;
//   pool.query(sql)
//     .then(queryResult => {
//       res.json(queryResult.rows)
//     })
//     .catch(err => {next(err)})
// })

// // My Profile
// app.get('/my-profile', (req, res, next) => {
//   const { id } = req.user;
//   if (!id) {
//     throw new ClientError(400, 'id must be a positive integer');
//   }

//   const sql = `
//     SELECT "username", "profilePicture", "tagline", "bio", "linkedin", "github",  "dribbble",  "medium",  "twitter",  "youtube",  "instagram"
//     FROM "user"
//     WHERE "id" = $1
//   `;

//   const paramQueryValue = [id];
//   pool.query(sql, paramQueryValue)
//     .then(queryResult => {
//       if (!queryResult.rows[0]) {
//         throw new ClientError(404, `cannot find user with userId: ${id}`);
//       }
//       res.json(queryResult.rows[0]);
//     })
//     .catch(err => next(err));
// });

// // Edit Profile
// app.put('/edit-profile', (req, res, next) => {
//   const { id } = req.user;
//   const { tagline, bio, linkedin, github, dribbble, medium, twitter, youtube, instagram } = req.body;
//   if (!id) {
//     throw new ClientError(400, 'userId must be a positive integer');
//   }

//   const sql = `
//     UPDATE "user"
//     SET "tagline" = coalesce($1, "tagline"),
//         "bio" = coalesce($2, "bio"),
//         "linkedin" = coalesce($3, "linkedin"),
//         "github" = coalesce($4, "github"),
//         "dribbble" = coalesce($5, "dribbble"),
//         "medium" = coalesce($6, "medium"),
//         "twitter" = coalesce($7, "twitter"),
//         "youtube" = coalesce($8, "youtube"),
//         "instagram" = coalesce($9, "instagram")
//     WHERE "id" = $10
//     RETURNING *
//   `;

//   const queryParams = [tagline, bio, linkedin, github, dribbble, medium, twitter, youtube, instagram, id];
//   pool.query(sql, queryParams)
//     .then(queryResult => {
//       if (!queryResult.rows[0]) {
//         throw new ClientError(404, `cannot find user with userId ${userId}`);
//       }
//       res.json(queryResult.rows[0]);
//     })
//     .catch(err => next(err));
// })

// // Delete Profile  
// app.delete('/delete-profile', (req, res, next) => {
//   const { id } = req.user;
//   if (!id) {
//     throw new ClientError(400, 'userId must be a positive integer');
//   }
//   const sql = `
//     DELETE FROM "user"
//     WHERE "id" = $1
//     `;

//     const queryParams = [id];
//     pool.query(sql, queryParams)
// })

// // Add Nowww Entry
// app.post('/add-entry', (req, res, next) => {
//   const { id } = req.user;
//   const {input, category} = req.body
//   if (!id) {
//     throw new ClientError(400, 'id must be a positive integer');
//   }
//   const sql = `
//   INSERT INTO "nowwww-entry" ("content", "user_id", "category_id")
//   VALUES ($1, $2, $3)
//   RETURNING *
//   `;
//   const sqlParameters = [input, id, category];
//   pool.query(sql, sqlParameters)
//     .then(queryResult => {
//       if (!queryResult.rows[0]) {
//         throw new ClientError(404, `cannot find user with userId ${userId}`);
//       }
//       res.json(queryResult.rows[0]);
//     })
//     .catch(err => next(err));
// });

// // Get My Nowww Entries 
// app.get('/my-entries', (req, res, next) => {
//   const { id } = req.user
//   if (!id) {
//     throw new ClientError(400, 'id must be a positive integer');
//   }
//   const sql = `
//     SELECT * 
//     FROM "nowwww-entry"
//     WHERE "user_id" = $1
//   `;
//   const queryParams = [id]
//   pool.query(sql, queryParams)
//     .then(queryResult => {
//       if (!queryResult.rows[0]) {
//         res.json(queryResult.rows);
//         throw new ClientError(404, `cannot find entries for user with id: ${id}`);
//       }
//       res.json(queryResult.rows);
//     })
//     .catch(err => next(err));
// })

// // Edit Nowww Entry 
// app.put('/edit-entry/:entryId', (req, res, next) => {
//   const { id } = req.user;
//   const entryId = Number(req.params.entryId)
//   const { input, category } = req.body 
//   if (!id) {
//     throw new ClientError(400, 'userId must be a positive integer');
//   }
//   const sql = `
//     UPDATE "nowwww-entry"
//     SET "content" = coalesce($1, "content"),
//         "category_id" = coalesce($2, "category_id")
//     WHERE "user_id" = $3
//     AND "id" = $4
//     RETURNING *
// `;
// const queryParams = [input, category, id, entryId];
// pool.query(sql, queryParams)
//   .then(queryResult => {
//     if (!queryResult.rows[0]) {
//       throw new ClientError(404, `cannot find user with userId ${userId}`);
//     }
//     res.json(queryResult.rows[0]);
//   })
//   .catch(err => next(err));
// })

// // Delete Nowww Entry 
// app.delete('/delete-entry/:entryId', (req, res, next) => {
//   const { id } = req.user;
//   const entryId = Number(req.params.entryId);
//   const sql = `
//     DELETE FROM "nowwww-entry"
//     WHERE "id" = $1
//     AND "user_id" = $2
//   `;
//   const queryParams = [entryId, id];
//   pool.query(sql, queryParams)
//     .then(queryResult => {
//       res.json(queryResult.rows); 
//     })
//     .catch(err => next(err));
// });

// // Delete All Nowww Entries 
// app.delete('/delete-all-entries', (req, res, next) => {
//   const { id } = req.user;
//   if (!id) {
//     throw new ClientError(400, 'userId must be a positive integer');
//   }
//   const sql = `
//     DELETE FROM "nowwww-entry"
//     WHERE "user_id" = $1
//   `;
//   const queryParams = [id];
//   pool.query(sql, queryParams)
// })

// Post Profile Picture 
app.post('/upload-profile-picture', uploadsMiddleware, (req, res, next) => {
  const { id } = req.user

  const sqlGuard = `
  SELECT "image_name"
  FROM "profile-picture"
  WHERE "user_id" = $1
  `;

  const guardQueryParams = [id]

  pool.query(sqlGuard, guardQueryParams)
    .then(async queryResult => { 
      if (queryResult.rows.length) {
        throw new ClientError(404, `Pre-existing file found. Delete before uploading a new file.`);
      }
      let image = req.file.buffer
  
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
        INSERT INTO "profile-picture" ("image_name", "user_id")
        VALUES ($1, $2)
        RETURNING *
      `;

      const sqlParameters = [filename, id]

      pool.query(sql, sqlParameters)
        .then(queryResult => {
          if (!queryResult.rows[0]) {
            throw new ClientError(404, `cannot find user with user_id ${id}`);
          }
          res.json(queryResult.rows[0]);
      })
    })
    .catch(err => next(err));
})

app.get('/profile-picture', (req, res, next) => {
  const {id} = req.user
  
  const sql = `
  SELECT "image_name"
  FROM "profile-picture"
  WHERE "user_id" = $1
  `;
  
  const queryParams = [id]

  pool.query(sql, queryParams)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(404, `cannot find profile picture for user with user id: ${id}`);
      }

      const imageName = queryResult.rows[0].image_name
      
      const getObjectParams = {
        Bucket: bucketName,
        Key: imageName
      }

      const command = new GetObjectCommand(getObjectParams)
      getSignedUrl(s3, command, {expiresIn: 3600})
        .then(imageUrl => {
          res.json(imageUrl)
        })
    })
    .catch(err => next(err));
})

app.get('/profile-picture/user/:userId', (req, res, next) => {
  const {id} = req.user
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  
  const userId = Number(req.params.userId)
  
  const sql = `
  SELECT "image_name"
  FROM "profile-picture"
  WHERE "user_id" = $1
  `;
  
  const queryParams = [userId]

  pool.query(sql, queryParams)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(404, `cannot find profile picture for user with user id: ${id}`);
      }

      const imageName = queryResult.rows[0].image_name
      
      const getObjectParams = {
        Bucket: bucketName,
        Key: imageName
      }

      const command = new GetObjectCommand(getObjectParams)
      getSignedUrl(s3, command, {expiresIn: 3600})
        .then(imageUrl => {
          
          res.json(imageUrl)
        })
    })
    .catch(err => next(err));
})

app.delete('/delete-profile-picture', async (req, res, next) => {
  const {id} = req.user
  const sql = `
  SELECT "image_name"
  FROM "profile-picture"
  WHERE "user_id" = $1
  `;
  const queryParams = [id]
  pool.query(sql, queryParams)
    .then(queryResult => {
      const imageName = queryResult.rows[0].image_name
      const sql2 = `
      DELETE FROM "profile-picture"
      WHERE "user_id" = $1 AND "image_name" = $2
      `;
      const queryParams2 = [id, imageName]
      pool.query(sql2, queryParams2)
        .then(queryResult => {
          const deleteObjectParams = {
            Bucket: bucketName,
            Key: imageName
          }
          const command = new DeleteObjectCommand(deleteObjectParams)
          s3.send(command) 
        })
    })
    .catch(err => next(err));
})

// // Other User Profile
// app.get('/user/:userId', (req, res, next) => {
//   const userId = Number(req.params.userId)
//   if (!userId) {
//     throw new ClientError(400, 'userId must be a positive integer');
//   }
//   const sql = `
//     SELECT "username", "profilePicture", "tagline", "bio", "linkedin", "github",  "dribbble",  "medium",  "twitter",  "youtube",  "instagram"
//     FROM "user"
//     WHERE "id" = $1
//   `;
//   const paramQueryValue = [userId];
//   pool.query(sql, paramQueryValue)
//     .then(queryResult => {
//       if (!queryResult.rows[0]) {
//         throw new ClientError(404, `cannot find user with userId: ${userId}`);
//       }
//       res.json(queryResult.rows[0]);
//     })
//     .catch(err => next(err));
// });

// // Get Other User's Nowww Entries 
// app.get('/user/:userId/entries', (req, res, next) => {
//   const { id } = req.user
//   if (!id) {
//     throw new ClientError(400, 'id must be a positive integer');
//   }
//   const userId = Number(req.params.userId)
//   const sql = `
//     SELECT * 
//     FROM "nowwww-entry"
//     WHERE "user_id" = $1
//   `
//   const queryParams = [userId]
//   pool.query(sql, queryParams)
//     .then(queryResult => {
//       if (!queryResult.rows[0]) {
//         res.json(queryResult.rows);
//         throw new ClientError(404, `cannot find entries for user with id: ${id}`);
//       }
//       res.json(queryResult.rows);
//     })
//     .catch(err => next(err));
// })

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('server has started on port', PORT)
})