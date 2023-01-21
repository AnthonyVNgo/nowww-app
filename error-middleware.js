const ClientError = require('./client-error');
const {JsonWebTokenError } = require('jsonwebtoken')

function errorMiddleware(err, req, res, next) {
  
  if (err instanceof ClientError) {
    res.status(err.status).json({
      error: err.message
    }).sendFile(path.join(__dirname, "client/build/index.html"));
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      error: 'invalid access token'
    }).sendFile(path.join(__dirname, "client/build/index.html"));
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    }).sendFile(path.join(__dirname, "client/build/index.html"));
  }
}

module.exports = errorMiddleware;