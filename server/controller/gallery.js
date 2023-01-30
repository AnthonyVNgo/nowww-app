const pool = require("../database/db");

const getGallery = async (req, res, next) => {
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
}

module.exports = {getGallery}