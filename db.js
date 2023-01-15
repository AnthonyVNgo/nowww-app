const Pool = require('pg').Pool;
require('dotenv').config({ path: './.env' })

const devConfig = {
  user: process.env.PSQL_USER,
  password: process.env.PSQL_SECRET,
  host: process.env.PSQL_HOST,
  port: process.env.PSQL_PORT,
  database: process.env.PSQL_DB
}

const prodConfig = {
  connectionString: process.env.DATABASE_URL // supplied by Heroku Postgres
}

// console.log('devConfig:', devConfig)
// console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const pool = new Pool(
  process.env.NODE_ENV === "production"
    ? prodConfig
    : devConfig
);
 
module.exports = pool