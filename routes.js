const express = require('express')
const router = express.Router()
const pool = require("./db");
require("dotenv").config();

// Authentication 
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

// Middleware 
const errorMiddleware = require('./error-middleware')
const ClientError = require('./client-error');
const authorizationMiddleware = require('./authorization-middleware')

// Sign-up 
router.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if ( !username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  } 
  const sql1 = `
    SELECT "username"
    FROM "user"
    WHERE "username" = $1
  `;
  const queryParams1 = [username]
  pool.query(sql1, queryParams1)
    .then(queryResult => {
      const [userDetails] = queryResult.rows
      if (userDetails) {
        throw new ClientError(400, 'username already exists');
      }
      argon2
        .hash(password)
        .then(hashedPassword => {
          const sql2 = `
            INSERT INTO "user" ("username", "hashedPassword")
            VALUES ($1, $2)
            RETURNING *;
          `; 
          const queryParams2 = [username, hashedPassword];
          pool.query(sql2, queryParams2)
            .then(queryResult => {
              const [newUser] = queryResult.rows;
              res.status(201).json(newUser);
            })
            .catch(err => {next(err)})
        })
    })
    .catch(err => {next(err)})
})

// Login 
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if ( !username || !password) {
    throw console.error('username and password are required fields', 400);
  }
  const sql = `
    SELECT "id", "hashedPassword"
    FROM "user"
    WHERE "username" = $1
  `;
  const queryParams = [username];
  pool.query(sql, queryParams)
    .then(queryResult => {
      const [userDetails] = queryResult.rows
      if (!userDetails) {
        throw console.err('invalid login')
      }
      const { id, hashedPassword } = userDetails;
      return argon2
        .verify(hashedPassword, password)
        .then(isPwMatching => {
          if (!isPwMatching) {
            throw console.error('invalid login')
          }
          const payload = { id, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET) 
          res.json({ token, user: payload})
        })
      })
      .catch(err => {next(err)})
})

// AUTHORIZATON MIDDLEWARE 
router.use(authorizationMiddleware);
// AUTHORIZATON MIDDLEWARE 

// GET My Profile
router.get('/my-profile', (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  const sql = `
    SELECT "username", "profilePicture", "tagline", "bio", "linkedin", "github",  "dribbble",  "medium",  "twitter",  "youtube",  "instagram"
    FROM "user"
    WHERE "id" = $1
  `;
  const paramQueryValue = [id];
  pool.query(sql, paramQueryValue)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(404, `cannot find user with userId: ${id}`);
      }
      res.json(queryResult.rows[0]);
    })
    .catch(err => next(err));
});

// GET !My Profile
router.get('/user/:userId', (req, res, next) => {
  const userId = Number(req.params.userId)
  if (!userId) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  const sql = `
    SELECT "username", "profilePicture", "tagline", "bio", "linkedin", "github",  "dribbble",  "medium",  "twitter",  "youtube",  "instagram"
    FROM "user"
    WHERE "id" = $1
  `;
  const paramQueryValue = [userId];
  pool.query(sql, paramQueryValue)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(404, `cannot find user with userId: ${userId}`);
      }
      res.json(queryResult.rows[0]);
    })
    .catch(err => next(err));
});

// PUT Edit Profile
router.put('/edit-profile', (req, res, next) => {
  const { id } = req.user;
  const { tagline, bio, linkedin, github, dribbble, medium, twitter, youtube, instagram } = req.body;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
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
  pool.query(sql, queryParams)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(404, `cannot find user with userId ${userId}`);
      }
      res.status(200).send(`Profile updated`)
    })
    .catch(err => next(err));
})

// Delete Profile  
router.delete('/delete-profile', (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  const sql = `
    DELETE FROM "user"
    WHERE "id" = $1
    `;
    const queryParams = [id];
    pool.query(sql, queryParams)
      .then(queryResult => {
        if (!queryResult.rows[0]) {
          throw new ClientError(`Couldn't delete profile of user with ID: ${id}`);
        }
        res.status(200).send(`Profile deleted`)
      })
      .catch(err => next(err));
})

// Add Nowww Entry
router.post('/add-entry', (req, res, next) => {
  const { id } = req.user;
  const {input, category} = req.body
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  const sql = `
    INSERT INTO "nowwww-entry" ("content", "user_id", "category_id")
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const sqlParameters = [input, id, category];
  pool.query(sql, sqlParameters)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(404, `cannot find user with userId ${userId}`);
      }
      res.status(200).send(`User ${id} added: ${input}`)
    })
    .catch(err => next(err));
});

// Get My Nowww Entries 
router.get('/my-entries', (req, res, next) => {
  const { id } = req.user
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  const sql = `
    SELECT * 
    FROM "nowwww-entry"
    WHERE "user_id" = $1
  `;
  const queryParams = [id]
  pool.query(sql, queryParams)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        res.json(queryResult.rows);
        throw new ClientError(404, `cannot find entries for user with id: ${id}`);
      }
      res.json(queryResult.rows);
    })
    .catch(err => next(err));
})

// Get !My Nowww Entries 
router.get('/user/:userId/entries', (req, res, next) => {
  const { id } = req.user
  if (!id) {
    throw new ClientError(400, 'id must be a positive integer');
  }
  const userId = Number(req.params.userId)
  const sql = `
    SELECT * 
    FROM "nowwww-entry"
    WHERE "user_id" = $1
  `
  const queryParams = [userId]
  pool.query(sql, queryParams)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        res.json(queryResult.rows);
        throw new ClientError(404, `cannot find entries for user with id: ${id}`);
      }
      res.json(queryResult.rows);
    })
    .catch(err => next(err));
})

// Edit Nowww Entry 
router.put('/edit-entry/:entryId', (req, res, next) => {
  const { id } = req.user;
  const entryId = Number(req.params.entryId)
  const { input, category } = req.body 
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  const sql = `
    UPDATE "nowwww-entry"
    SET "content" = coalesce($1, "content"),
        "category_id" = coalesce($2, "category_id")
    WHERE "user_id" = $3
    AND "id" = $4
    RETURNING *
`;
const queryParams = [input, category, id, entryId];
pool.query(sql, queryParams)
  .then(queryResult => {
    if (!queryResult.rows[0]) {
      throw new ClientError(404, `cannot edit entry with given parameters`);
    }
    res.status(200).send(`Entry ${entryId} updated`)
  })
  .catch(err => next(err));
})

// Delete Nowww Entry 
router.delete('/delete-entry/:entryId', (req, res, next) => {
  const { id } = req.user;
  const entryId = Number(req.params.entryId);
  const sql = `
    DELETE FROM "nowwww-entry"
    WHERE "id" = $1
    AND "user_id" = $2
  `;
  const queryParams = [entryId, id];
  pool.query(sql, queryParams)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(`Could not delete entry with given parameters`);
      }
      res.status(200).send(`Entry ${entryId} deleted`)
    })
    .catch(err => next(err));
});

// Delete All Nowww Entries 
router.delete('/delete-all-entries', (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    throw new ClientError(400, 'userId must be a positive integer');
  }
  const sql = `
    DELETE FROM "nowwww-entry"
    WHERE "user_id" = $1
  `;
  const queryParams = [id];
  pool.query(sql, queryParams)
    .then(queryResult => {
      if (!queryResult.rows[0]) {
        throw new ClientError(`Could not complete deletion of all entries`);
      }
      res.status(200).send(`Entry ${entryId} deleted`)
    })
    .catch(err => next(err));
})

// Gallery 
router.get('/gallery', (req, res, next) => {
  const sql = ` 
    SELECT "id", "username", "tagline"
    FROM "user"
  `;
  pool.query(sql)
    .then(queryResult => {
      res.json(queryResult.rows)
    })
    .catch(err => {next(err)})
})

router.use(errorMiddleware);

module.exports = router