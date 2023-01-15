const Pool = require('pg').Pool;
require('dotenv').config({ path: './.env' })

const devConfig = {
  user: process.env.PSQL_USER,
  password: process.env.PSQL_SECRET,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DB,
  port: process.env.PSQL_PORT
}

// const devConfig = {
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   port: process.env.PG_PORT,
// };


const prodConfig = process.env.DATABASE_URL; //heroku addons

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production" 
      ? prodConfig 
      : devConfig
});
 




module.exports = pool