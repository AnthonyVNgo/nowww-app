const express = require('express')
const router = express.Router()

// Tester 
router.get('/getter', (req, res, next) => {
  res.status(200).send('getter from /api/getter')  
})

// // Sign-up 
// router.post('/sign-up', (req, res, next) => {
//   const { username, password } = req.body;

//   if ( !username || !password) {
//     throw new ClientError(400, 'username and password are required fields');
//   } 
  
//   const sql1 = `
//     SELECT "username"
//     FROM "user"
//     WHERE "username" = $1
//   `;

//   const queryParams1 = [username]

//   pool.query(sql1, queryParams1)
//     .then(queryResult => {
//       const [userDetails] = queryResult.rows

//       if (userDetails) {
//         throw new ClientError(400, 'username already exists');
//       }

//       argon2
//         .hash(password)
//         .then(hashedPassword => {
//           const sql2 = `
//             INSERT INTO "user" ("username", "hashedPassword")
//             VALUES ($1, $2)
//             RETURNING *;
//           `;
        
//           const queryParams2 = [username, hashedPassword];
        
//           pool.query(sql2, queryParams2)
//             .then(queryResult => {
//               const [newUser] = queryResult.rows;
//               res.status(201).json(newUser);
//             })
//             .catch(err => {next(err)})
//         })
//     })
//     .catch(err => {next(err)})

// })

// // Login 
// router.post('/login', (req, res, next) => {
//   const { username, password } = req.body;
//   if ( !username || !password) {
//     throw console.error('username and password are required fields', 400);
//   }

//   const sql = `
//     SELECT "id", "hashedPassword"
//     FROM "user"
//     WHERE "username" = $1
//   `;
//   const queryParams = [username];

//   pool.query(sql, queryParams)
//     .then(queryResult => {
//       const [userDetails] = queryResult.rows
      
//       if (!userDetails) {
//         throw console.err('invalid login')
//       }

//       const { id, hashedPassword } = userDetails;
      
//       return argon2
//         .verify(hashedPassword, password)
//         .then(isPwMatching => {
//           if (!isPwMatching) {
//             throw console.error('invalid login')
//           }
//           const payload = { id, username };
//           const token = jwt.sign(payload, process.env.TOKEN_SECRET) 
//           res.json({ token, user: payload})
//         })
//       })
//       .catch(err => {next(err)})
// })

module.exports = router