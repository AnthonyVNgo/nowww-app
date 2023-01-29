const Pool = require('pg').Pool;
require("dotenv").config();

const devConfig = new Pool ({
  user: process.env.PSQL_USER,
  password: process.env.PSQL_SECRET,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DB,
  port: process.env.PSQL_PORT
})

const herokuConnectionString = process.env.DATABASE_URL;
const productionConfig = new Pool({
  connectionString: herokuConnectionString,
  ssl: { 
    rejectUnauthorized: false 
  }
})

const pool = process.env.NODE_ENV === "production" 
  ? productionConfig
  : devConfig
 
module.exports = pool;