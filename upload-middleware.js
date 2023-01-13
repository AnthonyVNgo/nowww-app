const multer = require('multer');

const storage = multer.memoryStorage()
const uploadsMiddleware = multer({storage}).single('image')
  
module.exports = uploadsMiddleware;