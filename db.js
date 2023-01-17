const Pool = require('pg').Pool;
require("dotenv").config();

const devConfig = {
  user: process.env.PSQL_USER,
  password: process.env.PSQL_SECRET,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DB,
  port: process.env.PSQL_PORT
}

const proConfig = process.env.DATABASE_URL; //heroku addons

const pool = new Pool({
  connectionString: process.env.NODE_ENV === "production" ? proConfig : devConfig,
  ssl: { 
    rejectUnauthorized: false 
  }
});
 
module.exports = pool;