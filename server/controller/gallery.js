const pool = require("../database/db");

const getGallery = async (req, res, next) => {
  try {
    const sql = ` 
      SELECT "id", "username", "tagline"
      FROM "user"
    `;
    const response = await pool.query(sql)
    const sortedResponse = response.rows.sort((a, b) => a.id - b.id)
    res.json(sortedResponse)
  } catch(error) {
    next(error)
  }
}

module.exports = {getGallery}